import { getLeadStore } from "@/lib/leads/store";
import { type Lead, type SyncOutcome } from "@/lib/models/lead";
import { getLotusState, type LotusConfig } from "./config";
import { forwardLead } from "./forward";

/** The daily job sends again the leads created in this many days. */
export const LOTUS_RETRY_DAYS = 30;
/** Leads sent per run of the daily job. */
export const LOTUS_BATCH_SIZE = 25;
/** After this many unavailable answers in a row, lotus is down: the run stops. */
const MAX_FAILURES_IN_A_ROW = 3;
/** A run stops taking new leads after this long, to stay within the function duration. */
const RUN_BUDGET_MS = 40_000;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Sends a lead and records the result. Logs the id and the outcome only, never the lead. */
const attempt = async (lead: Lead, config: LotusConfig): Promise<SyncOutcome> => {
  const outcome = await forwardLead(lead, config);

  await getLeadStore().recordSync(lead.id, outcome);

  if (outcome.status !== "synced") {
    console.warn("[lotus] lead not forwarded", {
      id: lead.id,
      outcome: outcome.status,
      code: outcome.code,
    });
  }

  return outcome;
};

/**
 * Forwards one lead to lotus, right after it was stored. Does nothing when forwarding is
 * off. Never throws: it runs after the answer to the visitor, and must never matter to it.
 */
export const syncLead = async (lead: Lead): Promise<void> => {
  try {
    const state = getLotusState();

    if (state.status === "active") {
      await attempt(lead, state.config);
    }
  } catch (error) {
    console.error("[lotus] could not record the forwarding of a lead", {
      id: lead.id,
      name: error instanceof Error ? error.name : "unknown",
    });
  }
};

export type SyncRunResult =
  | { status: "unconfigured" | "invalid" | "blocked" }
  | { status: "error" }
  | {
      status: "ok";
      /** Leads lotus confirmed during this run. */
      synced: number;
      /** Leads lotus refused for good. */
      rejected: number;
      /** Leads tried without a confirmation: they will be sent again. */
      pending: number;
      /** Leads of the batch left untried because lotus looked down or time ran out. */
      skipped: number;
    };

/**
 * Sends again the leads lotus has not confirmed, oldest first. Counts only: nothing about
 * the leads is returned. Never throws.
 */
export const syncPendingLeads = async (now: () => number = Date.now): Promise<SyncRunResult> => {
  const state = getLotusState();

  if (state.status !== "active") {
    return { status: state.status };
  }

  try {
    const startedAt = now();
    const since = new Date(startedAt - LOTUS_RETRY_DAYS * DAY_MS).toISOString();
    const leads = await getLeadStore().listPendingSync(since, LOTUS_BATCH_SIZE);
    const counts = { synced: 0, rejected: 0, pending: 0 };
    let failuresInARow = 0;
    let tried = 0;

    for (const lead of leads) {
      if (failuresInARow >= MAX_FAILURES_IN_A_ROW || now() - startedAt > RUN_BUDGET_MS) {
        break;
      }

      const outcome = await attempt(lead, state.config);

      counts[outcome.status] += 1;
      failuresInARow = outcome.status === "pending" ? failuresInARow + 1 : 0;
      tried += 1;
    }

    return { status: "ok", ...counts, skipped: leads.length - tried };
  } catch (error) {
    console.error("[lotus] the sync run failed", {
      name: error instanceof Error ? error.name : "unknown",
    });

    return { status: "error" };
  }
};
