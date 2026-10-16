---
title: Admin area
description: The /admin dashboard for leads, their follow-up, conversion and audience figures: how access is protected, where the credentials are, what the page shows, and the rules for adding an admin page or action.
related_code:
  - ../../app/admin/layout.tsx
  - ../../app/admin/page.tsx
  - ../../app/admin/design-system/page.tsx
  - ../../components/admin/admin-header.tsx
  - ../../app/admin/actions.ts
  - ../../app/admin/export/route.ts
  - ../../app/admin/labels.ts
  - ../../components/admin/lead-follow-up.tsx
  - ../../components/admin/bars-chart.tsx
  - ../../components/admin/analytics-actions.tsx
  - ../../lib/analytics/report.ts
  - ../../lib/funnel/report.ts
  - ../../lib/admin/auth.ts
  - ../../lib/admin/guard.ts
  - ../../lib/admin/stats.ts
  - ../../proxy.ts
last_updated: 2026-10-16
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

## What the page shows

1. **Key figures:** leads received, leads still to answer and leads to follow up (both in
   the accent colour when there are some), amount of the quotes waiting for an answer,
   amount won, leads of the last 30 days compared with the 30 before.
2. **Charts:** leads per week over twelve weeks, and leads by need (shadcn `Chart`, bars in
   the accent colour, through `BarsChartComponent`).
3. **Audience** ("fréquentation"): page views and visits over a chosen period, a chart, and
   the top pages, referrers, countries and devices, read from the figures copied to Neon
   every day. Two buttons copy them on demand. See [analytics.md](analytics.md).
4. **Conversion:** over the same period, the funnel from a visit to a message sent, and
   where the leads came from. See [conversion.md](conversion.md).
5. **Table of leads** (shadcn `Table`): date, with under it whether lotus confirmed the
   lead ([lotus-sync.md](lotus-sync.md#sync-status-of-a-lead)); contact (with the origin), need, message, and
   follow-up: status, amount, follow-up date (in the accent colour once it has come) and
   the start of the notes.
6. **CSV export** (`/admin/export/`): every lead with its follow-up and its lotus sync status, `;` separated, UTF-8
   with a byte order mark for Excel. Cells that start with `=`, `+`, `-` or `@` are
   neutralised.

A line above the table says whether forwarding to lotus is active, and counts the leads
per sync state.

Figures are computed by [lib/admin/stats.ts](../../lib/admin/stats.ts), a pure function.

## Following a lead up

The "Suivi" button of a row opens a dialog
([lead-follow-up.tsx](../../components/admin/lead-follow-up.tsx)) with:

| Field          | Stored in      | Notes                                                                   |
| -------------- | -------------- | ----------------------------------------------------------------------- |
| statut         | `status`       | `à traiter`, `contacté`, `devis envoyé`, `gagné`, `perdu`, `sans suite` |
| montant estimé | `amount`       | whole euros, optional; summed in the figures for quotes and wins        |
| relancer le    | `follow_up_on` | optional date; the lead counts as "à relancer" from that day on         |
| notes          | `notes`        | free text, 4,000 characters at most                                     |

Saving calls the Server Action `updateLeadFollowUpAction`, which checks every field again
on the server. The same dialog deletes the lead, after a confirmation. Results and
failures are toasts.

A lead whose status is `gagné`, `perdu` or `sans suite` (`CLOSED_STATUSES`) is never due
for a follow-up, whatever its date. The stored value of `sans suite` is `closed`: it was
labelled "clos" before the statuses of a sale existed.

## Design system page

`/admin/design-system/` shows the tokens and every component of the site, in day and night
mode side by side. The admin menu (`AdminHeaderComponent`: demandes · fréquentation ·
design system) links the two pages. See [design-system.md](../frontend/design-system.md).

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
