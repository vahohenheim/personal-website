import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests and route handlers called in process. See docs/development/testing.md.
export default defineConfig({
  resolve: {
    // Same alias as tsconfig.json.
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
      // Replaced by the compiler in a real build; see the stub.
      "next/root-params": fileURLToPath(new URL("tests/helpers/root-params.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/routes/**/*.test.ts"],
    setupFiles: ["tests/helpers/setup.ts"],
    // Each test starts from the environment set in the setup file.
    unstubEnvs: true,
    restoreMocks: true,
  },
});
