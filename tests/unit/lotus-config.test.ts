import { describe, expect, it, vi } from "vitest";
import { getLotusState } from "@/lib/lotus/config";

const set = (url: string, secret = "secret") => {
  vi.stubEnv("LOTUS_WEBHOOK_URL", url);
  vi.stubEnv("LOTUS_WEBHOOK_SECRET", secret);
};

/** As on Vercel: a database, no memory store. */
const withDatabase = () => {
  vi.stubEnv("LEADS_MEMORY_STORE", "");
  vi.stubEnv("DATABASE_URL", "postgres://example.invalid/db");
};

describe("getLotusState", () => {
  it("is off unless both variables are set", () => {
    expect(getLotusState()).toEqual({ status: "unconfigured" });

    set("https://lotus.example/api/webhooks/leads", "");
    expect(getLotusState()).toEqual({ status: "unconfigured" });

    set("", "secret");
    expect(getLotusState()).toEqual({ status: "unconfigured" });
  });

  it("is active with a database and an HTTPS URL", () => {
    withDatabase();
    set("https://lotus.example/api/webhooks/leads");

    expect(getLotusState()).toEqual({
      status: "active",
      config: { url: "https://lotus.example/api/webhooks/leads", secret: "secret" },
    });
  });

  it("refuses what is not a URL, and plain HTTP to a remote host", () => {
    withDatabase();

    set("lotus.example/api");
    expect(getLotusState()).toEqual({ status: "invalid" });

    set("http://lotus.example/api/webhooks/leads");
    expect(getLotusState()).toEqual({ status: "invalid" });

    set("ftp://localhost/leads");
    expect(getLotusState()).toEqual({ status: "invalid" });
  });

  // In memory, ids restart at 1: `site-1` would collide with a real lead in lotus.
  it("never lets a build with leads in memory reach a remote lotus", () => {
    set("https://lotus.example/api/webhooks/leads");

    expect(getLotusState()).toEqual({ status: "blocked" });
  });

  it("lets a build with leads in memory reach a lotus on the same machine", () => {
    for (const url of ["http://localhost:3000/api/webhooks/leads", "http://127.0.0.1:3000/x"]) {
      set(url);

      expect(getLotusState().status).toBe("active");
    }
  });
});
