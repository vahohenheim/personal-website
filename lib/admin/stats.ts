import {
  type Lead,
  LEAD_NEEDS,
  LEAD_STATUSES,
  type LeadNeed,
  type LeadStatus,
} from "@/lib/models/lead";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKS = 12;

export type LeadStats = {
  total: number;
  /** Leads still to answer. */
  open: number;
  last30Days: number;
  previous30Days: number;
  /** One point per week, oldest first; `week` is the Monday, as `YYYY-MM-DD`. */
  weekly: { week: string; leads: number }[];
  byNeed: { need: LeadNeed; leads: number }[];
  byStatus: Record<LeadStatus, number>;
};

/** Monday 00:00 UTC of the week of `date`. */
const startOfWeek = (date: Date) => {
  const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const offset = (day.getUTCDay() + 6) % 7;

  return new Date(day.getTime() - offset * DAY_MS);
};

/** Figures of the dashboard. Pure: `now` is passed in. */
export const computeLeadStats = (leads: Lead[], now: Date): LeadStats => {
  const time = now.getTime();
  const age = (lead: Lead) => time - new Date(lead.createdAt).getTime();
  const firstWeek = startOfWeek(new Date(time - (WEEKS - 1) * 7 * DAY_MS));

  const weekly = Array.from({ length: WEEKS }, (_, index) => {
    const start = firstWeek.getTime() + index * 7 * DAY_MS;

    return {
      week: new Date(start).toISOString().slice(0, 10),
      leads: leads.filter((lead) => {
        const created = new Date(lead.createdAt).getTime();

        return created >= start && created < start + 7 * DAY_MS;
      }).length,
    };
  });

  const byStatus = Object.fromEntries(
    LEAD_STATUSES.map((status) => [status, leads.filter((lead) => lead.status === status).length]),
  ) as Record<LeadStatus, number>;

  return {
    total: leads.length,
    open: byStatus.new,
    last30Days: leads.filter((lead) => age(lead) < 30 * DAY_MS).length,
    previous30Days: leads.filter((lead) => age(lead) >= 30 * DAY_MS && age(lead) < 60 * DAY_MS)
      .length,
    weekly,
    byNeed: LEAD_NEEDS.map((need) => ({
      need,
      leads: leads.filter((lead) => lead.need === need).length,
    })),
    byStatus,
  };
};
