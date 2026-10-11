// Applies db/schema.sql to the Neon database.
// Usage: npm run db:setup (loads .env.local through node --env-file).
// The unpooled connection is preferred: DDL does not need to go through PgBouncer.
import { readFile } from "node:fs/promises";
import { Pool } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL_UNPOOLED or DATABASE_URL is missing (see docs/database/neon.md).");
  process.exit(1);
}

const schema = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
const pool = new Pool({ connectionString });

try {
  // No parameter: the simple protocol is used, so several statements are allowed.
  await pool.query(schema);
  console.warn("Schema applied.");
} catch (error) {
  console.error("Could not apply the schema:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
