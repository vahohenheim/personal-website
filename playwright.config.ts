import { defineConfig, devices } from "@playwright/test";
import { E2E } from "./tests/e2e/settings";

// End-to-end tests: the built site in a real browser, on a desktop and on a 375 px phone.
// Run `npm run build` first. See docs/development/testing.md.
export default defineConfig({
  testDir: "tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: E2E.baseUrl,
    locale: "fr-FR",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "phone",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2,
      },
    },
  ],
  webServer: {
    command: `npx next start -p ${E2E.port}`,
    url: `${E2E.baseUrl}/robots.txt`,
    reuseExistingServer: false,
    timeout: 60_000,
    // Variables already set win over .env.local: these keep the real database and the
    // real services out of reach, and give the tests their own credentials.
    env: {
      LEADS_MEMORY_STORE: "1",
      DATABASE_URL: "",
      DATABASE_URL_UNPOOLED: "",
      WEB_ANALYTICS_TOKEN: "",
      VERCEL: "",
      ADMIN_USER: E2E.adminUser,
      ADMIN_PASSWORD: E2E.adminPassword,
      CRON_SECRET: E2E.cronSecret,
      PROTECTED_POSTS_PASSWORD: E2E.postsPassword,
      PROTECTED_POSTS_SECRET: E2E.postsSecret,
      LOTUS_WEBHOOK_URL: `${E2E.lotusUrl}/api/webhooks/leads`,
      LOTUS_WEBHOOK_SECRET: E2E.lotusSecret,
    },
  },
});
