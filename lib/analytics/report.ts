import { getAnalyticsStore } from "./store";
import { type AnalyticsDimension, type BreakdownRow, getAnalyticsConfig } from "./vercel";

export const TRAFFIC_PERIODS = ["30", "90", "365", "all"] as const;
export type TrafficPeriod = (typeof TRAFFIC_PERIODS)[number];

export const isTrafficPeriod = (value: unknown): value is TrafficPeriod =>
  TRAFFIC_PERIODS.includes(value as TrafficPeriod);

const TOP_LIMIT = 8;
/** Above this many days, the chart shows one bar per month instead of one per day. */
const DAILY_CHART_MAX_DAYS = 90;

export type TrafficReport = {
  /** False when the token is missing: nothing new will be copied. */
  configured: boolean;
  /** First and last day stored, whatever the period. Null when nothing is stored yet. */
  history: { firstDay: string; lastDay: string; days: number } | null;
  pageviews: number;
  /** Sum of the daily visitors: someone who comes on two days counts twice. */
  visits: number;
  /** One point per day, or per month for long periods. `label` is `YYYY-MM-DD` or `YYYY-MM`. */
  points: { label: string; pageviews: number; visits: number }[];
  granularity: "day" | "month";
  breakdowns: Record<AnalyticsDimension, BreakdownRow[]>;
};

export type TrafficReportResult = { status: "ok"; report: TrafficReport } | { status: "error" };

const isoDay = (date: Date) => date.toISOString().slice(0, 10);

/** First day of a period, as `YYYY-MM-DD`. `null` for the whole history. */
export const getPeriodStart = (period: TrafficPeriod, now = new Date()) =>
  period === "all"
    ? null
    : isoDay(new Date(now.getTime() - (Number(period) - 1) * 24 * 60 * 60 * 1000));

/** Audience figures stored in the database for a period. Never throws. */
export const loadTrafficReport = async (
  period: TrafficPeriod,
  now = new Date(),
): Promise<TrafficReportResult> => {
  try {
    const store = getAnalyticsStore();
    const since = getPeriodStart(period, now);

    const [everything, page, referrer, country, device] = await Promise.all([
      store.daily(null),
      store.breakdown("page", since, TOP_LIMIT),
      store.breakdown("referrer", since, TOP_LIMIT),
      store.breakdown("country", since, TOP_LIMIT),
      store.breakdown("device", since, TOP_LIMIT),
    ]);

    const days = everything.filter((row) => since === null || row.day >= since);
    const granularity = days.length > DAILY_CHART_MAX_DAYS ? "month" : "day";
    const grouped: Record<string, { pageviews: number; visits: number }> = {};

    for (const row of days) {
      const label = granularity === "month" ? row.day.slice(0, 7) : row.day;
      const total = (grouped[label] ??= { pageviews: 0, visits: 0 });
      total.pageviews += row.pageviews;
      total.visits += row.visitors;
    }

    return {
      status: "ok",
      report: {
        configured: getAnalyticsConfig() !== null,
        history:
          everything.length > 0
            ? {
                firstDay: everything[0].day,
                lastDay: everything[everything.length - 1].day,
                days: everything.length,
              }
            : null,
        pageviews: days.reduce((sum, row) => sum + row.pageviews, 0),
        visits: days.reduce((sum, row) => sum + row.visitors, 0),
        points: Object.entries(grouped).map(([label, total]) => ({ label, ...total })),
        granularity,
        breakdowns: { page, referrer, country, device },
      },
    };
  } catch (error) {
    console.error("[analytics] could not read the stored figures", {
      name: error instanceof Error ? error.name : "unknown",
    });

    return { status: "error" };
  }
};
