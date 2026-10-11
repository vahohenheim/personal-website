import {
  CLOSED_STATUSES,
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
  /** Sum of the estimated amounts of the quotes waiting for an answer, in euros. */
  quotedAmount: number;
  /** Sum of the amounts of the leads won, in euros. */
  wonAmount: number;
  /** Leads still open whose follow-up date is today or past. */
  followUpsDue: number;
  /** One point per week, oldest first; `week` is the Monday, as `YYYY-MM-DD`. */
  weekly: { week: string; leads: number }[];
  byNeed: { need: LeadNeed; leads: number }[];
  byStatus: Record<LeadStatus, number>;
  /** Where leads came from, most frequent first. An empty source is a direct visit. */
  bySource: { source: string; leads: number; won: number }[];
};

/** Monday 00:00 UTC of the week of `date`. */
const startOfWeek = (date: Date) => {
  const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const offset = (day.getUTCDay() + 6) % 7;

  return new Date(day.getTime() - offset * DAY_MS);
};

const sumAmounts = (leads: Lead[], status: LeadStatus) =>
  leads.filter((lead) => lead.status === status).reduce((sum, lead) => sum + (lead.amount ?? 0), 0);

/** Whether a lead should be followed up today: still open, with a date that has come. */
export const isFollowUpDue = (lead: Lead, today: string) =>
  lead.followUpOn !== null && lead.followUpOn <= today && !CLOSED_STATUSES.includes(lead.status);

/** Figures of the dashboard. Pure: `now` is passed in. */
export const computeLeadStats = (leads: Lead[], now: Date): LeadStats => {
  const time = now.getTime();
  const today = now.toISOString().slice(0, 10);
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

  const sources: Record<string, { source: string; leads: number; won: number }> = {};

  for (const lead of leads) {
    const source = lead.source ?? "";
    const entry = (sources[source] ??= { source, leads: 0, won: 0 });
    entry.leads += 1;
    entry.won += lead.status === "won" ? 1 : 0;
  }

  return {
    total: leads.length,
    open: byStatus.new,
    last30Days: leads.filter((lead) => age(lead) < 30 * DAY_MS).length,
    previous30Days: leads.filter((lead) => age(lead) >= 30 * DAY_MS && age(lead) < 60 * DAY_MS)
      .length,
    quotedAmount: sumAmounts(leads, "quoted"),
    wonAmount: sumAmounts(leads, "won"),
    followUpsDue: leads.filter((lead) => isFollowUpDue(lead, today)).length,
    weekly,
    byNeed: LEAD_NEEDS.map((need) => ({
      need,
      leads: leads.filter((lead) => lead.need === need).length,
    })),
    byStatus,
    bySource: Object.values(sources).sort((a, b) => b.leads - a.leads),
  };
};
