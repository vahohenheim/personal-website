---
title: Database schema
description: Tables and columns of the Neon database, with the log of schema changes.
related_code:
  - ../../db/schema.sql
  - ../../lib/leads/store.ts
  - ../../lib/models/lead.ts
last_updated: 2026-10-11
---

# Database schema

**Summary.** One table, `leads`, filled by the [contact form](../features/contact-form.md)
and read by the [admin area](../features/admin.md). The source of truth is
[db/schema.sql](../../db/schema.sql).

## `leads`

| Column       | Type               | Notes                                                     |
| ------------ | ------------------ | --------------------------------------------------------- |
| `id`         | `bigint`, identity | primary key                                               |
| `need`       | `text`             | one of `LEAD_NEEDS`                                       |
| `timeline`   | `text`, nullable   | one of `LEAD_TIMELINES`                                   |
| `message`    | `text`             |                                                           |
| `name`       | `text`             |                                                           |
| `email`      | `text`             | lowercased                                                |
| `company`    | `text`, nullable   |                                                           |
| `locale`     | `text`             | language of the page the form was sent from, default `fr` |
| `status`     | `text`             | one of `LEAD_STATUSES`, default `new`                     |
| `created_at` | `timestamptz`      | default `now()`                                           |

Index: `leads_created_at_idx` on `created_at desc`.

The allowed values of `need`, `timeline` and `status` are enforced by the application
([lib/models/lead.ts](../../lib/models/lead.ts)), not by the database: never rename one.

## Retention

The privacy text of the site promises deletion at most three years after the last
exchange. Nothing automates it yet: delete old leads from the admin.

## Change log

| Date       | Change                 |
| ---------- | ---------------------- |
| 2026-10-11 | Table `leads` created. |
