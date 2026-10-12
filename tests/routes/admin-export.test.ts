import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/admin/export/route";
import { getLeadStore } from "@/lib/leads/store";
import { leadInput } from "../helpers/leads";

const authorization = vi.hoisted(() => ({ value: null as string | null }));

// The guard reads the request headers through Next.js; the test provides them.
vi.mock("next/headers", () => ({
  headers: () =>
    Promise.resolve(new Headers(authorization.value ? { authorization: authorization.value } : {})),
}));

const BASIC = `Basic ${Buffer.from("valentin:secret").toString("base64")}`;

describe("GET /admin/export/", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_USER", "valentin");
    vi.stubEnv("ADMIN_PASSWORD", "secret");
    authorization.value = null;
  });

  it("answers not found without the credentials", async () => {
    await getLeadStore().insert(leadInput());
    const response = await GET();

    expect(response.status).toBe(404);
    expect(await response.text()).not.toContain("ada@example.com");
  });

  it("exports every lead as CSV for the admin", async () => {
    authorization.value = BASIC;
    await getLeadStore().insert(leadInput());

    const response = await GET();
    const [header, row] = (await response.text())
      .replace("﻿", "")
      .trim()
      .split("\n")
      .map((line) => line.trim());

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/csv");
    expect(header).toContain('"id";"date";"statut"');
    expect(row).toContain('"Ada Lovelace";"ada@example.com";"Analytical Engines"');
    expect(header.endsWith('"notes";"lotus";"lotus_id";"lotus_erreur"')).toBe(true);
    expect(row.endsWith('"pending";"";""')).toBe(true);
  });

  it("neutralises cells a spreadsheet would run as a formula", async () => {
    authorization.value = BASIC;
    await getLeadStore().insert(
      leadInput({ name: "=HYPERLINK(1)", company: '+1 "quoted"', message: "@cmd and more text" }),
    );

    const csv = await (await GET()).text();

    expect(csv).toContain(`"'=HYPERLINK(1)"`);
    expect(csv).toContain(`"'+1 ""quoted"""`);
    expect(csv).toContain(`"'@cmd and more text"`);
  });
});
