import { describe, expect, it, vi } from "vitest";
import { MissingDatabaseUrlError } from "@/lib/db/client";
import { getLeadStore } from "@/lib/leads/store";
import { leadInput } from "../helpers/leads";

describe("lead store in memory", () => {
  it("stores leads, most recent first, with a new status", async () => {
    const store = getLeadStore();
    await store.insert(leadInput({ name: "First" }));
    await store.insert(leadInput({ name: "Second" }));

    const leads = await store.list();

    expect(leads.map((lead) => lead.name)).toEqual(["Second", "First"]);
    expect(leads.map((lead) => lead.id)).toEqual([2, 1]);
    expect(leads[0]).toMatchObject({ status: "new", notes: null, amount: null, followUpOn: null });
  });

  it("updates the follow-up of one lead and removes one", async () => {
    const store = getLeadStore();
    await store.insert(leadInput({ name: "First" }));
    await store.insert(leadInput({ name: "Second" }));

    await store.updateFollowUp(1, {
      status: "quoted",
      notes: "Called.",
      amount: 4500,
      followUpOn: "2026-10-20",
    });
    await store.remove(2);

    expect(await store.list()).toMatchObject([
      {
        id: 1,
        name: "First",
        status: "quoted",
        notes: "Called.",
        amount: 4500,
        followUpOn: "2026-10-20",
      },
    ]);
  });
});

describe("updateDetails", () => {
  it("replaces what a lead says and keeps its follow-up and its sync state", async () => {
    const store = getLeadStore();
    await store.insert(leadInput({ name: "First" }));
    await store.updateFollowUp(1, {
      status: "contacted",
      notes: "Called.",
      amount: null,
      followUpOn: null,
    });

    await store.updateDetails(
      1,
      leadInput({ name: "Renamed", email: "new@example.com", need: "quality", timeline: null }),
    );

    expect(await store.list()).toMatchObject([
      {
        id: 1,
        name: "Renamed",
        email: "new@example.com",
        need: "quality",
        timeline: null,
        status: "contacted",
        notes: "Called.",
        lotusStatus: "pending",
      },
    ]);
  });
});

describe("getLeadStore", () => {
  it("fails loudly in production without a database", () => {
    vi.stubEnv("LEADS_MEMORY_STORE", "");
    vi.stubEnv("NODE_ENV", "production");

    expect(() => getLeadStore()).toThrow(MissingDatabaseUrlError);
  });
});
