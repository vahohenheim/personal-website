import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLeadStore } from "@/lib/leads/store";
import { countSyncDisplays, getSyncDisplay } from "@/lib/lotus/state";
import { LOTUS_BATCH_SIZE, syncLead, syncPendingLeads } from "@/lib/lotus/sync";
import { type Lead } from "@/lib/models/lead";
import { leadInput, makeLead } from "../helpers/leads";
import { created, duplicate, enableLotus, mockLotus, status } from "../helpers/lotus";

const insert = (count: number) =>
  Promise.all(
    Array.from({ length: count }, (_, index) =>
      getLeadStore().insert(leadInput({ name: `Lead ${index + 1}` })),
    ),
  );

const byId = async (id: number) => {
  const lead = (await getLeadStore().list()).find((candidate) => candidate.id === id);

  if (!lead) {
    throw new Error(`Lead ${id} not found`);
  }

  return lead;
};

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("lead store: sync marks", () => {
  it("stores a new lead as pending and returns it", async () => {
    const lead = await getLeadStore().insert(leadInput());

    expect(lead).toMatchObject({
      id: 1,
      name: "Ada Lovelace",
      lotusStatus: "pending",
      lotusLeadId: null,
      lotusSyncedAt: null,
      lotusError: null,
      lotusAttempts: 0,
      lotusAttemptedAt: null,
    });
    expect(Number.isNaN(Date.parse(lead.createdAt))).toBe(false);
  });

  it("records a confirmation, a refusal and a failed attempt", async () => {
    const store = getLeadStore();
    await insert(3);

    await store.recordSync(1, { status: "synced", lotusLeadId: "abc", duplicate: false });
    await store.recordSync(2, { status: "rejected", code: "http_400" });
    await store.recordSync(3, { status: "pending", code: "http_503" });
    await store.recordSync(3, { status: "pending", code: "timeout" });

    expect(await byId(1)).toMatchObject({
      lotusStatus: "synced",
      lotusLeadId: "abc",
      lotusError: null,
      lotusAttempts: 1,
    });
    expect((await byId(1)).lotusSyncedAt).not.toBeNull();
    expect(await byId(2)).toMatchObject({ lotusStatus: "rejected", lotusError: "http_400" });
    expect(await byId(3)).toMatchObject({
      lotusStatus: "pending",
      lotusError: "timeout",
      lotusAttempts: 2,
      lotusSyncedAt: null,
    });
  });

  it("clears the last error once lotus confirms", async () => {
    const store = getLeadStore();
    await insert(1);

    await store.recordSync(1, { status: "pending", code: "http_503" });
    await store.recordSync(1, { status: "synced", lotusLeadId: "abc", duplicate: true });

    expect(await byId(1)).toMatchObject({
      lotusStatus: "synced",
      lotusError: null,
      lotusAttempts: 2,
    });
  });

  it("never undoes a confirmation with a later failure", async () => {
    const store = getLeadStore();
    await insert(1);

    await store.recordSync(1, { status: "synced", lotusLeadId: "abc", duplicate: false });
    await store.recordSync(1, { status: "pending", code: "timeout" });
    await store.recordSync(1, { status: "rejected", code: "http_400" });

    expect(await byId(1)).toMatchObject({
      lotusStatus: "synced",
      lotusLeadId: "abc",
      lotusError: null,
    });
  });

  it("lists pending leads only, oldest first, within the limit", async () => {
    const store = getLeadStore();
    await insert(4);
    await store.recordSync(2, { status: "synced", lotusLeadId: "abc", duplicate: false });
    await store.recordSync(3, { status: "rejected", code: "http_400" });

    expect(
      (await store.listPendingSync("2000-01-01T00:00:00.000Z", 10)).map((lead) => lead.id),
    ).toEqual([1, 4]);
    expect(await store.listPendingSync("2000-01-01T00:00:00.000Z", 1)).toHaveLength(1);
    expect(await store.listPendingSync("2999-01-01T00:00:00.000Z", 10)).toEqual([]);
  });

  it("keeps the follow-up and the sync marks apart", async () => {
    const store = getLeadStore();
    await insert(1);
    await store.recordSync(1, { status: "synced", lotusLeadId: "abc", duplicate: false });
    await store.updateFollowUp(1, {
      status: "won",
      notes: "Signed.",
      amount: 9000,
      followUpOn: null,
    });

    expect(await byId(1)).toMatchObject({ status: "won", notes: "Signed.", lotusStatus: "synced" });
  });
});

describe("syncLead", () => {
  it("does nothing while forwarding is off", async () => {
    const calls = mockLotus(() => created());
    const [lead] = await insert(1);

    await syncLead(lead);

    expect(calls).toHaveLength(0);
    expect(await byId(1)).toMatchObject({ lotusStatus: "pending", lotusAttempts: 0 });
  });

  it("marks the lead as synced when lotus confirms", async () => {
    enableLotus();
    mockLotus(() => created("lotus-9"));
    const [lead] = await insert(1);

    await syncLead(lead);

    expect(await byId(1)).toMatchObject({ lotusStatus: "synced", lotusLeadId: "lotus-9" });
  });

  it("leaves the lead pending when lotus is down, and never throws", async () => {
    enableLotus();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    const [lead] = await insert(1);

    await expect(syncLead(lead)).resolves.toBeUndefined();
    expect(await byId(1)).toMatchObject({
      lotusStatus: "pending",
      lotusError: "network",
      lotusAttempts: 1,
    });
  });

  it("never throws when the result cannot be recorded", async () => {
    enableLotus();
    mockLotus(() => created());
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const store = getLeadStore();
    vi.spyOn(store, "recordSync").mockRejectedValue(new Error("database down"));

    await expect(syncLead(makeLead())).resolves.toBeUndefined();
  });

  it("logs the id and the outcome, never the lead", async () => {
    enableLotus();
    mockLotus(() => status(400));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const [lead] = await insert(1);

    await syncLead(lead);

    const logged = JSON.stringify(warn.mock.calls);

    expect(logged).toContain("http_400");
    expect(logged).not.toContain("Lead 1");
    expect(logged).not.toContain("ada@example.com");
    expect(logged).not.toContain("design system");
  });
});

describe("syncPendingLeads", () => {
  it("has nothing to do while forwarding is off", async () => {
    const calls = mockLotus(() => created());
    await insert(2);

    expect(await syncPendingLeads()).toEqual({ status: "unconfigured" });
    expect(calls).toHaveLength(0);
  });

  it("forwards what is pending and counts the outcomes", async () => {
    enableLotus();
    await insert(4);
    await getLeadStore().recordSync(1, { status: "synced", lotusLeadId: "abc", duplicate: false });
    const calls = mockLotus((_call, index) => [created("b"), status(400), status(503)][index]);

    expect(await syncPendingLeads()).toEqual({
      status: "ok",
      synced: 1,
      rejected: 1,
      pending: 1,
      skipped: 0,
    });
    expect(
      calls.map((call) => (JSON.parse(call.body) as { externalId: string }).externalId),
    ).toEqual(["site-2", "site-3", "site-4"]);
  });

  it("sends a lead again without creating a duplicate: lotus answers that it knows it", async () => {
    enableLotus();
    await insert(1);
    mockLotus(() => status(503));
    await syncPendingLeads();

    const calls = mockLotus(() => duplicate("abc"));

    expect(await syncPendingLeads()).toMatchObject({ synced: 1, pending: 0 });
    expect(JSON.parse(calls[0].body)).toMatchObject({ externalId: "site-1" });
    expect(await byId(1)).toMatchObject({
      lotusStatus: "synced",
      lotusLeadId: "abc",
      lotusAttempts: 2,
    });
  });

  it("never sends again a lead that is synced or rejected", async () => {
    enableLotus();
    await insert(2);
    await getLeadStore().recordSync(1, { status: "synced", lotusLeadId: "abc", duplicate: false });
    await getLeadStore().recordSync(2, { status: "rejected", code: "http_400" });
    const calls = mockLotus(() => created());

    expect(await syncPendingLeads()).toMatchObject({ status: "ok", synced: 0 });
    expect(calls).toHaveLength(0);
  });

  it("sends at most one batch per run", async () => {
    enableLotus();
    await insert(LOTUS_BATCH_SIZE + 3);
    const calls = mockLotus(() => created());

    expect(await syncPendingLeads()).toMatchObject({ synced: LOTUS_BATCH_SIZE, skipped: 0 });
    expect(calls).toHaveLength(LOTUS_BATCH_SIZE);
  });

  it("stops after three unavailable answers in a row: lotus is down", async () => {
    enableLotus();
    await insert(10);
    const calls = mockLotus(() => status(503));

    expect(await syncPendingLeads()).toEqual({
      status: "ok",
      synced: 0,
      rejected: 0,
      pending: 3,
      skipped: 7,
    });
    expect(calls).toHaveLength(3);
  });

  it("stops taking new leads once its time budget is spent", async () => {
    enableLotus();
    await insert(5);
    mockLotus(() => created());
    let clock = Date.now();

    // Each look at the clock moves it 30 seconds forward.
    const result = await syncPendingLeads(() => (clock += 30_000));

    expect(result).toMatchObject({ status: "ok", synced: 1, skipped: 4 });
  });

  it("leaves leads older than the retry window alone", async () => {
    enableLotus();
    await insert(1);
    const calls = mockLotus(() => created());
    const inFortyDays = Date.now() + 40 * 24 * 60 * 60 * 1000;

    expect(await syncPendingLeads(() => inFortyDays)).toMatchObject({ status: "ok", synced: 0 });
    expect(calls).toHaveLength(0);
  });
});

describe("getSyncDisplay", () => {
  const now = new Date("2026-10-12T12:00:00.000Z");
  const lead = (overrides: Partial<Lead>) =>
    makeLead({ createdAt: "2026-10-10T12:00:00.000Z", ...overrides });

  it("shows the stored status", () => {
    expect(getSyncDisplay(lead({ lotusStatus: "synced" }), now)).toBe("synced");
    expect(getSyncDisplay(lead({ lotusStatus: "rejected" }), now)).toBe("rejected");
    expect(getSyncDisplay(lead({}), now)).toBe("pending");
  });

  it("shows a pending lead too old for the daily job as expired", () => {
    expect(getSyncDisplay(lead({ createdAt: "2026-08-01T12:00:00.000Z" }), now)).toBe("expired");
    expect(
      getSyncDisplay(lead({ createdAt: "2026-08-01T12:00:00.000Z", lotusStatus: "synced" }), now),
    ).toBe("synced");
  });

  it("counts leads per state", () => {
    expect(
      countSyncDisplays(
        [lead({}), lead({ lotusStatus: "synced" }), lead({ lotusStatus: "synced" })],
        now,
      ),
    ).toEqual({ synced: 2, pending: 1, rejected: 0, expired: 0 });
  });
});
