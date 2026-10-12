import { isCronAuthorized } from "@/lib/cron/auth";
import { syncPendingLeads } from "@/lib/lotus/sync";

// Daily Vercel job (vercel.json, "crons"): sends again the leads lotus has not confirmed.
// Vercel calls this route with `Authorization: Bearer <CRON_SECRET>`. Closed by default
// without CRON_SECRET. See docs/features/lotus-sync.md.

// Up to 25 leads, each allowed 5 seconds; the run stops by itself well before this.
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  // Counts only: nothing about the leads leaves this route.
  const result = await syncPendingLeads();

  // Forwarding switched off is not a failure: the job simply has nothing to do.
  return Response.json(result, { status: result.status === "error" ? 502 : 200 });
}
