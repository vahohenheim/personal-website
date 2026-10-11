import { createHash, timingSafeEqual } from "node:crypto";

// HTTP Basic authentication of the admin area. See docs/features/admin.md.
// Used by proxy.ts (the main gate) and by lib/admin/guard.ts (defence in depth).

export const ADMIN_REALM = "valentinbourreau admin";

type BasicCredentials = { user: string; password: string };

/** Decodes an `Authorization: Basic <base64(user:password)>` header. */
const parseBasicAuth = (header: string | null | undefined): BasicCredentials | null => {
  if (!header) {
    return null;
  }

  const [scheme, encoded] = header.trim().split(/\s+/);

  if (scheme.toLowerCase() !== "basic" || !encoded) {
    return null;
  }

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const separator = decoded.indexOf(":");

  if (separator < 0) {
    return null;
  }

  return { user: decoded.slice(0, separator), password: decoded.slice(separator + 1) };
};

/** Constant-time comparison: digests have the same length whatever the input. */
const safeEqual = (a: string, b: string) => {
  const digest = (value: string) => createHash("sha256").update(value).digest();

  return timingSafeEqual(digest(a), digest(b));
};

export const isAdminConfigured = () =>
  Boolean(process.env.ADMIN_USER && process.env.ADMIN_PASSWORD);

/** Closed by default: without ADMIN_USER and ADMIN_PASSWORD, nobody gets in. */
export const isAdminAuthorized = (header: string | null | undefined) => {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return false;
  }

  const credentials = parseBasicAuth(header);

  if (!credentials) {
    return false;
  }

  // Both comparisons always run, so that timing does not reveal which one failed.
  const userMatches = safeEqual(credentials.user, expectedUser);
  const passwordMatches = safeEqual(credentials.password, expectedPassword);

  return userMatches && passwordMatches;
};
