import { type ChildProcess, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { SMOKE } from "./settings";

// Starts the built site once for the smoke tests, with stores in memory and credentials
// that only exist here. Nothing real is reachable: the database URL is emptied.

let server: ChildProcess | undefined;

const isUp = async () => {
  try {
    return (await fetch(`${SMOKE.baseUrl}/robots.txt`)).ok;
  } catch {
    return false;
  }
};

export async function setup() {
  if (!existsSync(".next/BUILD_ID")) {
    throw new Error("No build found. Run `npm run build` before `npm run test:smoke`.");
  }

  if (await isUp()) {
    throw new Error(`Port ${SMOKE.port} is already in use: stop what runs there first.`);
  }

  server = spawn("npx", ["next", "start", "-p", String(SMOKE.port)], {
    stdio: "ignore",
    env: {
      ...process.env,
      // Variables already set win over .env.local, so these empty values keep the real
      // database and the real services out of reach.
      LEADS_MEMORY_STORE: "1",
      DATABASE_URL: "",
      DATABASE_URL_UNPOOLED: "",
      WEB_ANALYTICS_TOKEN: "",
      VERCEL: "",
      ADMIN_USER: SMOKE.adminUser,
      ADMIN_PASSWORD: SMOKE.adminPassword,
      CRON_SECRET: SMOKE.cronSecret,
      LOTUS_WEBHOOK_URL: "",
      LOTUS_WEBHOOK_SECRET: "",
    },
  });

  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (await isUp()) {
      return;
    }

    await sleep(500);
  }

  server.kill();
  throw new Error("The built site did not start.");
}

export function teardown() {
  server?.kill();
}
