// Applies db/schema.sql to the Neon database.
// Usage: npm run db:setup (loads .env.local through node --env-file).
// It uses the HTTP driver, which needs nothing but `fetch`: the WebSocket pool does not
// work on Node versions without a global WebSocket. HTTP runs one statement per request,
// so the file is split on semicolons: keep one statement per semicolon in schema.sql.
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL_UNPOOLED or DATABASE_URL is missing (see docs/database/neon.md).");
  process.exit(1);
}

const schema = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
const statements = schema
  .split("\n")
  .filter((line) => !line.trimStart().startsWith("--"))
  .join("\n")
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);

const sql = neon(connectionString);

try {
  for (const statement of statements) {
    await sql.query(statement);
  }

  console.warn(`Schema applied (${statements.length} statements).`);
} catch (error) {
  console.error("Could not apply the schema:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
