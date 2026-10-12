import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, describe, expect, it } from "vitest";
import { adminAuthorization, get, lotusReceived, post, setLotus, SMOKE } from "./settings";

// The whole path of a lead, on the built site: form, storage, forwarding after the
// response, daily retry. lotus is the stand-in of lotus-stub.ts.

const sendForm = (email: string) =>
  post("/api/contact/", {
    need: "tech-lead",
    timeline: "one-to-three-months",
    message: "A lead for the lotus smoke test.",
    name: "Lotus Smoke",
    email,
    company: "Smoke & Co",
    locale: "en",
    source: "smoke.example",
    website: "",
    startedAt: Date.now() - 10_000,
  });

/** The row of a lead in the CSV export of the admin, as cells. */
const exportRow = async (email: string) => {
  const csv = await (await get("/admin/export/", { authorization: adminAuthorization })).text();
  const [header, ...rows] = csv
    .replace("﻿", "")
    .trim()
    .split("\n")
    .map((line) => line.trim().slice(1, -1).split('";"'));
  const row = rows.find((cells) => cells.includes(email));

  return row ? Object.fromEntries(header.map((name, index) => [name, row[index]])) : null;
};

/** Forwarding happens after the response: wait until the admin shows its result. */
const waitForSync = async (email: string, expected: (row: Record<string, string>) => boolean) => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const row = await exportRow(email);

    if (row && expected(row)) {
      return row;
    }

    await sleep(250);
  }

  return exportRow(email);
};

const runCron = async () =>
  (await (
    await get("/api/cron/lotus-sync/", { authorization: `Bearer ${SMOKE.cronSecret}` })
  ).json()) as Record<string, unknown>;

afterAll(() => setLotus("up"));

describe("a lead, from the form to lotus", () => {
  it("is forwarded right after the visitor got the answer", async () => {
    await setLotus("up");
    const email = `forwarded-${Date.now()}@example.com`;

    const response = await sendForm(email);

    expect(await response.json()).toEqual({ ok: true });

    const row = await waitForSync(email, (cells) => cells.lotus === "synced");
    const payload = (await lotusReceived()).find((lead) => lead.email === email);

    expect(row).toMatchObject({ lotus: "synced", lotus_erreur: "" });
    expect(row?.lotus_id).toMatch(/^lotus-\d+$/);
    expect(payload).toEqual({
      externalId: `site-${row?.id}`,
      name: "Lotus Smoke",
      email,
      message: "A lead for the lotus smoke test.",
      company: "Smoke & Co",
      need: "Lead technique",
      timeline: "Dans 1 à 3 mois",
      locale: "en",
      referrer: "smoke.example",
      submittedAt: row?.date,
    });
  });

  it("stays pending when lotus is down, then is sent by the daily job", async () => {
    await setLotus("down");
    const email = `pending-${Date.now()}@example.com`;

    const response = await sendForm(email);

    // The visitor is never told about lotus.
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(await waitForSync(email, (cells) => cells.lotus_erreur !== "")).toMatchObject({
      lotus: "pending",
      lotus_id: "",
      lotus_erreur: "http_503",
    });

    // Still down: the job tries, and the lead stays pending.
    expect(await runCron()).toMatchObject({ status: "ok", synced: 0, pending: 1 });

    await setLotus("up");

    expect(await runCron()).toMatchObject({ status: "ok", synced: 1, pending: 0, rejected: 0 });
    expect(await exportRow(email)).toMatchObject({ lotus: "synced", lotus_erreur: "" });
    expect((await lotusReceived()).filter((lead) => lead.email === email)).toHaveLength(1);

    // Nothing left to send.
    expect(await runCron()).toEqual({
      status: "ok",
      synced: 0,
      rejected: 0,
      pending: 0,
      skipped: 0,
    });
  });

  it("never creates a duplicate when the answer of lotus was lost", async () => {
    await setLotus("lost-answer");
    const email = `duplicate-${Date.now()}@example.com`;

    await sendForm(email);

    // lotus created the lead, but the site only saw an error.
    expect(await waitForSync(email, (cells) => cells.lotus_erreur !== "")).toMatchObject({
      lotus: "pending",
      lotus_erreur: "http_500",
    });

    await setLotus("up");

    // Sent again with the same `externalId`: lotus answers that it already has it.
    expect(await runCron()).toMatchObject({ status: "ok", synced: 1 });
    expect(await exportRow(email)).toMatchObject({ lotus: "synced" });
    expect((await lotusReceived()).filter((lead) => lead.email === email)).toHaveLength(1);
  });

  it("shows the state of each lead in the admin", async () => {
    const admin = await (await get("/admin/", { authorization: adminAuthorization })).text();

    expect(admin).toContain("Transfert vers lotus");
    expect(admin).toContain("transmis le");
  });

  it("keeps the cron route closed without its secret", async () => {
    expect((await get("/api/cron/lotus-sync/")).status).toBe(403);
    expect((await get("/api/cron/lotus-sync/", { authorization: "Bearer wrong" })).status).toBe(
      403,
    );
  });
});
