---
title: Database schema
description: Tables and columns of the Neon database, with the log of schema changes.
related_code:
  - ../../db/schema.sql
  - ../../lib/leads/store.ts
  - ../../lib/models/lead.ts
  - ../../lib/analytics/store.ts
  - ../../lib/funnel/store.ts
last_updated: 2026-10-11
---

# Database schema

**Summary.** Four tables: `leads`, filled by the [contact form](../features/contact-form.md)
and completed in the admin; `funnel_daily`, the counters of the
[conversion funnel](../features/conversion.md); and `analytics_daily` and
`analytics_breakdown`, filled every day with the [audience figures](../features/analytics.md). All are read by the
[admin area](../features/admin.md). The source of truth is
[db/schema.sql](../../db/schema.sql).

## `leads`

| Column         | Type                | Notes                                                           |
| -------------- | ------------------- | --------------------------------------------------------------- |
| `id`           | `bigint`, identity  | primary key                                                     |
| `need`         | `text`              | one of `LEAD_NEEDS`                                             |
| `timeline`     | `text`, nullable    | one of `LEAD_TIMELINES`                                         |
| `message`      | `text`              |                                                                 |
| `name`         | `text`              |                                                                 |
| `email`        | `text`              | lowercased                                                      |
| `company`      | `text`, nullable    |                                                                 |
| `locale`       | `text`              | language of the page the form was sent from, default `fr`       |
| `status`       | `text`              | one of `LEAD_STATUSES`, default `new`                           |
| `created_at`   | `timestamptz`       | default `now()`                                                 |
| `notes`        | `text`, nullable    | follow-up notes written in the admin                            |
| `amount`       | `integer`, nullable | estimated amount of the deal, in whole euros                    |
| `follow_up_on` | `date`, nullable    | day to get back to the lead                                     |
| `source`       | `text`, nullable    | where the visitor came from: a `utm_source` or a referring host |

Index: `leads_created_at_idx` on `created_at desc`.

The allowed values of `need`, `timeline` and `status` are enforced by the application
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

## Change log

| Date       | Change                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-11 | Table `leads` created.                                                                                                                      |
| 2026-10-11 | Tables `analytics_daily` and `analytics_breakdown` created.                                                                                 |
| 2026-10-11 | Columns `notes`, `amount`, `follow_up_on` and `source` added to `leads`; table `funnel_daily` created. Applied to production on 2026-10-11. |
