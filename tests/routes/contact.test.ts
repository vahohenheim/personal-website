import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { getLeadStore } from "@/lib/leads/store";
import { formBody, jsonRequest } from "../helpers/leads";
import { created, enableLotus, mockLotus, status } from "../helpers/lotus";

const scheduled = vi.hoisted(() => ({ tasks: [] as (() => unknown)[] }));

// `after` needs a running Next.js request. Here its callbacks are kept, and run by the
// test once the response is in hand, as Next.js does.
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  after: (callback: () => unknown) => {
    scheduled.tasks.push(callback);
  },
}));

const runAfter = async () => {
  for (const task of scheduled.tasks.splice(0)) {
    await task();
  }
};

afterEach(() => {
  scheduled.tasks = [];
  vi.unstubAllGlobals();
});

const URL = "http://localhost/api/contact/";
const send = (body: unknown) => POST(jsonRequest(URL, body));

describe("POST /api/contact/", () => {
  it("stores a valid lead and answers ok", async () => {
    const response = await send(formBody());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(await getLeadStore().list()).toMatchObject([
      {
        name: "Ada Lovelace",
        email: "ada@example.com",
        need: "design-system",
        source: "linkedin.com",
      },
    ]);
  });

  it.each([
    ["need_required", { need: "" }],
    ["message_too_short", { message: "too short" }],
    ["name_required", { name: "" }],
    ["invalid_email", { email: "ada@" }],
  ])("refuses an incomplete form with %s", async (error, overrides) => {
    const response = await send(formBody(overrides));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error });
    expect(await getLeadStore().list()).toEqual([]);
  });

  it.each([["not json"], ["[1, 2]"], ['"text"'], ["null"]])("refuses the body %s", async (body) => {
    const response = await send(body);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "invalid_body" });
  });

  it("answers ok to a bot without storing anything", async () => {
    const honeypot = await send(formBody({ website: "https://spam.example" }));
    const tooFast = await send(formBody({ startedAt: Date.now() }));

    expect(await honeypot.json()).toEqual({ ok: true });
    expect(await tooFast.json()).toEqual({ ok: true });
    expect(await getLeadStore().list()).toEqual([]);
  });

  it("answers unavailable in production without a database", async () => {
    vi.stubEnv("LEADS_MEMORY_STORE", "");
    vi.stubEnv("NODE_ENV", "production");
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await send(formBody());

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "unavailable" });
  });

  it("never writes the lead to the logs", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.stubEnv("LEADS_MEMORY_STORE", "");
    vi.stubEnv("NODE_ENV", "production");

    await send(formBody());

    const logged = JSON.stringify([...error.mock.calls, ...warn.mock.calls]);

    expect(logged).not.toContain("ada@example.com");
    expect(logged).not.toContain("Ada Lovelace");
    expect(logged).not.toContain("design system");
  });
});

describe("POST /api/contact/: forwarding to lotus", () => {
  it("answers the visitor before anything is sent to lotus", async () => {
    enableLotus();
    const calls = mockLotus(() => created("lotus-7"));

    const response = await send(formBody());

    expect(await response.json()).toEqual({ ok: true });
    expect(calls).toHaveLength(0);
    expect((await getLeadStore().list())[0]).toMatchObject({ lotusStatus: "pending" });

    await runAfter();

    expect(calls).toHaveLength(1);
    expect(JSON.parse(calls[0].body)).toMatchObject({
      externalId: "site-1",
      email: "ada@example.com",
      need: "Design system",
      timeline: "Dès que possible",
      referrer: "linkedin.com",
    });
    expect((await getLeadStore().list())[0]).toMatchObject({
      lotusStatus: "synced",
      lotusLeadId: "lotus-7",
    });
  });

  it("answers ok and keeps the lead pending when lotus is down", async () => {
    enableLotus();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    mockLotus(() => status(503));

    const response = await send(formBody());
    await runAfter();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect((await getLeadStore().list())[0]).toMatchObject({
      lotusStatus: "pending",
      lotusError: "http_503",
    });
  });

  it("sends nothing while forwarding is off", async () => {
    const calls = mockLotus(() => created());

    await send(formBody());
    await runAfter();

    expect(calls).toHaveLength(0);
  });

  it("sends nothing for a bot or an invalid form", async () => {
    enableLotus();
    const calls = mockLotus(() => created());

    await send(formBody({ website: "https://spam.example" }));
    await send(formBody({ email: "nope" }));
    await runAfter();

    expect(calls).toHaveLength(0);
  });
});
