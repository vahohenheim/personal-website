import { neon } from "@neondatabase/serverless";

export class MissingDatabaseUrlError extends Error {
  constructor() {
    super("DATABASE_URL is missing");
    this.name = "MissingDatabaseUrlError";
  }
}

let client: ReturnType<typeof neon> | undefined;

export const isDatabaseConfigured = () => Boolean(process.env.DATABASE_URL);

/**
 * Pooled connection (PgBouncer), meant for serverless functions. Created on first use, so
 * that a build without the variable does not fail.
 */
export const getSql = () => {
  if (!client) {
    const url = process.env.DATABASE_URL;

    if (!url) {
      throw new MissingDatabaseUrlError();
    }

    client = neon(url);
  }

  return client;
};
