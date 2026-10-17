"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { assertAdmin } from "@/lib/admin/guard";
import { snapshotAnalytics, VERCEL_RETENTION_DAYS } from "@/lib/analytics/snapshot";
import { getLeadStore } from "@/lib/leads/store";
import { parseLead } from "@/lib/leads/validation";
import { syncLead } from "@/lib/lotus/sync";
import {
  LEAD_STATUSES,
  type LeadFollowUp,
  type LeadInput,
  MAX_NOTES_LENGTH,
} from "@/lib/models/lead";
import { LEAD_FORM_ERRORS } from "./labels";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Runs an admin change and turns any failure into a message for a toast. */
const run = async (change: () => Promise<void>): Promise<ActionResult> => {
  try {
    await assertAdmin();
    await change();
    revalidatePath("/admin");

    return { ok: true };
  } catch (error) {
    // A wrong field is the admin's typo, not a failure: no log, its own message.
    if (error instanceof InvalidLeadError) {
      return { ok: false, error: error.toast };
    }

    // Never the lead itself in the logs.
    console.error("[admin] action failed", {
      name: error instanceof Error ? error.name : "unknown",
    });

    return { ok: false, error: "L’opération a échoué. Rechargez la page et réessayez." };
  }
};

/** What the lead form of the admin sends: every field as typed, checked here. */
export type LeadForm = {
  name: string;
  email: string;
  company: string;
  source: string;
  locale: string;
  need: string;
  timeline: string;
  message: string;
  status: string;
  amount: string;
  followUpOn: string;
  notes: string;
};

/** Thrown with a message for the toast when a field is wrong. */
class InvalidLeadError extends Error {
  constructor(readonly toast: string) {
    super("Invalid lead");
    this.name = "InvalidLeadError";
  }
}

/** Checks the whole form again on the server: contact and need, then the follow-up. */
const parseLeadForm = (form: LeadForm): { details: LeadInput; followUp: LeadFollowUp } => {
  // A lead typed by hand may hold a one-line message ("appel du 12, rappeler").
  const parsed = parseLead(form, { minMessageLength: 1 });

  if (!parsed.ok) {
    throw new InvalidLeadError(LEAD_FORM_ERRORS[parsed.error]);
  }

  const status = LEAD_STATUSES.find((value) => value === form.status);
  const amount = form.amount.trim() === "" ? null : Number(form.amount);
  const followUpOn = form.followUpOn.trim() === "" ? null : form.followUpOn.trim();

  if (!status) {
    throw new InvalidLeadError(LEAD_FORM_ERRORS.invalid_body);
  }

  if (amount !== null && (!Number.isInteger(amount) || amount < 0 || amount > 10_000_000)) {
    throw new InvalidLeadError(LEAD_FORM_ERRORS.invalid_amount);
  }

  if (followUpOn !== null && !/^\d{4}-\d{2}-\d{2}$/.test(followUpOn)) {
    throw new InvalidLeadError(LEAD_FORM_ERRORS.invalid_date);
  }

  return {
    details: parsed.value,
    followUp: {
      status,
      notes: form.notes.trim().slice(0, MAX_NOTES_LENGTH) || null,
      amount,
      followUpOn,
    },
  };
};

/**
 * Records a lead taken outside the form (a call, an e-mail, Malt). It is forwarded to lotus
 * like a lead sent through the site, after the answer.
 */
export const createLeadAction = async (form: LeadForm) =>
  run(async () => {
    const { details, followUp } = parseLeadForm(form);
    const store = getLeadStore();
    const lead = await store.insert(details);

    await store.updateFollowUp(lead.id, followUp);
    after(() => syncLead({ ...lead, ...followUp }));
  });

/** Changes a lead: what it says and where it stands. Nothing is sent to lotus again. */
export const updateLeadAction = async (id: number, form: LeadForm) =>
  run(async () => {
    if (!Number.isInteger(id)) {
      throw new InvalidLeadError(LEAD_FORM_ERRORS.invalid_body);
    }

    const { details, followUp } = parseLeadForm(form);
    const store = getLeadStore();

    await store.updateDetails(id, details);
    await store.updateFollowUp(id, followUp);
  });

export const deleteLeadAction = async (id: number) =>
  run(async () => {
    if (!Number.isInteger(id)) {
      throw new Error("Invalid input");
    }

    await getLeadStore().remove(id);
  });

/** Copies audience figures from Vercel now, for the last `days` days of breakdowns. */
export const snapshotAnalyticsAction = async (days: number): Promise<ActionResult> => {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Accès refusé." };
  }

  const safeDays = Number.isInteger(days) ? Math.min(Math.max(days, 1), VERCEL_RETENTION_DAYS) : 1;
  const result = await snapshotAnalytics(safeDays);

  if (result.status === "unconfigured") {
    return {
      ok: false,
      error: "La fréquentation n’est pas configurée : WEB_ANALYTICS_TOKEN est absent.",
    };
  }

  if (result.status === "error") {
    return {
      ok: false,
      error: "Vercel ou la base n’a pas répondu. Vérifiez le jeton, puis réessayez.",
    };
  }

  revalidatePath("/admin");

  return { ok: true };
};
