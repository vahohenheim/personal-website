import { describe, expect, it } from "vitest";
import { loadFunnelReport } from "@/lib/funnel/report";
import { getFunnelStore } from "@/lib/funnel/store";
import { FUNNEL_EVENTS, isFunnelEvent } from "@/lib/models/funnel";

describe("isFunnelEvent", () => {
  it("only knows the listed events", () => {
    expect(FUNNEL_EVENTS.every(isFunnelEvent)).toBe(true);
    expect(isFunnelEvent("contact_closed")).toBe(false);
    expect(isFunnelEvent(42)).toBe(false);
    expect(isFunnelEvent(null)).toBe(false);
  });

  // Stored in the database: renaming one would orphan its counters.
  it("keeps the stored names", () => {
    expect(FUNNEL_EVENTS).toEqual([
      "contact_open",
      "contact_step_details",
      "contact_step_identity",
      "contact_sent",
    ]);
  });
});

describe("funnel store and report", () => {
  it("adds up counters per event from a given day", async () => {
    const store = getFunnelStore();
    await store.increment("contact_open", "2026-09-01");
    await store.increment("contact_open", "2026-10-10");
    await store.increment("contact_open", "2026-10-10");
    await store.increment("contact_sent", "2026-10-11");

    expect(await store.totals(null)).toMatchObject({ contact_open: 3, contact_sent: 1 });
    expect(await store.totals("2026-10-01")).toMatchObject({
      contact_open: 2,
      contact_step_details: 0,
      contact_sent: 1,
    });
  });

  it("reports each step with its share of the previous one", async () => {
    const store = getFunnelStore();

    for (let index = 0; index < 4; index += 1) {
      await store.increment("contact_open", "2026-10-10");
    }

    await store.increment("contact_step_details", "2026-10-10");

    const report = await loadFunnelReport(null);

    expect(report.status === "ok" && report.steps).toEqual([
      { id: "visits", count: 0, rate: null },
      { id: "contact_open", count: 4, rate: null },
      { id: "contact_step_details", count: 1, rate: 0.25 },
      { id: "contact_step_identity", count: 0, rate: 0 },
      { id: "contact_sent", count: 0, rate: null },
    ]);
  });
});
