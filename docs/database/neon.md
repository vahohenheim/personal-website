---
title: Neon database
description: The Neon Postgres database that stores leads: how it is attached to Vercel, the two connection strings, the driver, local development without a database, and setup.
related_code:
  - ../../lib/db/client.ts
  - ../../lib/leads/store.ts
  - ../../db/schema.sql
  - ../../db/setup.mjs
  - ../../.env.example
  - ../../package.json
last_updated: 2026-10-11
---

# Neon database

**Summary.** Leads are stored in a Neon Postgres database, reached with the HTTP driver
`@neondatabase/serverless`, as on the brut project. The database belongs to the Vercel
project (Storage, Neon), which provides the connection strings as environment variables.

## Variables

| Variable                | Use                                            |
| ----------------------- | ---------------------------------------------- |
| `DATABASE_URL`          | pooled connection (PgBouncer), used at runtime |
| `DATABASE_URL_UNPOOLED` | direct connection, used by `npm run db:setup`  |

Names only: a value never appears in the code, the logs, an answer or the docs.

## First setup

1. In the Vercel project: Storage, create a Neon database (choose a European region), and
   connect it to every environment. Vercel adds the variables.
2. Locally: `vercel env pull .env.local`, keeping the `ADMIN_*` lines of the file.
3. `npm run db:setup` applies [db/schema.sql](../../db/schema.sql). It is safe to run
   again. The script uses the HTTP driver, one request per statement: keep one statement
   per semicolon in the schema file. Without the Vercel CLI, paste the file in the SQL editor of the Neon console.
4. Redeploy, so that the functions get the variables.

## State

The database exists and the schema was applied on 2026-10-11 (table `leads`, Postgres 18).
An end-to-end test lead was inserted through the API, read in the admin, then deleted.

## Without a database

[getLeadStore](../../lib/leads/store.ts) chooses where leads go:

| Situation              | Store                                                             |
| ---------------------- | ----------------------------------------------------------------- |
| `DATABASE_URL` is set  | Neon                                                              |
| not set, development   | memory, lost when the server restarts                             |
| not set, production    | error: the form answers `unavailable`, the admin shows a notice   |
| `LEADS_MEMORY_STORE=1` | memory even with `next start`, to test a production build locally |

## Rules

- Queries use the `sql` template tag of the driver: values are parameters, never
  concatenated.
- The client is created on first use, so that a build without the variable does not fail.
- A schema change is made in `db/schema.sql`, applied with `npm run db:setup`, and recorded
  in the change log of [schema.md](schema.md).
