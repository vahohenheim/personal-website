import { DAILY_SNAPSHOT_DAYS, snapshotAnalytics } from "@/lib/analytics/snapshot";
import { isCronAuthorized } from "@/lib/cron/auth";

// Daily Vercel job (vercel.json, "crons"): copies the audience figures to the database
// before Vercel drops them. Vercel calls this route with `Authorization: Bearer
// <CRON_SECRET>`. Closed by default without CRON_SECRET. See docs/features/analytics.md.

// A month of history can take a while on the first run.
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const result = await snapshotAnalytics(DAILY_SNAPSHOT_DAYS);

  // "unconfigured" is not a failure: the job simply has nothing to do yet.
  return Response.json(result, { status: result.status === "error" ? 502 : 200 });
}
