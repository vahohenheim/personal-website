import { getAnalyticsStore } from "@/lib/analytics/store";
import { FUNNEL_EVENTS, type FunnelEvent } from "@/lib/models/funnel";
import { getFunnelStore } from "./store";

export type FunnelStep = {
  /** `visits`, then the events of the contact form in order. */
  id: "visits" | FunnelEvent;
  count: number;
  /** Share of the previous step that reached this one, from 0 to 1. Null for the first step. */
  rate: number | null;
};

export type FunnelReportResult = { status: "ok"; steps: FunnelStep[] } | { status: "error" };

/**
 * From a visit to a message sent, over a period. Visits come from the stored audience
 * figures (daily visitors added up); the rest from the counters of the form. Never throws.
 */
export const loadFunnelReport = async (since: string | null): Promise<FunnelReportResult> => {
  try {
    const [totals, days] = await Promise.all([
      getFunnelStore().totals(since),
      getAnalyticsStore().daily(since),
    ]);
    const counts: [FunnelStep["id"], number][] = [
      ["visits", days.reduce((sum, day) => sum + day.visitors, 0)],
      ...FUNNEL_EVENTS.map((event): [FunnelEvent, number] => [event, totals[event]]),
    ];

    return {
      status: "ok",
      steps: counts.map(([id, count], index) => {
        const previous = index > 0 ? counts[index - 1][1] : 0;

        return { id, count, rate: index > 0 && previous > 0 ? count / previous : null };
      }),
    };
  } catch (error) {
    console.error("[funnel] could not read the counters", {
      name: error instanceof Error ? error.name : "unknown",
    });

    return { status: "error" };
  }
};
