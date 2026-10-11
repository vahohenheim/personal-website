---
title: Conversion
description: How the path from a visit to a message sent is measured: anonymous daily counters of the contact form, the origin stored with each lead, and the conversion section of the admin.
related_code:
  - ../../lib/models/funnel.ts
  - ../../lib/funnel/track.ts
  - ../../lib/funnel/store.ts
  - ../../lib/funnel/report.ts
  - ../../app/api/events/route.ts
  - ../../components/contact/contact-dialog.tsx
  - ../../instrumentation-client.ts
  - ../../app/admin/page.tsx
  - ../../db/schema.sql
last_updated: 2026-10-11
---

# Conversion

**Summary.** The site measures how many visits end in a message, with no third-party tool
and nothing written to the visitor's browser. The contact dialog reports four steps to
`POST /api/events/`, which adds one to a counter per day in Neon. Each lead also records
where the visitor came from. The admin shows the funnel and the origins.

## The funnel

| Step                    | Source                                                         |
| ----------------------- | -------------------------------------------------------------- |
| Visits                  | daily visitors of the [audience figures](analytics.md), summed |
| `contact_open`          | the dialog is opened                                           |
| `contact_step_details`  | step 2 is reached                                              |
| `contact_step_identity` | step 3 is reached                                              |
| `contact_sent`          | the server accepted the message                                |

Events are listed in [lib/models/funnel.ts](../../lib/models/funnel.ts). Their names are
stored: add one, never rename one.

## Counting

- [lib/funnel/track.ts](../../lib/funnel/track.ts): `trackFunnel(event)` sends the event
  with `fetch` (`keepalive`), never awaited, errors ignored: measuring must not slow the
  form down or break it.
- [app/api/events/route.ts](../../app/api/events/route.ts): checks Vercel BotID (on Vercel
  only, like the contact route), keeps only known event names, increments
  `funnel_daily (day, event)` for the current UTC day, and always answers `204`, so the
  response says nothing about what was counted.
- The route is declared in `initBotId` ([instrumentation-client.ts](../../instrumentation-client.ts)).
- No identifier, no IP address, no content: the table holds a date, an event name and a
  number ([schema.md](../database/schema.md#funnel_daily)).

Limits: a visitor who opens the dialog twice counts twice; a browser that blocks the
request is not counted. Visits and form events come from two different tools, so the first
rate is an order of magnitude, not an exact figure.

## Origin of a lead

On arrival, the dialog provider notes a `utm_source` when the link carried one, else the
host of the referring site, else nothing. It is kept **in memory only** (no cookie, no
storage, so no consent is needed), sent with the form as `source`, cleaned by the server
(80 characters at most) and stored in `leads.source`. A link shared with
`?utm_source=linkedin` therefore tags the leads it brings.

## In the admin

The "conversion" section of [/admin](admin.md) follows the period chosen for the audience
figures. It shows the funnel (count, and share of the previous step) and the origins of
the leads with how many were won. Built by
[lib/funnel/report.ts](../../lib/funnel/report.ts) and `computeLeadStats`.

## Rules

- Counters stay anonymous and aggregated. Anything more precise changes the
  [legal page](pages.md#legal-notice-and-privacy-localelegal) and probably needs consent.
- A new counted step is added to `FUNNEL_EVENTS`, to `FUNNEL_LABELS` in the admin, and to
  the table above.
