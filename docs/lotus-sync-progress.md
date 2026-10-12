---
title: Lotus sync and test suite, work in progress
description: Resumable state of the work started on 2026-10-12: forwarding leads to lotus through a signed webhook, a sync status in the admin, and a test suite run by the CI. Delete this file once merged and deployed.
last_updated: 2026-10-12
---

# Lotus sync and test suite: progress

Temporary file. It lets the work be resumed after an interruption. **Delete it once the
branch is merged and deployed.**

## The request (2026-10-12)

1. Forward every lead of the contact form to lotus (Valentin's private management app)
   through a signed webhook, with a daily retry. Contract: `../lotus/docs/integration-site.md`
   (authoritative, in French). The original prompt asked for no commit and no push.
2. Valentin, on top of the prompt: step back and adapt it to this project; add an explicit
   **sync status** per lead, to know whether lotus answered positively; do the database
   migration myself, without regression; add a **test suite** run by the CI on every push;
   document everything; keep this state file.

## How to resume

1. `git checkout feature/lotus-sync-and-tests`
2. Read the steps below: the first unchecked one is where to resume.
3. `git status` and `git stash list` show what was in flight. Work is committed on the
   branch step by step (never on `main`, never pushed without Valentin's go-ahead).
4. `.env.local` points to the production database: test with `LEADS_MEMORY_STORE=1`.

## Decisions (where this differs from the prompt, and why)

- **Explicit status.** A stored column `lotus_status` (`pending`, `synced`, `rejected`)
  instead of a state derived from two nullable columns: it can be filtered, counted and
  shown as is. `synced` means lotus answered `201` or `200`. Next to it: `lotus_lead_id`,
  `lotus_synced_at`, `lotus_error` (code of the **last failed attempt**, also while
  pending, so the admin says why a lead is waiting), `lotus_attempts`, `lotus_attempted_at`.
- **Old leads.** The cron only retries leads of the last 30 days. An older pending lead is
  shown as "not forwarded, too old" in the admin rather than "pending" for ever.
- **Guard against id collisions.** With the in-memory store, ids restart at 1 and `site-1`
  would collide with a real lead: forwarding is refused when the memory store is used and
  the webhook URL is not a local address.
- **Cron budget.** 25 leads with a 5 s timeout could exceed the function duration when
  lotus is down: the run stops after 3 unavailable answers in a row, or after 40 s.
- **Shared cron authorization** in `lib/cron/auth.ts`, used by both cron routes.
- **Legal page.** Wording proposed to Valentin, not applied without his approval.
- **Tests.** Vitest 3 (works on Node 20 and 24): unit tests of the pure modules, route
  handlers tested in process with the memory stores, and a smoke test of the built site
  over HTTP. No browser test (Playwright) for now.

## Steps

- [x] 0. Branch and this file.
- [x] 1. Test tooling (Vitest, scripts, CI) and tests of the existing behaviour, green
      before any change: this is the regression net.
- [x] 2. Schema columns, `Lead` model, both stores (`insert` returns the lead, sync marks,
      pending list). Tests.
- [x] 3. `lib/lotus/`: payload, signature (test vector), send with typed outcome, config
      and guard. Tests.
- [x] 4. Contact route forwards in `after()`; cron route `lotus-sync`; shared cron auth;
      `vercel.json`; `.env.example`. Tests.
- [x] 5. Admin: sync status per lead, summary line, CSV export. Tests of the labels/state.
- [ ] 6. Smoke test of the built site; end-to-end check with a local lotus or a stub.
- [ ] 7. Migration applied to Neon (`npm run db:setup`, additive only) and checked.
- [ ] 8. Documentation: `docs/features/lotus-sync.md`, `docs/development/testing.md`,
      pages concerned, `CLAUDE.md`, `README.md`.
- [ ] 9. Final `npm run check`, `npm test`, `npm run build`, smoke; report to Valentin
      with the legal wording to approve and the Vercel variables to set.

## Notes while working

(none yet)
