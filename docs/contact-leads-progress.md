# Contact form for leads: progress

Working file for the feature Valentin asked for on 2026-10-11. It exists so that the work
can be resumed by a new session. Delete it once the feature is merged and deployed.

## The request, in his words (translated)

- A contact form for leads, instead of the e-mail link.
- In a **modal** (he first said a separate page, then chose the modal), as a short
  **funnel** in steps, with a nice display once the form is sent.
- At the end, back on the home page, **with a visible change** showing the message was sent.
- Every possible error is shown with **shadcn toasts**.
- Data stored in **Neon**, as on the brut project.
- An **admin area** as on brut, with **credentials created for him**, and a nice display
  with **charts and tables**.
- **Legal notice and privacy** updated.

## How to resume

1. `git checkout feature/contact-leads`, read this file.
2. `git log --oneline main..HEAD` shows what is done. One commit per step.
3. Continue with the first unchecked step, and tick it in the same commit.
4. After each step: `npm run check` and `npm run build` must pass.
5. Do not merge or push to `main` without Valentin's go-ahead.

The reference implementation is the brut project (`~/Sites/brut`): `lib/db.ts`,
`lib/admin-auth.ts`, `lib/admin-guard.ts`, `proxy.ts`, `app/api/contact/route.ts`,
`db/schema.sql`, `db/setup.mjs`, `instrumentation-client.ts`. Same choices here, in
English and with this repository's conventions.

## Design decisions

- **Storage.** Neon Postgres through `@neondatabase/serverless`, pooled `DATABASE_URL` at
  runtime, `DATABASE_URL_UNPOOLED` for the schema. One table, `leads`.
- **Local development without a database.** When `DATABASE_URL` is missing and
  `NODE_ENV` is not `production`, leads go to an in-memory store, so the whole flow and the
  admin can be tried locally. In production a missing variable is an error.
- **API.** `POST /api/contact`, JSON. Anti-spam as on brut: Vercel BotID, a honeypot field
  and a time trap. Validation on the server; error codes mapped to translated toasts.
- **Form.** shadcn `Dialog`, three steps (need, details, contact details), then a success
  screen. Opened by every "Prendre contact" button; the `mailto:` link stays as the `href`
  so the button still works without JavaScript.
- **Change on the home page after sending.** A flag in `localStorage` (no cookie): the
  contact buttons are replaced by a mono confirmation line with the accent dot.
- **Admin.** `/admin`, outside the `[locale]` segment, with its own root layout, in French
  (it is for Valentin only). HTTP Basic through `proxy.ts` with `ADMIN_USER` and
  `ADMIN_PASSWORD`, closed by default, re-checked in every page and action
  (`lib/admin/guard.ts`). `noindex`, `no-store`.
- **Admin display.** Key figures, leads per week (shadcn `Chart`), breakdown by need and
  by budget, a table of leads with status change and deletion, CSV export.
- **Look.** Everything follows the design charter: Eucalyptus tokens, 2 px radius, no
  shadow, charts in the accent and muted colours only.

## Steps

- [x] 0. Branch, pending work committed (favicon, shadcn), this file.
- [x] 1. Database layer: `@neondatabase/serverless`, `lib/db/`, `db/schema.sql`,
      `db/setup.mjs`, `npm run db:setup`, `.env.example`, in-memory store for development.
- [x] 2. Lead model, validation and `POST /api/contact` with BotID, honeypot and time trap.
- [x] 3. shadcn `dialog`, `sonner`, `input`, `textarea`, `label`, `radio-group` restyled
      for the charter; toasts mounted in the root layout.
- [x] 4. Contact dialog (three steps and success), translated, opened by the contact
      buttons of the home page and the resume; error toasts; home page change after sending.
- [x] 5. Admin: Basic auth in `proxy.ts`, guard, credentials generated in `.env.local`,
      layout, dashboard with figures, chart, tables, status change, deletion, CSV export.
- [x] 6. Legal notice and privacy texts in both languages; CSP checked.
- [x] 7. Documentation (`docs/features/contact-form.md`, `docs/features/admin.md`,
      `docs/database/`, runbook, security, overview, README) and `CLAUDE.md` rules.
- [x] 8. Verification in a browser: the three steps, each error toast, the success screen,
      the home page change, the admin with and without credentials; screenshots.

## State: all steps done

Checked in a browser on 2026-10-11, on a production build with the in-memory store: the
three steps, the error toasts (need, short message, invalid e-mail), the success screen,
the confirmation on the home page and "nouveau message", the dialog at 375 px, `/admin`
without credentials (401), with a wrong password (401), with credentials (200), the export,
and the dashboard with four test leads. Then, against the real Neon database (schema
applied with `npm run db:setup`): one lead sent through the API, read in the admin, and
deleted. **Not checked:** BotID, which only runs on Vercel.

Valentin created the Neon database and set the variables locally and on Vercel
(2026-10-11). Left before merging: his go-ahead to deploy.

## Notes

- The dialog was tried in a browser (French, desktop): every step, the three error
  toasts and the success screen work. Still to check in step 8: the return to the home
  page, the mobile width, and the admin area, which is written but untested.

- The API URL is `/api/contact/` (with the trailing slash: `trailingSlash` is on).
- `LEADS_MEMORY_STORE=1` forces the in-memory store with `next start`, to test a
  production build locally: `LEADS_MEMORY_STORE=1 npx next start`.
- BotID only runs on Vercel (`process.env.VERCEL`): locally only the honeypot and the time
  trap apply. `startedAt` must be at least 3 seconds old or the request is silently dropped.
- The BotID rewrites live under `/149e9513-01fa-4fb0-aad4-566afd725d1b/`: the `matcher` of
  `proxy.ts` must leave that prefix alone (to do in step 5, with `/admin`).

## What Valentin has to do (cannot be done from the repository)

1. **Create the Neon database** from the Vercel project (Storage, Neon), which adds
   `DATABASE_URL` and `DATABASE_URL_UNPOOLED` to the project. Then run `npm run db:setup`
   locally after `vercel env pull .env.local`, or paste `db/schema.sql` in the Neon console.
2. **Add `ADMIN_USER` and `ADMIN_PASSWORD`** to the Vercel project, with the values
   generated in `.env.local`.
3. **Enable Vercel BotID** for the project if it is not (it is free in basic mode).

Until step 1 is done in production, the form answers with the "service unavailable" toast.

## Open questions

- Should a new lead also send him an e-mail or a notification? Not requested; the admin is
  the only place to read leads for now.
- Retention: the privacy text says three years after the last contact, the usual
  reference for prospects in France. To confirm.
