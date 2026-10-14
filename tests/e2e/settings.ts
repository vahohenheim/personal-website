const port = 3221;

/**
 * Shared by the Playwright config, which starts the site, and by the specs. Its own ports,
 * so that the smoke tests and the end-to-end tests never meet.
 */
export const E2E = {
  port,
  baseUrl: `http://localhost:${port}`,
  adminUser: "e2e",
  adminPassword: "e2e-password",
  cronSecret: "e2e-cron-secret",
  lotusPort: 3222,
  lotusUrl: "http://localhost:3222",
  lotusSecret: "e2e-lotus-secret",
  postsPassword: "e2e-posts-password",
  postsSecret: "e2e-posts-secret",
} as const;

/** Every payload the stand-in for lotus accepted so far. */
export const lotusReceived = async () =>
  (await (await fetch(`${E2E.lotusUrl}/__received`)).json()) as Record<string, string>[];

/** Basic authentication of the admin, for requests made outside the browser. */
export const adminHeaders = {
  authorization: `Basic ${Buffer.from(`${E2E.adminUser}:${E2E.adminPassword}`).toString("base64")}`,
};
