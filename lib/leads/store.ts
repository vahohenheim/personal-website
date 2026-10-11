import { getSql, isDatabaseConfigured, MissingDatabaseUrlError } from "@/lib/db/client";
import {
  type Lead,
  type LeadFollowUp,
  type LeadInput,
  type LeadNeed,
  type LeadStatus,
  type LeadTimeline,
} from "@/lib/models/lead";

/** Where leads are kept. Two implementations: Neon, and memory for local development. */
export type LeadStore = {
  insert: (lead: LeadInput) => Promise<void>;
  list: () => Promise<Lead[]>;
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
};

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
});

// Every query goes through the `sql` template tag of the Neon driver: values are always
// sent as parameters, never concatenated.
const neonStore: LeadStore = {
  insert: async (lead) => {
    const sql = getSql();
    await sql`
      insert into leads (need, timeline, message, name, email, company, locale, source)
      values (${lead.need}, ${lead.timeline}, ${lead.message}, ${lead.name}, ${lead.email},
              ${lead.company}, ${lead.locale}, ${lead.source})
    `;
  },
  list: async () => {
    const sql = getSql();
    const rows = (await sql`
      select id, need, timeline, message, name, email, company, locale, source, status, notes,
             amount, to_char(follow_up_on, 'YYYY-MM-DD') as follow_up_on, created_at
      from leads
      order by created_at desc
    `) as LeadRow[];

    return rows.map(toLead);
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
    leads.unshift({
      ...lead,
      id: (leads[0]?.id ?? 0) + 1,
      status: "new",
      notes: null,
      amount: null,
      followUpOn: null,
      createdAt: new Date().toISOString(),
    });

    return Promise.resolve();
  },
  list: () => Promise.resolve([...(memory.__devLeads ?? [])]),
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
 * The store to use. Without `DATABASE_URL`, production fails loudly; elsewhere leads stay
 * in memory until the server restarts.
 */
export const getLeadStore = (): LeadStore => {
  // Set by hand to test a production build without touching the database.
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
