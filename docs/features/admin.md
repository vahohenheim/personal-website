---
title: Admin area
description: The /admin dashboard for leads: how access is protected, where the credentials are, what the page shows, and the rules for adding an admin page or action.
related_code:
  - ../../app/admin/layout.tsx
  - ../../app/admin/page.tsx
  - ../../app/admin/actions.ts
  - ../../app/admin/export/route.ts
  - ../../app/admin/labels.ts
  - ../../components/admin/lead-actions.tsx
  - ../../components/admin/leads-chart.tsx
  - ../../lib/admin/auth.ts
  - ../../lib/admin/guard.ts
  - ../../lib/admin/stats.ts
  - ../../proxy.ts
last_updated: 2026-10-11
---

# Admin area

**Summary.** `/admin` is where Valentin reads the leads sent through the
[contact form](contact-form.md). It is protected by HTTP Basic authentication, closed by
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

1. **Key figures:** leads received, leads still to answer (in the accent colour when there
   are some), leads of the last 30 days compared with the 30 before.
2. **Charts:** leads per week over twelve weeks, and leads by need (shadcn `Chart`, bars in
   the accent colour).
3. **Table of leads** (shadcn `Table`): date, contact, need, message, and follow-up, where
   the status can be changed (`à traiter`, `contacté`, `clos`) and a lead deleted after a
   confirmation. Results and failures are toasts.
4. **CSV export** (`/admin/export/`): every lead, `;` separated, UTF-8 with a byte order
   mark for Excel. Cells that start with `=`, `+`, `-` or `@` are neutralised.

Figures are computed by [lib/admin/stats.ts](../../lib/admin/stats.ts), a pure function.

## Rules

- Every admin page stays under `/admin`, and calls `requireAdmin()`.
- Every admin Server Action and route calls `assertAdmin()` first.
- Admin pages are `force-dynamic`: live data, no cache.
- No lead data in the logs.
- The admin follows the design charter like the rest of the site: tokens only, charts in
  the accent and muted colours.
- Its texts are in French, in [app/admin/labels.ts](../../app/admin/labels.ts) and in the
  page: it has one reader.
