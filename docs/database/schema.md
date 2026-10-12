---
title: Database schema
description: Tables and columns of the Neon database, with the log of schema changes.
related_code:
  - ../../db/schema.sql
  - ../../lib/leads/store.ts
  - ../../lib/models/lead.ts
  - ../../lib/analytics/store.ts
  - ../../lib/funnel/store.ts
last_updated: 2026-10-12
---

# Database schema

**Summary.** Four tables: `leads`, filled by the [contact form](../features/contact-form.md)
and completed in the admin; `funnel_daily`, the counters of the
[conversion funnel](../features/conversion.md); and `analytics_daily` and
`analytics_breakdown`, filled every day with the [audience figures](../features/analytics.md). All are read by the
[admin area](../features/admin.md). The source of truth is
[db/schema.sql](../../db/schema.sql).

## `leads`

| Column               | Type                    | Notes                                                                            |
| -------------------- | ----------------------- | -------------------------------------------------------------------------------- |
| `id`                 | `bigint`, identity      | primary key                                                                      |
| `need`               | `text`                  | one of `LEAD_NEEDS`                                                              |
| `timeline`           | `text`, nullable        | one of `LEAD_TIMELINES`                                                          |
| `message`            | `text`                  |                                                                                  |
| `name`               | `text`                  |                                                                                  |
| `email`              | `text`                  | lowercased                                                                       |
| `company`            | `text`, nullable        |                                                                                  |
| `locale`             | `text`                  | language of the page the form was sent from, default `fr`                        |
| `status`             | `text`                  | one of `LEAD_STATUSES`, default `new`                                            |
| `created_at`         | `timestamptz`           | default `now()`                                                                  |
| `notes`              | `text`, nullable        | follow-up notes written in the admin                                             |
| `amount`             | `integer`, nullable     | estimated amount of the deal, in whole euros                                     |
| `follow_up_on`       | `date`, nullable        | day to get back to the lead                                                      |
| `source`             | `text`, nullable        | where the visitor came from: a `utm_source` or a referring host                  |
| `lotus_status`       | `text`                  | forwarding to lotus: `pending` (default), `synced` or `rejected`                 |
| `lotus_lead_id`      | `text`, nullable        | id lotus gave to the lead                                                        |
| `lotus_synced_at`    | `timestamptz`, nullable | when lotus confirmed                                                             |
| `lotus_error`        | `text`, nullable        | code of the last failed attempt (`http_503`, `timeout`…), never any lead content |
| `lotus_attempts`     | `integer`               | attempts so far, default 0                                                       |
| `lotus_attempted_at` | `timestamptz`, nullable | date of the last attempt                                                         |

Indexes: `leads_created_at_idx` on `created_at desc`; `leads_lotus_pending_idx` on
`created_at` for the rows still `pending`, read by the daily retry
([lotus-sync.md](../features/lotus-sync.md)).

The allowed values of `need`, `timeline`, `status` and `lotus_status` are enforced by the application
([lib/models/lead.ts](../../lib/models/lead.ts)), not by the database: never rename one.

## `funnel_daily`

One row per UTC day and event. Primary key: `(day, event)`.

| Column  | Type      | Notes                                                   |
| ------- | --------- | ------------------------------------------------------- |
| `day`   | `date`    |                                                         |
| `event` | `text`    | one of `FUNNEL_EVENTS`                                  |
| `count` | `integer` | times the event happened that day, incremented in place |

Counters only: no identifier and no personal data.

## `analytics_daily`

One row per UTC day.

| Column       | Type          | Notes                         |
| ------------ | ------------- | ----------------------------- |
| `day`        | `date`        | primary key                   |
| `visitors`   | `integer`     | unique visitors of that day   |
| `pageviews`  | `integer`     |                               |
| `updated_at` | `timestamptz` | last time the row was written |

## `analytics_breakdown`

One row per day, dimension and value. Primary key: `(day, dimension, label)`.

| Column      | Type      | Notes                                                                                              |
| ----------- | --------- | -------------------------------------------------------------------------------------------------- |
| `day`       | `date`    |                                                                                                    |
| `dimension` | `text`    | `page`, `referrer`, `country` or `device`                                                          |
| `label`     | `text`    | raw value from Vercel: a path, a hostname, a country code, a device type; empty for a direct visit |
| `visitors`  | `integer` |                                                                                                    |
| `pageviews` | `integer` |                                                                                                    |

Index: `analytics_breakdown_dimension_idx` on `(dimension, day)`.

The two `analytics_*` tables hold aggregated counts only, with no personal data, and are kept with no time
limit: that is their purpose.

## Retention of leads

The privacy text of the site promises deletion at most three years after the last
exchange. Nothing automates it yet: delete old leads from the admin.

## Changing the schema

1. Add the change at the end of [db/schema.sql](../../db/schema.sql), written so that it
   can run again (`add column if not exists`, `create … if not exists`), one statement per
   semicolon.
2. Keep it **additive** and give new columns a default or make them nullable: the version
   in production must keep working between the migration and the deployment. Apply the
   migration first (`npm run db:setup`), deploy second.
3. Extend the row type, both stores (Neon and memory) and their tests.
4. Record the change below.

## Change log

| Date       | Change                                                                                                                                                                                                                                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-11 | Table `leads` created.                                                                                                                                                                                                                                                                                   |
| 2026-10-11 | Tables `analytics_daily` and `analytics_breakdown` created.                                                                                                                                                                                                                                              |
| 2026-10-11 | Columns `notes`, `amount`, `follow_up_on` and `source` added to `leads`; table `funnel_daily` created. Applied to production on 2026-10-11.                                                                                                                                                              |
| 2026-10-12 | Columns `lotus_status`, `lotus_lead_id`, `lotus_synced_at`, `lotus_error`, `lotus_attempts` and `lotus_attempted_at` added to `leads`, with the partial index `leads_lotus_pending_idx`. Additive: existing leads became `pending`. Applied to production on 2026-10-12, before the code that uses them. |
