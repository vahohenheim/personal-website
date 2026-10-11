"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/guard";
import { snapshotAnalytics, VERCEL_RETENTION_DAYS } from "@/lib/analytics/snapshot";
import { getLeadStore } from "@/lib/leads/store";
import { LEAD_STATUSES, MAX_NOTES_LENGTH } from "@/lib/models/lead";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Runs an admin change and turns any failure into a message for a toast. */
const run = async (change: () => Promise<void>): Promise<ActionResult> => {
  try {
    await assertAdmin();
    await change();
    revalidatePath("/admin");

    return { ok: true };
  } catch (error) {
    // Never the lead itself in the logs.
    console.error("[admin] action failed", {
      name: error instanceof Error ? error.name : "unknown",
    });

    return { ok: false, error: "L’opération a échoué. Rechargez la page et réessayez." };
  }
};

/** What the follow-up form sends: every field as typed, checked here. */
type FollowUpForm = { status: string; notes: string; amount: string; followUpOn: string };

export const updateLeadFollowUpAction = async (id: number, form: FollowUpForm) =>
  run(async () => {
    const status = LEAD_STATUSES.find((value) => value === form.status);
    const amount = form.amount.trim() === "" ? null : Number(form.amount);
    const followUpOn = form.followUpOn.trim() === "" ? null : form.followUpOn.trim();

    if (
      !Number.isInteger(id) ||
      !status ||
      (amount !== null && (!Number.isInteger(amount) || amount < 0 || amount > 10_000_000)) ||
      (followUpOn !== null && !/^\d{4}-\d{2}-\d{2}$/.test(followUpOn))
    ) {
      throw new Error("Invalid input");
    }

    await getLeadStore().updateFollowUp(id, {
      status,
      notes: form.notes.trim().slice(0, MAX_NOTES_LENGTH) || null,
      amount,
      followUpOn,
    });
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
