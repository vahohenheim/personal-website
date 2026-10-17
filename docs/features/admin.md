---
title: Admin area
description: The /admin dashboard for leads (create, edit, delete, follow-up) and the /admin/frequentation page for audience and conversion: how access is protected, where the credentials are, what the page shows, and the rules for adding an admin page or action.
related_code:
  - ../../app/admin/layout.tsx
  - ../../app/admin/page.tsx
  - ../../app/admin/frequentation/page.tsx
  - ../../app/admin/formats.ts
  - ../../app/admin/design-system/page.tsx
  - ../../components/admin/admin-header.tsx
  - ../../app/admin/actions.ts
  - ../../app/admin/export/route.ts
  - ../../app/admin/labels.ts
  - ../../components/admin/lead-form.tsx
  - ../../components/admin/lead-delete.tsx
  - ../../components/admin/admin-figures.tsx
  - ../../components/admin/bars-chart.tsx
  - ../../components/admin/analytics-actions.tsx
  - ../../lib/analytics/report.ts
  - ../../lib/funnel/report.ts
  - ../../lib/admin/auth.ts
  - ../../lib/admin/guard.ts
  - ../../lib/admin/stats.ts
  - ../../proxy.ts
last_updated: 2026-10-17
---

# Admin area

**Summary.** `/admin` is where Valentin reads the leads sent through the
[contact form](contact-form.md) and the [audience figures](analytics.md) of the site. It is protected by HTTP Basic authentication, closed by
default, never indexed and never cached. It is in French only and sits outside the
`[locale]` segment, with a root layout of its own.

## Access

- **Gate:** [proxy.ts](../../proxy.ts) answers `401` with a `WWW-Authenticate` header to
  any request under `/admin` that does not carry the right credentials. Its matcher covers
  `/admin/:path*` whatever the path looks like, so a file extension cannot bypass it.
- **Defence in depth:** the page calls `requireAdmin()`, every Server Action and route
  calls `assertAdmin()` ([lib/admin/guard.ts](../../lib/admin/guard.ts)). Never rely on
  the proxy alone.
- **Closed by default:** without `ADMIN_USER` and `ADMIN_PASSWORD`, nobody gets in.
- Comparison is done in constant time on SHA-256 digests.
- Responses carry `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow`.

## Credentials

They are environment variables, never written in the code or the docs.

- **Locally:** `.env.local`, ignored by git. It was generated on 2026-10-11 with the user
  `valentin` and a random password.
- **In production:** the same two variables in the Vercel project. To change the
  password, change the variable and redeploy.

## What the pages show

The admin has three pages, linked by its menu (`AdminHeaderComponent`: demandes ·
fréquentation · design system). The leads come first; the audience has its own page, so
that the list of leads is never pushed under the figures of the site.

### Leads (`/admin/`)

1. **Header:** "+ Nouvelle demande" (the main action) and "Exporter en CSV", then six key
   figures: leads to answer and leads to follow up (both in the accent colour when there
   are some), amount of the quotes waiting for an answer, amount won, leads of the last 30
   days compared with the 30 before, leads received since the start.
2. **All leads** (shadcn `Table`), right under the figures. Tabs filter the list with
   `?filtre=` (`matchesFilter` in [lib/admin/stats.ts](../../lib/admin/stats.ts)), each with
   its count: `toutes`, `à traiter` (status `new`), `à relancer` (follow-up date reached),
   `en cours` (answered and still open), `closes` (`CLOSED_STATUSES`). A line says whether
   forwarding to lotus is active and counts the leads per sync state. Each row: date and
   lotus state ([lotus-sync.md](lotus-sync.md#sync-status-of-a-lead)), contact with its
   origin, need and start of the message, follow-up (status, amount, follow-up date in the
   accent colour once it has come, start of the notes), then **Modifier** and
   **Supprimer**.
3. **Audience recap, 30 days:** page views, visits and messages sent (with their share of
   the visits), and a link to the audience page.
4. **Trend:** leads per week over twelve weeks, leads by need (shadcn `Chart`, bars in the
   accent colour, through `BarsChartComponent`), and where the leads came from.

### Audience and conversion (`/admin/frequentation/`)

Period tabs (`?periode=`: 30 days, 90 days, 12 months, all), the two buttons that copy the
figures from Vercel on demand, then page views, visits and messages sent; a chart; the top
pages, referrers, countries and devices, read from the figures copied to Neon every day;
the conversion funnel from a visit to a message sent, over the same period. See
[analytics.md](analytics.md) and [conversion.md](conversion.md).

### CSV export (`/admin/export/`)

Every lead with its follow-up and its lotus sync status, `;` separated, UTF-8 with a byte
order mark for Excel. Cells that start with `=`, `+`, `-` or `@` are neutralised.

Figures are computed by [lib/admin/stats.ts](../../lib/admin/stats.ts), a pure function.

## Creating, editing and deleting a lead

One dialog, the sheet of a lead ([lead-form.tsx](../../components/admin/lead-form.tsx)),
creates a lead and edits one. It has two groups:

| Group   | Field          | Stored in       | Notes                                                                   |
| ------- | -------------- | --------------- | ----------------------------------------------------------------------- |
| contact | nom, e-mail    | `name`, `email` | required; the e-mail is checked as on the public form                   |
| contact | entreprise     | `company`       | optional                                                                |
| contact | origine        | `source`        | optional; kept as letters, digits, `.`, `-` and `_` (`malt`, a host)    |
| contact | besoin         | `need`          | required, one of `LEAD_NEEDS`                                           |
| contact | démarrage      | `timeline`      | optional, one of `LEAD_TIMELINES`                                       |
| contact | langue         | `locale`        | language of the lead, sent to lotus                                     |
| contact | message        | `message`       | required; one word is enough here (ten characters on the public form)   |
| suivi   | statut         | `status`        | `à traiter`, `contacté`, `devis envoyé`, `gagné`, `perdu`, `sans suite` |
| suivi   | montant estimé | `amount`        | whole euros, optional; summed in the figures for quotes and wins        |
| suivi   | relancer le    | `follow_up_on`  | optional date; the lead counts as "à relancer" from that day on         |
| suivi   | notes          | `notes`         | free text, 4,000 characters at most                                     |

- **Create** ("+ Nouvelle demande"): a lead received by phone, by e-mail or on a platform.
  `createLeadAction` checks the form with the rules of the public form (`parseLead`, with
  `minMessageLength: 1`), stores it, records its follow-up, then forwards it to lotus after
  the answer, like a lead sent through the site (`syncLead` in `after()`).
- **Edit** ("Modifier" on a row): `updateLeadAction` checks the whole form again and
  replaces the contact, the need and the message (`updateDetails`), then the follow-up.
  An edit is not sent to lotus: lotus keeps the lead as it first received it.
- **Delete** ("Supprimer" on a row, or "Supprimer la demande" in the sheet): a
  confirmation dialog ([lead-delete.tsx](../../components/admin/lead-delete.tsx)), then
  `deleteLeadAction`. The lead goes with its notes; lotus is not told.

A wrong field comes back as a toast that names it (`LEAD_FORM_ERRORS` in
[labels.ts](../../app/admin/labels.ts)); any other failure as a generic toast. The dialog
stays open on a failure.

A lead whose status is `gagné`, `perdu` or `sans suite` (`CLOSED_STATUSES`) is never due
for a follow-up, whatever its date. The stored value of `sans suite` is `closed`: it was
labelled "clos" before the statuses of a sale existed.

## Design system page

`/admin/design-system/` shows the tokens and every component of the site, in day and night
mode side by side. See [design-system.md](../frontend/design-system.md).

## Rules

- Every admin page stays under `/admin`, and calls `requireAdmin()`.
- Every admin Server Action and route calls `assertAdmin()` first.
- Admin pages are `force-dynamic`: live data, no cache.
- No lead data in the logs. Notes are personal data like the rest of a lead: they are
  deleted with it.
- The admin follows the design charter like the rest of the site: tokens only, charts in
  the accent and muted colours.
- Its texts are in French, in [app/admin/labels.ts](../../app/admin/labels.ts) and in the
  page: it has one reader.
