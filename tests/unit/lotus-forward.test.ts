import { afterEach, describe, expect, it, vi } from "vitest";
import { buildLotusPayload, forwardLead, signLotusBody } from "@/lib/lotus/forward";
import { makeLead } from "../helpers/leads";
import { created, duplicate, LOTUS_SECRET, LOTUS_URL, mockLotus, status } from "../helpers/lotus";

const config = { url: LOTUS_URL, secret: LOTUS_SECRET };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("signLotusBody", () => {
  // The test vector of the contract (../lotus/docs/integration-site.md, § 3).
  it("returns the signature of the test vector", () => {
    expect(
      signLotusBody(
        "test-secret",
        "1800000000",
        '{"name":"Ada","email":"ada@example.com","need":"Design system"}',
      ),
    ).toBe("sha256=b12260bc9e63ba97f8c8738949b9fb809245439dfd2c5d831396e06e419dba38");
  });

  it("changes with the timestamp, the body and the secret", () => {
    const reference = signLotusBody("secret", "1", "{}");

    expect(signLotusBody("secret", "2", "{}")).not.toBe(reference);
    expect(signLotusBody("secret", "1", "{ }")).not.toBe(reference);
    expect(signLotusBody("other", "1", "{}")).not.toBe(reference);
  });
});

describe("buildLotusPayload", () => {
  it("maps a lead to the fields of the contract, with French labels", () => {
    const lead = makeLead({
      id: 42,
      locale: "en",
      need: "tech-lead",
      timeline: "one-to-three-months",
    });

    expect(buildLotusPayload(lead)).toEqual({
      externalId: "site-42",
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "We need help with our design system.",
      company: "Analytical Engines",
      need: "Lead technique",
      timeline: "Dans 1 à 3 mois",
      locale: "en",
      referrer: "linkedin.com",
      submittedAt: "2026-10-01T10:00:00.000Z",
    });
  });

  it("leaves out what the lead does not have", () => {
    const payload = buildLotusPayload(makeLead({ company: null, timeline: null, source: null }));

    expect(payload).not.toHaveProperty("company");
    expect(payload).not.toHaveProperty("timeline");
    expect(payload).not.toHaveProperty("referrer");
  });

  it("never sends the follow-up of the lead", () => {
    const payload = JSON.stringify(
      buildLotusPayload(
        makeLead({
          status: "quoted",
          notes: "Private note.",
          amount: 4500,
          followUpOn: "2026-10-20",
        }),
      ),
    );

    expect(payload).not.toContain("Private note");
    expect(payload).not.toContain("4500");
    expect(payload).not.toContain("quoted");
    expect(payload).not.toContain("2026-10-20");
  });

  it("stays far below the 32 KB lotus accepts, even with the longest lead", () => {
    const payload = buildLotusPayload(
      makeLead({ message: "é".repeat(3000), name: "n".repeat(80), company: "c".repeat(120) }),
    );

    expect(Buffer.byteLength(JSON.stringify(payload))).toBeLessThan(32 * 1024);
  });
});

describe("forwardLead", () => {
  it("signs the exact body it sends, with the time of sending", async () => {
    const calls = mockLotus(() => created());

    await forwardLead(makeLead({ id: 7 }), config, () => 1_800_000_000_999);

    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(LOTUS_URL);
    expect(calls[0].headers["content-type"]).toBe("application/json");
    expect(calls[0].headers["x-lotus-timestamp"]).toBe("1800000000");
    expect(calls[0].headers["x-lotus-signature"]).toBe(
      signLotusBody(LOTUS_SECRET, "1800000000", calls[0].body),
    );
    expect(JSON.parse(calls[0].body)).toMatchObject({
      externalId: "site-7",
      need: "Design system",
    });
  });

  it("is synced when lotus creates the lead or already knows it", async () => {
    mockLotus((_call, index) => (index === 0 ? created("abc") : duplicate(12)));

    expect(await forwardLead(makeLead(), config)).toEqual({
      status: "synced",
      lotusLeadId: "abc",
      duplicate: false,
    });
    expect(await forwardLead(makeLead(), config)).toEqual({
      status: "synced",
      lotusLeadId: "12",
      duplicate: true,
    });
  });

  it("is synced even when lotus confirms without a readable id", async () => {
    mockLotus(() => new Response("ok", { status: 201 }));

    expect(await forwardLead(makeLead(), config)).toEqual({
      status: "synced",
      lotusLeadId: null,
      duplicate: false,
    });
  });

  it.each([400, 413])("is rejected for good on %i", async (code) => {
    mockLotus(() => status(code));

    expect(await forwardLead(makeLead(), config)).toEqual({
      status: "rejected",
      code: `http_${code}`,
    });
  });

  it.each([401, 403, 404, 429, 500, 502, 503])("stays pending on %i", async (code) => {
    mockLotus(() => status(code));

    expect(await forwardLead(makeLead(), config)).toEqual({
      status: "pending",
      code: `http_${code}`,
    });
  });

  it("stays pending on a network error or a timeout, without throwing", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    expect(await forwardLead(makeLead(), config)).toEqual({ status: "pending", code: "network" });

    const timeout = Object.assign(new Error("timed out"), { name: "TimeoutError" });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(timeout));
    expect(await forwardLead(makeLead(), config)).toEqual({ status: "pending", code: "timeout" });
  });
});
