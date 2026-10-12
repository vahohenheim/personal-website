import { defineConfig } from "vitest/config";

// Smoke tests: the built site, started once and called over HTTP. Run `npm run build`
// first. See docs/development/testing.md.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/smoke/**/*.test.ts"],
    globalSetup: ["tests/smoke/global-setup.ts"],
    testTimeout: 20_000,
    hookTimeout: 90_000,
    // One server, one database in memory: files run one after the other.
    fileParallelism: false,
  },
});
