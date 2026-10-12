import { getSql, isDatabaseConfigured, MissingDatabaseUrlError } from "@/lib/db/client";
import {
  type Lead,
  type LeadFollowUp,
  type LeadInput,
  type LeadNeed,
  type LeadStatus,
  type LeadTimeline,
  type LotusStatus,
  type SyncOutcome,
} from "@/lib/models/lead";

/** Where leads are kept. Two implementations: Neon, and memory for local development. */
export type LeadStore = {
  /** Stores a lead and returns it as stored, with its id and its date. */
  insert: (lead: LeadInput) => Promise<Lead>;
  list: () => Promise<Lead[]>;
  /**
   * Leads lotus has not confirmed yet, created since `since` (ISO 8601), oldest first.
   */
  listPendingSync: (since: string, limit: number) => Promise<Lead[]>;
  /** Records the result of one attempt to forward a lead to lotus. */
  recordSync: (id: number, outcome: SyncOutcome) => Promise<void>;
  updateFollowUp: (id: number, followUp: LeadFollowUp) => Promise<void>;
  remove: (id: number) => Promise<void>;
};

type LeadRow = {
  id: number | string;
  need: LeadNeed;
  timeline: LeadTimeline | null;
  message: string;
  name: string;
  email: string;
  company: string | null;
  locale: string;
  source: string | null;
  status: LeadStatus;
  notes: string | null;
  amount: number | null;
  follow_up_on: string | null;
  created_at: string | Date;
  lotus_status: LotusStatus;
  lotus_lead_id: string | null;
  lotus_synced_at: string | Date | null;
  lotus_error: string | null;
  lotus_attempts: number;
  lotus_attempted_at: string | Date | null;
};

const toIso = (value: string | Date | null) => (value ? new Date(value).toISOString() : null);

const toLead = (row: LeadRow): Lead => ({
  id: Number(row.id),
  need: row.need,
  timeline: row.timeline,
  message: row.message,
  name: row.name,
  email: row.email,
  company: row.company,
  locale: row.locale,
  source: row.source,
  status: row.status,
  notes: row.notes,
  amount: row.amount,
  followUpOn: row.follow_up_on,
  createdAt: new Date(row.created_at).toISOString(),
  lotusStatus: row.lotus_status,
  lotusLeadId: row.lotus_lead_id,
  lotusSyncedAt: toIso(row.lotus_synced_at),
  lotusError: row.lotus_error,
  lotusAttempts: row.lotus_attempts,
  lotusAttemptedAt: toIso(row.lotus_attempted_at),
});

// Every query goes through the `sql` template tag of the Neon driver: values are always
// sent as parameters, never concatenated.
const neonStore: LeadStore = {
  insert: async (lead) => {
    const sql = getSql();
    const rows = (await sql`
      insert into leads (need, timeline, message, name, email, company, locale, source)
      values (${lead.need}, ${lead.timeline}, ${lead.message}, ${lead.name}, ${lead.email},
              ${lead.company}, ${lead.locale}, ${lead.source})
      returning id, need, timeline, message, name, email, company, locale, source, status, notes,
                amount, to_char(follow_up_on, 'YYYY-MM-DD') as follow_up_on, created_at,
                lotus_status, lotus_lead_id, lotus_synced_at, lotus_error, lotus_attempts,
                lotus_attempted_at
    `) as LeadRow[];

    return toLead(rows[0]);
  },
  list: async () => {
    const sql = getSql();
    const rows = (await sql`
      select id, need, timeline, message, name, email, company, locale, source, status, notes,
             amount, to_char(follow_up_on, 'YYYY-MM-DD') as follow_up_on, created_at,
             lotus_status, lotus_lead_id, lotus_synced_at, lotus_error, lotus_attempts,
             lotus_attempted_at
      from leads
      order by created_at desc
    `) as LeadRow[];

    return rows.map(toLead);
  },
  listPendingSync: async (since, limit) => {
    const sql = getSql();
    const rows = (await sql`
      select id, need, timeline, message, name, email, company, locale, source, status, notes,
             amount, to_char(follow_up_on, 'YYYY-MM-DD') as follow_up_on, created_at,
             lotus_status, lotus_lead_id, lotus_synced_at, lotus_error, lotus_attempts,
             lotus_attempted_at
      from leads
      where lotus_status = 'pending' and created_at >= ${since}
      order by created_at asc
      limit ${limit}
    `) as LeadRow[];

    return rows.map(toLead);
  },
  recordSync: async (id, outcome) => {
    const sql = getSql();

    if (outcome.status === "synced") {
      await sql`
        update leads
        set lotus_status = 'synced', lotus_lead_id = ${outcome.lotusLeadId},
            lotus_synced_at = now(), lotus_error = null,
            lotus_attempts = lotus_attempts + 1, lotus_attempted_at = now()
        where id = ${id}
      `;

      return;
    }

    // A failure never undoes a confirmation: two attempts can cross each other.
    await sql`
      update leads
      set lotus_status = ${outcome.status}, lotus_error = ${outcome.code},
          lotus_attempts = lotus_attempts + 1, lotus_attempted_at = now()
      where id = ${id} and lotus_status <> 'synced'
    `;
  },
  updateFollowUp: async (id, followUp) => {
    const sql = getSql();
    await sql`
      update leads
      set status = ${followUp.status}, notes = ${followUp.notes}, amount = ${followUp.amount},
          follow_up_on = ${followUp.followUpOn}
      where id = ${id}
    `;
  },
  remove: async (id) => {
    const sql = getSql();
    await sql`delete from leads where id = ${id}`;
  },
};

// Kept on `globalThis` so that it survives the module reloads of `next dev`.
const memory = globalThis as typeof globalThis & { __devLeads?: Lead[] };

/** Development only: lets the form and the admin be tried without a database. */
const memoryStore: LeadStore = {
  insert: (lead) => {
    const leads = (memory.__devLeads ??= []);
    const stored: Lead = {
      ...lead,
      id: (leads[0]?.id ?? 0) + 1,
      status: "new",
      notes: null,
      amount: null,
      followUpOn: null,
      createdAt: new Date().toISOString(),
      lotusStatus: "pending",
      lotusLeadId: null,
      lotusSyncedAt: null,
      lotusError: null,
      lotusAttempts: 0,
      lotusAttemptedAt: null,
    };
    leads.unshift(stored);

    return Promise.resolve({ ...stored });
  },
  list: () => Promise.resolve([...(memory.__devLeads ?? [])]),
  listPendingSync: (since, limit) =>
    Promise.resolve(
      (memory.__devLeads ?? [])
        .filter((lead) => lead.lotusStatus === "pending" && lead.createdAt >= since)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id - b.id)
        .slice(0, limit),
    ),
  recordSync: (id, outcome) => {
    const now = new Date().toISOString();

    memory.__devLeads = (memory.__devLeads ?? []).map((lead) => {
      if (lead.id !== id) {
        return lead;
      }

      const attempt = { lotusAttempts: lead.lotusAttempts + 1, lotusAttemptedAt: now };

      if (outcome.status === "synced") {
        return {
          ...lead,
          ...attempt,
          lotusStatus: "synced",
          lotusLeadId: outcome.lotusLeadId,
          lotusSyncedAt: now,
          lotusError: null,
        };
      }

      // A failure never undoes a confirmation: two attempts can cross each other.
      return lead.lotusStatus === "synced"
        ? lead
        : { ...lead, ...attempt, lotusStatus: outcome.status, lotusError: outcome.code };
    });

    return Promise.resolve();
  },
  updateFollowUp: (id, followUp) => {
    memory.__devLeads = (memory.__devLeads ?? []).map((lead) =>
      lead.id === id ? { ...lead, ...followUp } : lead,
    );

    return Promise.resolve();
  },
  remove: (id) => {
    memory.__devLeads = (memory.__devLeads ?? []).filter((lead) => lead.id !== id);

    return Promise.resolve();
  },
};

/**
 * Whether leads are kept in memory: asked for by hand, or no database outside production.
 * Ids then restart at 1 with the server, which matters to anything that exports them.
 */
export const usesMemoryStore = () =>
  process.env.LEADS_MEMORY_STORE === "1" ||
  (!isDatabaseConfigured() && process.env.NODE_ENV !== "production");

/**
 * The store to use. Without `DATABASE_URL`, production fails loudly; elsewhere leads stay
 * in memory until the server restarts.
 */
export const getLeadStore = (): LeadStore => {
  // `LEADS_MEMORY_STORE=1` is set by hand to test a production build without touching
  // the database.
  if (usesMemoryStore()) {
    return memoryStore;
  }

  if (isDatabaseConfigured()) {
    return neonStore;
  }

  throw new MissingDatabaseUrlError();
};
