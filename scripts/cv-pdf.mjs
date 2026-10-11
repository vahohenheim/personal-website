// Prints the resume to public/cv-<locale>.pdf, one A4 page per language.
//
//   npm run build && npm run cv:pdf
//
// Starts the built site on a local port, asks a local Chrome to print
// /<locale>/resume/print/ and stops. Fails when a file is not exactly one page.
// CHROME_PATH overrides where Chrome is looked for.

import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const LOCALES = ["fr", "en"];
const PORT = 3217;
const BASE_URL = `http://localhost:${PORT}`;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

const chrome = CHROME_CANDIDATES.find((path) => path && existsSync(path));

if (!chrome) {
  console.error("Chrome was not found. Set CHROME_PATH to its executable.");
  process.exit(1);
}

if (!existsSync(".next/BUILD_ID")) {
  console.error("No build found. Run `npm run build` first.");
  process.exit(1);
}

const run = (command, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "ignore" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${String(code)}`));
      }
    });
  });

// The print page reads no data, but the server is started without a database all the same.
const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  stdio: "ignore",
  env: { ...process.env, LEADS_MEMORY_STORE: "1" },
});
const profile = mkdtempSync(join(tmpdir(), "cv-pdf-"));

const waitForServer = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}/fr/resume/print/`);

      if (response.ok) {
        return;
      }
    } catch {
      // Not listening yet.
    }

    await sleep(500);
  }

  throw new Error("The site did not start.");
};

let failed = false;

try {
  await waitForServer();

  for (const locale of LOCALES) {
    const output = `public/cv-${locale}.pdf`;

    await run(chrome, [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      `--user-data-dir=${profile}`,
      "--no-pdf-header-footer",
      "--virtual-time-budget=8000",
      `--print-to-pdf=${output}`,
      `${BASE_URL}/${locale}/resume/print/`,
    ]);

    const pages = readFileSync(output, "latin1").match(/\/Type\s*\/Page\b/g)?.length ?? 0;

    if (pages === 1) {
      process.stdout.write(`${output}: 1 page\n`);
    } else {
      failed = true;
      console.error(`${output}: ${String(pages)} pages, expected 1. Shorten the content.`);
    }
  }
} catch (error) {
  failed = true;
  console.error(error instanceof Error ? error.message : error);
} finally {
  server.kill();
  rmSync(profile, { recursive: true, force: true });
}

process.exit(failed ? 1 : 0);
