import { type Lead } from "@/lib/models/lead";
import { LOTUS_RETRY_DAYS } from "./sync";

/**
 * What the admin shows for a lead: the stored status, except that a pending lead too old
 * for the daily job is `expired`: it will not be sent again by itself.
 */
export type SyncDisplay = "synced" | "pending" | "rejected" | "expired";

export const getSyncDisplay = (lead: Lead, now: Date): SyncDisplay => {
  if (lead.lotusStatus !== "pending") {
    return lead.lotusStatus;
  }

  const age = now.getTime() - new Date(lead.createdAt).getTime();

  return age > LOTUS_RETRY_DAYS * 24 * 60 * 60 * 1000 ? "expired" : "pending";
};

/** Leads per forwarding state, for the summary of the admin. */
export const countSyncDisplays = (leads: Lead[], now: Date): Record<SyncDisplay, number> => {
  const counts: Record<SyncDisplay, number> = { synced: 0, pending: 0, rejected: 0, expired: 0 };

  for (const lead of leads) {
    counts[getSyncDisplay(lead, now)] += 1;
  }

  return counts;
};
