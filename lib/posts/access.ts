import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Access to protected posts: a password exchanged for a signed cookie, bound to one post.
// Used by the unlock route (which sets the cookie) and by proxy.ts (which checks it on
// every request for the post, its sharing image and its images). Closed by default:
// without both variables, nobody gets in. See docs/features/posts.md#protected-posts.

/** How long an unlocked post stays open in a browser. */
export const ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/** One cookie per post, so that unlocking a second post keeps the first one open. */
export const getAccessCookieName = (slug: string) => `post_access_${slug}`;

export const isAccessConfigured = () =>
  Boolean(process.env.PROTECTED_POSTS_PASSWORD && process.env.PROTECTED_POSTS_SECRET);

/** Constant-time comparison: digests have the same length whatever the input. */
const safeEqual = (a: string, b: string) => {
  const digest = (value: string) => createHash("sha256").update(value).digest();

  return timingSafeEqual(digest(a), digest(b));
};

const sign = (slug: string, expiresAt: number, secret: string) =>
  createHmac("sha256", secret).update(`${slug}.${expiresAt}`).digest("base64url");

/** Whether `password` is the password of the protected posts. False when not configured. */
export const isPasswordValid = (password: unknown) => {
  const expected = process.env.PROTECTED_POSTS_PASSWORD;

  return (
    isAccessConfigured() &&
    typeof password === "string" &&
    expected !== undefined &&
    safeEqual(password, expected)
  );
};

/** Value of the access cookie of `slug`: `<expiry in seconds>.<HMAC of slug and expiry>`. */
export const createAccessToken = (slug: string, now = Date.now()) => {
  const secret = process.env.PROTECTED_POSTS_SECRET;

  if (!secret) {
    throw new Error("PROTECTED_POSTS_SECRET is missing.");
  }

  const expiresAt = Math.floor(now / 1000) + ACCESS_MAX_AGE_SECONDS;

  return `${expiresAt}.${sign(slug, expiresAt, secret)}`;
};

/** Whether a cookie value opens `slug`: signed with the secret, for this post, not expired. */
export const isAccessTokenValid = (slug: string, token: string | undefined, now = Date.now()) => {
  const secret = process.env.PROTECTED_POSTS_SECRET;

  if (!isAccessConfigured() || !secret || !token) {
    return false;
  }

  const [expiry, signature, ...rest] = token.split(".");
  const expiresAt = Number(expiry);

  if (rest.length > 0 || !signature || !/^\d+$/.test(expiry) || expiresAt * 1000 <= now) {
    return false;
  }

  return safeEqual(signature, sign(slug, expiresAt, secret));
};
