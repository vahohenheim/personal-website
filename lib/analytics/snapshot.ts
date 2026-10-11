import { getAnalyticsStore } from "./store";
import {
  ANALYTICS_DIMENSIONS,
  type AnalyticsDimension,
  AnalyticsApiError,
  DAY_RANGES,
  type DayRangeMode,
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
  | {
      status: "ok";
      days: number;
      breakdownDays: number;
      /** Rows written to the breakdown table, and how a single day had to be asked for. */
      breakdownRows: number;
      dayRange: DayRangeMode | null;
    }
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
    const dimensions = Object.keys(ANALYTICS_DIMENSIONS) as AnalyticsDimension[];
    const modes = Object.keys(DAY_RANGES) as DayRangeMode[];
    // The way of asking for one day that returned data. Found once, then reused.
    let dayRange: DayRangeMode | null = null;
    let breakdownRows = 0;

    /** Rows of one day and dimension, with a given way of asking. Null when the API refuses it. */
    const read = async (day: string, dimension: AnalyticsDimension, mode: DayRangeMode) => {
      try {
        return await fetchBreakdown(config, day, dimension, BREAKDOWN_LIMIT, mode);
      } catch (error) {
        // A refused range is only a wrong guess; anything else is a real failure.
        if (error instanceof AnalyticsApiError && error.httpStatus === 400) {
          return null;
        }

        throw error;
      }
    };

    // One day at a time: a month of history is spread out rather than fired at once.
    for (const day of days) {
      const hadTraffic = (byDay.get(day)?.pageviews ?? 0) > 0;

      if (dayRange === null && hadTraffic) {
        for (const mode of modes) {
          const rows = await read(day, "page", mode);

          if (rows && rows.length > 0) {
            dayRange = mode;
            break;
          }
        }
      }

      const mode = dayRange;

      await Promise.all(
        dimensions.map(async (dimension) => {
          // Without a known way of asking, or without traffic, the day has no breakdown.
          const rows = mode && hadTraffic ? ((await read(day, dimension, mode)) ?? []) : [];
          await store.replaceBreakdown(day, dimension, rows);
          breakdownRows += rows.length;
        }),
      );
    }

    return {
      status: "ok",
      days: month.length,
      breakdownDays: days.length,
      breakdownRows,
      dayRange,
    };
  } catch (error) {
    // Neither the token nor an identifier in the logs: error name and HTTP status only.
    console.error("[analytics] snapshot failed", {
      name: error instanceof Error ? error.name : "unknown",
      status: error instanceof AnalyticsApiError ? error.httpStatus : undefined,
    });

    return { status: "error" };
  }
};
