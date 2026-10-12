const port = 3219;

/** Shared by the setup, which starts the site, and by the tests, which call it. */
export const SMOKE = {
  port,
  baseUrl: `http://localhost:${port}`,
  adminUser: "smoke",
  adminPassword: "smoke-password",
  cronSecret: "smoke-cron-secret",
  lotusPort: 3220,
  lotusUrl: "http://localhost:3220",
  lotusSecret: "smoke-lotus-secret",
} as const;

export const adminAuthorization = `Basic ${Buffer.from(
  `${SMOKE.adminUser}:${SMOKE.adminPassword}`,
).toString("base64")}`;

/** Calls the site without following redirects, so that they can be checked. */
export const get = (path: string, headers: Record<string, string> = {}) =>
  fetch(`${SMOKE.baseUrl}${path}`, { headers, redirect: "manual" });

export const post = (path: string, body: unknown) =>
  fetch(`${SMOKE.baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

/** Makes the stand-in for lotus answer normally, be down, or create a lead and fail to say so. */
export const setLotus = (mode: "up" | "down" | "lost-answer") =>
  fetch(`${SMOKE.lotusUrl}/__mode`, { method: "POST", body: JSON.stringify({ mode }) });

/** Every payload the stand-in for lotus accepted so far. */
export const lotusReceived = async () =>
  (await (await fetch(`${SMOKE.lotusUrl}/__received`)).json()) as Record<string, string>[];
