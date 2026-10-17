import { describe, expect, it } from "vitest";
import {
  computeLeadStats,
  isFollowUpDue,
  isLeadFilter,
  LEAD_FILTERS,
  matchesFilter,
} from "@/lib/admin/stats";
import { makeLead } from "../helpers/leads";

const now = new Date("2026-10-12T12:00:00.000Z");

describe("computeLeadStats", () => {
  it("returns zeros without leads", () => {
    const stats = computeLeadStats([], now);

    expect(stats).toMatchObject({
      total: 0,
      open: 0,
      quotedAmount: 0,
      wonAmount: 0,
      followUpsDue: 0,
    });
    expect(stats.weekly).toHaveLength(12);
    expect(stats.bySource).toEqual([]);
  });

  it("counts statuses, amounts, periods and sources", () => {
    const stats = computeLeadStats(
      [
        makeLead({ id: 1, createdAt: "2026-10-10T09:00:00.000Z" }),
        makeLead({ id: 2, status: "quoted", amount: 4500, createdAt: "2026-10-01T09:00:00.000Z" }),
        makeLead({
          id: 3,
          status: "won",
          amount: 12000,
          source: null,
          createdAt: "2026-08-20T09:00:00.000Z",
        }),
        makeLead({
          id: 4,
          status: "lost",
          amount: 900,
          source: null,
          createdAt: "2026-06-01T09:00:00.000Z",
        }),
      ],
      now,
    );

    expect(stats.total).toBe(4);
    expect(stats.open).toBe(1);
    expect(stats.byStatus).toMatchObject({ new: 1, quoted: 1, won: 1, lost: 1, contacted: 0 });
    expect(stats.quotedAmount).toBe(4500);
    expect(stats.wonAmount).toBe(12000);
    expect(stats.last30Days).toBe(2);
    expect(stats.previous30Days).toBe(1);
    expect(stats.bySource).toEqual([
      { source: "linkedin.com", leads: 2, won: 0 },
      { source: "", leads: 2, won: 1 },
    ]);
    expect(stats.byNeed.find((entry) => entry.need === "design-system")?.leads).toBe(4);
  });

  it("puts a lead in the week it was created, weeks starting on Monday", () => {
    const stats = computeLeadStats([makeLead({ createdAt: "2026-10-11T23:00:00.000Z" })], now);

    // 2026-10-11 is a Sunday: it belongs to the week of Monday 2026-10-05.
    expect(stats.weekly.find((point) => point.week === "2026-10-05")?.leads).toBe(1);
    expect(stats.weekly.at(-1)).toEqual({ week: "2026-10-12", leads: 0 });
  });
});

describe("isFollowUpDue", () => {
  it("is due from the follow-up day on, while the lead is open", () => {
    expect(isFollowUpDue(makeLead({ followUpOn: "2026-10-12" }), "2026-10-12")).toBe(true);
    expect(isFollowUpDue(makeLead({ followUpOn: "2026-10-13" }), "2026-10-12")).toBe(false);
    expect(isFollowUpDue(makeLead({ followUpOn: null }), "2026-10-12")).toBe(false);
  });

  it("is never due once the lead is won, lost or closed", () => {
    for (const status of ["won", "lost", "closed"] as const) {
      expect(isFollowUpDue(makeLead({ status, followUpOn: "2026-01-01" }), "2026-10-12")).toBe(
        false,
      );
    }
  });
});

describe("matchesFilter", () => {
  const today = "2026-10-12";
  const leads = [
    makeLead({ id: 1, status: "new" }),
    makeLead({ id: 2, status: "contacted", followUpOn: "2026-10-10" }),
    makeLead({ id: 3, status: "quoted", followUpOn: "2026-10-20" }),
    makeLead({ id: 4, status: "won", followUpOn: "2026-10-01" }),
    makeLead({ id: 5, status: "closed" }),
  ];
  const ids = (filter: (typeof LEAD_FILTERS)[number]) =>
    leads.filter((lead) => matchesFilter(lead, filter, today)).map((lead) => lead.id);

  it("sorts the leads into the tabs of the list", () => {
    expect(ids("all")).toEqual([1, 2, 3, 4, 5]);
    expect(ids("new")).toEqual([1]);
    expect(ids("due")).toEqual([2]);
    expect(ids("ongoing")).toEqual([2, 3]);
    expect(ids("closed")).toEqual([4, 5]);
  });

  it("accepts the known filters only", () => {
    expect(LEAD_FILTERS.every(isLeadFilter)).toBe(true);
    expect(isLeadFilter("everything")).toBe(false);
    expect(isLeadFilter(undefined)).toBe(false);
  });
});
