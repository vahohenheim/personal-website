import { beforeEach, vi } from "vitest";
import { resetMemoryStores } from "./memory";

// Tests never reach a real database or a real service: the stores are the in-memory ones,
// and every variable that would open a connection is emptied before each test.
beforeEach(() => {
  vi.stubEnv("LEADS_MEMORY_STORE", "1");
  vi.stubEnv("DATABASE_URL", "");
  vi.stubEnv("VERCEL", "");
  vi.stubEnv("ADMIN_USER", "");
  vi.stubEnv("ADMIN_PASSWORD", "");
  vi.stubEnv("CRON_SECRET", "");
  vi.stubEnv("LOTUS_WEBHOOK_URL", "");
  vi.stubEnv("LOTUS_WEBHOOK_SECRET", "");
  resetMemoryStores();
});
