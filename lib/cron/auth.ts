import { timingSafeEqual } from "node:crypto";

/**
 * Whether a request comes from Vercel Cron, which sends `Authorization: Bearer
 * <CRON_SECRET>`. Compared in constant time. Closed by default: without the variable,
 * nobody gets in. Every route under /api/cron/ starts with this check.
 */
export const isCronAuthorized = (request: Request) => {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return false;
  }

  const received = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);

  return received.length === expected.length && timingSafeEqual(received, expected);
};
