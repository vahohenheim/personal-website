import { getAnalyticsStore } from "./store";
import {
  ANALYTICS_DIMENSIONS,
  type AnalyticsDimension,
  AnalyticsApiError,
  fetchBreakdown,
  fetchDailyTraffic,
  getAnalyticsConfig,
} from "./vercel";

/** Vercel keeps a month of data on the free plan: what a snapshot can read at most. */
export const VERCEL_RETENTION_DAYS = 30;
/** Days re-read by the daily job: enough to repair a missed run and late-arriving hits. */
export const DAILY_SNAPSHOT_DAYS = 3;
/** Values kept per day and dimension. */
const BREAKDOWN_LIMIT = 50;

export type SnapshotResult =
  | { status: "ok"; days: number; breakdownDays: number }
  | { status: "unconfigured" }
  | { status: "error" };

const isoDay = (date: Date) => date.toISOString().slice(0, 10);

/** The last `count` days (UTC), oldest first, today included. */
const lastDays = (count: number, now: Date) =>
  Array.from({ length: count }, (_, index) => {
    const day = new Date(now);
    day.setUTCDate(day.getUTCDate() - (count - 1 - index));

    return isoDay(day);
  });

/**
 * Copies audience figures from Vercel to the database: the daily totals of the whole
 * month Vercel still has, and the breakdowns of the last `breakdownDays` days.
 * Idempotent: running it twice stores the same rows. Never throws.
 */
export const snapshotAnalytics = async (
  breakdownDays: number,
  now = new Date(),
): Promise<SnapshotResult> => {
  const config = getAnalyticsConfig();

  if (!config) {
    return { status: "unconfigured" };
  }

  try {
    const store = getAnalyticsStore();
    const month = lastDays(VERCEL_RETENTION_DAYS, now);
    const fetched = await fetchDailyTraffic(config, {
      since: month[0],
      until: month[month.length - 1],
    });
    const byDay = new Map(fetched.map((row) => [row.day, row]));

    // A day without a visit is stored as zero, so that the history has no hole.
    await store.upsertDaily(
      month.map((day) => byDay.get(day) ?? { day, visitors: 0, pageviews: 0 }),
    );

    const days = lastDays(Math.min(Math.max(breakdownDays, 1), VERCEL_RETENTION_DAYS), now);

    // One day at a time: a month of history is 120 requests, spread out rather than fired at once.
    for (const day of days) {
      await Promise.all(
        (Object.keys(ANALYTICS_DIMENSIONS) as AnalyticsDimension[]).map(async (dimension) => {
          const rows = await fetchBreakdown(config, day, dimension, BREAKDOWN_LIMIT);
          await store.replaceBreakdown(day, dimension, rows);
        }),
      );
    }

    return { status: "ok", days: month.length, breakdownDays: days.length };
  } catch (error) {
    // Neither the token nor an identifier in the logs: error name and HTTP status only.
    console.error("[analytics] snapshot failed", {
      name: error instanceof Error ? error.name : "unknown",
      status: error instanceof AnalyticsApiError ? error.httpStatus : undefined,
    });

    return { status: "error" };
  }
};
