import { getSql, isDatabaseConfigured, MissingDatabaseUrlError } from "@/lib/db/client";
import { FUNNEL_EVENTS, type FunnelEvent } from "@/lib/models/funnel";

export type FunnelTotals = Record<FunnelEvent, number>;

/** Where the counters of the contact form are kept: Neon, or memory for development. */
export type FunnelStore = {
  /** Adds one to the counter of an event for a day (`YYYY-MM-DD`). */
  increment: (event: FunnelEvent, day: string) => Promise<void>;
  /** Totals per event from `since` (included). `null` reads everything. */
  totals: (since: string | null) => Promise<FunnelTotals>;
};

const EPOCH = "1970-01-01";

const emptyTotals = () =>
  Object.fromEntries(FUNNEL_EVENTS.map((event) => [event, 0])) as FunnelTotals;

const neonStore: FunnelStore = {
  increment: async (event, day) => {
    const sql = getSql();
    await sql`
      insert into funnel_daily (day, event, count)
      values (${day}, ${event}, 1)
      on conflict (day, event) do update set count = funnel_daily.count + 1
    `;
  },
  totals: async (since) => {
    const sql = getSql();
    const rows = (await sql`
      select event, sum(count)::int as count
      from funnel_daily
      where day >= ${since ?? EPOCH}
      group by event
    `) as { event: string; count: number }[];
    const totals = emptyTotals();

    for (const row of rows) {
      if (row.event in totals) {
        totals[row.event as FunnelEvent] = row.count;
      }
    }

    return totals;
  },
};

type Counter = { day: string; event: FunnelEvent; count: number };

// Kept on `globalThis` so that it survives the module reloads of `next dev`.
const holder = globalThis as typeof globalThis & { __devFunnel?: Counter[] };

/** Development and tests only. */
const memoryStore: FunnelStore = {
  increment: (event, day) => {
    const counters = (holder.__devFunnel ??= []);
    const counter = counters.find((entry) => entry.day === day && entry.event === event);

    if (counter) {
      counter.count += 1;
    } else {
      counters.push({ day, event, count: 1 });
    }

    return Promise.resolve();
  },
  totals: (since) => {
    const totals = emptyTotals();

    for (const counter of holder.__devFunnel ?? []) {
      if (counter.day >= (since ?? EPOCH)) {
        totals[counter.event] += counter.count;
      }
    }

    return Promise.resolve(totals);
  },
};

/** Same choice as for leads: memory when asked, Neon when configured. */
export const getFunnelStore = (): FunnelStore => {
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
