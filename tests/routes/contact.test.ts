import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { getLeadStore } from "@/lib/leads/store";
import { formBody, jsonRequest } from "../helpers/leads";

// `after` needs a running Next.js request; here its callback is simply run at once.
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  after: (callback: () => unknown) => {
    void callback();
  },
}));

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
