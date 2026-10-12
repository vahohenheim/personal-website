import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/cron/lotus-sync/route";
import { getLeadStore } from "@/lib/leads/store";
import { leadInput } from "../helpers/leads";
import { created, enableLotus, mockLotus } from "../helpers/lotus";

const URL = "http://localhost/api/cron/lotus-sync/";
const call = (authorization?: string) =>
  GET(new Request(URL, { headers: authorization ? { authorization } : {} }));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GET /api/cron/lotus-sync/", () => {
  it("is closed without CRON_SECRET and refuses a wrong one", async () => {
    enableLotus();
    const calls = mockLotus(() => created());
    await getLeadStore().insert(leadInput());

    expect((await call()).status).toBe(403);
    expect((await call("Bearer anything")).status).toBe(403);

    vi.stubEnv("CRON_SECRET", "right-secret");

    expect((await call("Bearer wrong-secret")).status).toBe(403);
    expect(calls).toHaveLength(0);
  });

  it("has nothing to do while forwarding is off", async () => {
    vi.stubEnv("CRON_SECRET", "right-secret");

    const response = await call("Bearer right-secret");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "unconfigured" });
  });

  it("forwards pending leads and answers with counts only", async () => {
    vi.stubEnv("CRON_SECRET", "right-secret");
    enableLotus();
    mockLotus(() => created("lotus-1"));
    await getLeadStore().insert(leadInput());

    const response = await call("Bearer right-secret");
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(JSON.parse(text)).toEqual({
      status: "ok",
      synced: 1,
      rejected: 0,
      pending: 0,
      skipped: 0,
    });
    expect(text).not.toContain("ada@example.com");
    expect((await getLeadStore().list())[0]).toMatchObject({ lotusStatus: "synced" });
  });
});
