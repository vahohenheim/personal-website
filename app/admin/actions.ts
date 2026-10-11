"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/guard";
import { getLeadStore } from "@/lib/leads/store";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/models/lead";

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

export const updateLeadStatusAction = async (id: number, status: string) =>
  run(async () => {
    if (!Number.isInteger(id) || !LEAD_STATUSES.includes(status as LeadStatus)) {
      throw new Error("Invalid input");
    }

    await getLeadStore().updateStatus(id, status as LeadStatus);
  });

export const deleteLeadAction = async (id: number) =>
  run(async () => {
    if (!Number.isInteger(id)) {
      throw new Error("Invalid input");
    }

    await getLeadStore().remove(id);
  });
