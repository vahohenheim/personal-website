import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/cron/analytics-snapshot/route";

const URL = "http://localhost/api/cron/analytics-snapshot/";
const call = (authorization?: string) =>
  GET(new Request(URL, { headers: authorization ? { authorization } : {} }));

describe("GET /api/cron/analytics-snapshot/", () => {
  it("is closed without CRON_SECRET, whatever is sent", async () => {
    expect((await call()).status).toBe(403);
    expect((await call("Bearer ")).status).toBe(403);
    expect((await call("Bearer undefined")).status).toBe(403);
  });

  it("refuses a wrong secret", async () => {
    vi.stubEnv("CRON_SECRET", "right-secret");

    expect((await call()).status).toBe(403);
    expect((await call("Bearer wrong-secret")).status).toBe(403);
    expect((await call("right-secret")).status).toBe(403);
  });

  it("runs with the right secret, and has nothing to do without a token", async () => {
    vi.stubEnv("CRON_SECRET", "right-secret");
    vi.stubEnv("WEB_ANALYTICS_TOKEN", "");

    const response = await call("Bearer right-secret");

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ status: "unconfigured" });
  });
});
