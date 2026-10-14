import { checkBotId } from "botid/server";
import { getPost, getProtectedSlugs } from "@/lib/helpers/posts";
import { LOCALES } from "@/lib/i18n/config";
import { isLikelyBot } from "@/lib/leads/validation";
import {
  ACCESS_MAX_AGE_SECONDS,
  createAccessToken,
  getAccessCookieName,
  isAccessConfigured,
  isPasswordValid,
} from "@/lib/posts/access";

/** A person types one password faster than they fill in the contact form. */
const MIN_FILL_TIME_MS = 1000;

// One answer for every refusal (wrong password, unknown post, bot): it says nothing about
// which check failed.
const refuse = () => Response.json({ error: "refused" }, { status: 401 });

/**
 * Exchanges the password of the protected posts for a signed cookie that opens one post.
 * Closed (404) while the variables are missing. Never logs the password nor the cookie.
 * See docs/features/posts.md#protected-posts.
 */
export async function POST(request: Request) {
  if (!isAccessConfigured()) {
    console.error("[unlock] PROTECTED_POSTS_PASSWORD or PROTECTED_POSTS_SECRET is missing.");

    return Response.json({ error: "not_found" }, { status: 404 });
  }

  // BotID needs the Vercel platform; elsewhere, the honeypot and the time trap remain.
  if (process.env.VERCEL && (await checkBotId()).isBot) {
    return refuse();
  }

  let body: Record<string, unknown>;

  try {
    const parsed: unknown = await request.json();

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return Response.json({ error: "invalid_body" }, { status: 400 });
    }

    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const { slug, password, website, startedAt } = body;
  const isKnown =
    typeof slug === "string" &&
    getProtectedSlugs().includes(slug) &&
    LOCALES.some((locale) => getPost(slug, locale) !== undefined);

  if (
    isLikelyBot({ website, startedAt, now: Date.now(), minFillTimeMs: MIN_FILL_TIME_MS }) ||
    !isKnown ||
    !isPasswordValid(password)
  ) {
    return refuse();
  }

  const response = Response.json({ ok: true });
  const cookie = [
    `${getAccessCookieName(slug)}=${createAccessToken(slug)}`,
    "Path=/",
    `Max-Age=${ACCESS_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
  ].join("; ");

  response.headers.set("Set-Cookie", cookie);
  response.headers.set("Cache-Control", "no-store");

  return response;
}
