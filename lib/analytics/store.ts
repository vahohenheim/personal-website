import { getSql, isDatabaseConfigured, MissingDatabaseUrlError } from "@/lib/db/client";
import { type AnalyticsDimension, type BreakdownRow, type DailyTrafficRow } from "./vercel";

/** Where the copied audience figures are kept: Neon, or memory for local development. */
export type AnalyticsStore = {
  upsertDaily: (rows: DailyTrafficRow[]) => Promise<void>;
  /** Replaces what is stored for one day and one dimension. */
  replaceBreakdown: (
    day: string,
    dimension: AnalyticsDimension,
    rows: BreakdownRow[],
  ) => Promise<void>;
  /** Days from `since` (included), oldest first. `null` reads everything. */
  daily: (since: string | null) => Promise<DailyTrafficRow[]>;
  /** Totals per value over the period, most visited first. */
  breakdown: (
    dimension: AnalyticsDimension,
    since: string | null,
    limit: number,
  ) => Promise<BreakdownRow[]>;
};

const EPOCH = "1970-01-01";

const toDay = (value: unknown) =>
  value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);

// Every query goes through the `sql` template tag: values are parameters, never concatenated.
const neonStore: AnalyticsStore = {
  upsertDaily: async (rows) => {
    if (rows.length === 0) {
      return;
    }

    const sql = getSql();
    await sql`
      insert into analytics_daily (day, visitors, pageviews, updated_at)
      select day, visitors, pageviews, now()
      from unnest(
        ${rows.map((row) => row.day)}::date[],
        ${rows.map((row) => row.visitors)}::int[],
        ${rows.map((row) => row.pageviews)}::int[]
      ) as incoming (day, visitors, pageviews)
      on conflict (day) do update
        set visitors = excluded.visitors, pageviews = excluded.pageviews, updated_at = now()
    `;
  },
  replaceBreakdown: async (day, dimension, rows) => {
    const sql = getSql();
    await sql`delete from analytics_breakdown where day = ${day} and dimension = ${dimension}`;

    if (rows.length === 0) {
      return;
    }

    await sql`
      insert into analytics_breakdown (day, dimension, label, visitors, pageviews)
      select ${day}::date, ${dimension}, label, visitors, pageviews
      from unnest(
        ${rows.map((row) => row.label)}::text[],
        ${rows.map((row) => row.visitors)}::int[],
        ${rows.map((row) => row.pageviews)}::int[]
      ) as incoming (label, visitors, pageviews)
      on conflict (day, dimension, label) do update
        set visitors = excluded.visitors, pageviews = excluded.pageviews
    `;
  },
  daily: async (since) => {
    const sql = getSql();
    const rows = (await sql`
      select day, visitors, pageviews
      from analytics_daily
      where day >= ${since ?? EPOCH}
      order by day
    `) as { day: unknown; visitors: number; pageviews: number }[];

    return rows.map((row) => ({
      day: toDay(row.day),
      visitors: row.visitors,
      pageviews: row.pageviews,
    }));
  },
  breakdown: async (dimension, since, limit) => {
    const sql = getSql();
    const rows = (await sql`
      select label, sum(visitors)::int as visitors, sum(pageviews)::int as pageviews
      from analytics_breakdown
      where dimension = ${dimension} and day >= ${since ?? EPOCH}
      group by label
      order by sum(pageviews) desc, label
      limit ${limit}
    `) as BreakdownRow[];

    return rows.map((row) => ({
      label: row.label,
      visitors: row.visitors,
      pageviews: row.pageviews,
    }));
  },
};

type Memory = {
  daily: DailyTrafficRow[];
  breakdown: { day: string; dimension: AnalyticsDimension; rows: BreakdownRow[] }[];
};

// Kept on `globalThis` so that it survives the module reloads of `next dev`.
const holder = globalThis as typeof globalThis & { __devAnalytics?: Memory };
const memory = (): Memory => (holder.__devAnalytics ??= { daily: [], breakdown: [] });

/** Development and tests only. */
const memoryStore: AnalyticsStore = {
  upsertDaily: (rows) => {
    const state = memory();
    const incoming = rows.map((row) => row.day);
    state.daily = [...state.daily.filter((row) => !incoming.includes(row.day)), ...rows];

    return Promise.resolve();
  },
  replaceBreakdown: (day, dimension, rows) => {
    const state = memory();
    state.breakdown = [
      ...state.breakdown.filter((entry) => entry.day !== day || entry.dimension !== dimension),
      { day, dimension, rows },
    ];

    return Promise.resolve();
  },
  daily: (since) =>
    Promise.resolve(
      memory()
        .daily.filter((row) => row.day >= (since ?? EPOCH))
        .sort((a, b) => a.day.localeCompare(b.day)),
    ),
  breakdown: (dimension, since, limit) => {
    const totals: Record<string, BreakdownRow> = {};
    const entries = memory().breakdown.filter(
      (entry) => entry.dimension === dimension && entry.day >= (since ?? EPOCH),
    );

    for (const row of entries.flatMap((entry) => entry.rows)) {
      const total = (totals[row.label] ??= { label: row.label, visitors: 0, pageviews: 0 });
      total.visitors += row.visitors;
      total.pageviews += row.pageviews;
    }

    return Promise.resolve(
      Object.values(totals)
        .sort((a, b) => b.pageviews - a.pageviews)
        .slice(0, limit),
    );
  },
};

/** Same choice as for leads: Neon when configured, memory outside production. */
export const getAnalyticsStore = (): AnalyticsStore => {
  if (process.env.LEADS_MEMORY_STORE === "1") {
    return memoryStore;
  }

  if (isDatabaseConfigured()) {
    return neonStore;
  }

  if (process.env.NODE_ENV === "production") {
    throw new MissingDatabaseUrlError();
  }

  return memoryStore;
};
