---
title: Runbook
description: Local setup, commands, deployment to Vercel, dependency upgrades and their current limits, and troubleshooting.
related_code:
  - ../../package.json
  - ../../next.config.ts
  - ../../.github/workflows/ci.yml
  - ../../.nvmrc
  - ../../vercel.json
  - ../../.env.example
  - ../../AGENTS.md
  - ../../.gitignore
last_updated: 2026-10-12
---

# Runbook

**Summary.** The site needs Node 22 or later (24 is the pinned version). Locally it runs
without any configuration: leads then stay in memory. Production needs the Neon database
and the admin credentials, plus a Vercel token and a cron secret for the audience figures. A push to `main` deploys to
production on Vercel.

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The root URL redirects to `/en/` or `/fr/` according to the
browser language.

| Command            | What it does                                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`      | Development server (Turbopack)                                                                                             |
| `npm run build`    | Production build                                                                                                           |
| `npm run start`    | Serves the production build                                                                                                |
| `npm run check`    | Types, lint and formatting ([code-quality.md](../development/code-quality.md))                                             |
| `npm run cv:pdf`   | Prints the resume to `public/cv-fr.pdf` and `public/cv-en.pdf`, after a build ([resume-pdf.md](../features/resume-pdf.md)) |
| `npm run db:setup` | Applies `db/schema.sql` to the database of `.env.local` ([neon.md](../database/neon.md))                                   |

`next dev` generates `AGENTS.md`, which points coding agents to the Next.js documentation
shipped in `node_modules/next/dist/docs/`. Do not edit it; commit it when it changes.

## Environment variables

Listed with their role in [.env.example](../../.env.example). All are server-only.

| Variable                                                                                   | Needed for                             | Without it                                                      |
| ------------------------------------------------------------------------------------------ | -------------------------------------- | --------------------------------------------------------------- |
| `DATABASE_URL`                                                                             | storing and reading leads              | development: memory; production: the form answers "unavailable" |
| `DATABASE_URL_UNPOOLED`                                                                    | `npm run db:setup`                     | falls back to `DATABASE_URL`                                    |
| `ADMIN_USER`, `ADMIN_PASSWORD`                                                             | `/admin`                               | `/admin` refuses everyone                                       |
| `WEB_ANALYTICS_TOKEN` (and optionally `WEB_ANALYTICS_PROJECT_ID`, `WEB_ANALYTICS_TEAM_ID`) | the daily copy of the audience figures | the copy does nothing; the admin says it is inactive            |
| `CRON_SECRET`                                                                              | the cron route                         | the route refuses Vercel, so nothing is copied                  |

`.env.local` holds the local values and is ignored by git. See
[database/neon.md](../database/neon.md) for the database and
[features/admin.md](../features/admin.md) for the credentials and
[features/analytics.md](../features/analytics.md) for the audience figures. Vercel BotID must be
enabled on the project for the bot check of the contact form.

## Scheduled job

[vercel.json](../../vercel.json) declares one cron: every day at 03:15 UTC, Vercel calls
`/api/cron/analytics-snapshot/`, which copies the audience figures to Neon. Its runs are
listed in the Vercel project (Settings, Cron Jobs), where it can also be run by hand.

## Continuous integration

[.github/workflows/ci.yml](../../.github/workflows/ci.yml) runs on every push to `main` and
on pull requests: `npm ci`, `npm run check`, `npm run build`, on the Node version of
`.nvmrc`. It does not gate the deployment: Vercel builds on its own. A red run means the
commit that is live fails a check; fix it in the next push.

Without the GitHub CLI, the last runs are visible at
`https://api.github.com/repos/vahohenheim/personal-website/actions/runs?per_page=3`.

## Node version

`.nvmrc` pins Node 24 (the LTS line) for local work and CI; `engines` in `package.json`
requires 22 or later, which is also what Vercel reads to choose its runtime. Node 20
reached end of life in April 2026.

## Deployment

The Vercel project that serves `valentinbourreau.com` is connected to the `main` branch of
`vahohenheim/personal-website`. Each push to `main` triggers a production deployment, which
takes about a minute.

Before pushing: `npm run check` and `npm run build`.

After pushing, the commit gets a "Vercel" status on GitHub. Without the GitHub CLI:

```bash
curl -s https://api.github.com/repos/vahohenheim/personal-website/commits/<sha>/status
```

`state: success` with "Deployment has completed" means the new version is live. The
apex domain redirects to `www.valentinbourreau.com`.

## Dependencies

State on 2026-10-10: every package is on its latest version, with two exceptions imposed
by the lint toolchain.

- **`typescript` stays on 6.0.x** (7.x exists): `typescript-eslint`, pulled in by
  `eslint-config-next`, declares `typescript <6.1.0`.
- **`eslint` stays on 9.x**: `eslint-plugin-react`, `eslint-plugin-import` and
  `eslint-plugin-jsx-a11y` do not declare ESLint 10 support yet, and ESLint 10 needs
  Node 20.19 or later.

Re-check with `npm view typescript-eslint peerDependencies` and
`npm view eslint-plugin-react peerDependencies` before upgrading either.

To upgrade: in-range updates first (`npm update`), then one major per commit, running
`npm run check` and `npm run build` after each. Read the release notes of a major before
changing code; for Next.js, the upgrade guides are in `node_modules/next/dist/docs/`.

`package.json` holds only what the code imports. Remove a package when its last import
goes away.

## Known issues

- `npm audit` reports 5 high-severity advisories in `braces`, `micromatch` and `fast-glob`,
  all reached through `eslint-config-next` (lint tooling only, nothing shipped to the
  browser). No fixed release exists yet.
- The machine used on 2026-10-10 still runs Node 20.15.1: `npm install` prints an engine
  warning there until Node is upgraded (`nvm install`).
- Under `public/`, only `avatar.jpg` and `.well-known/security.txt` are used. The old logo
  and icon files may still be linked from outside the site, so check before deleting.
- The resume PDFs are not rebuilt on deployment: after a change to the resume, run
  `npm run build && npm run cv:pdf` and commit both files.
- No post is published yet: the posts section does not exist on the live site
  ([posts.md](../features/posts.md)).
- The footers carry a "mentions légales" link that the redesign brief did not specify.

## Troubleshooting

| Symptom                                                                       | Cause and fix                                                                                                                                                         |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A push to `main` does not deploy                                              | The Vercel project is not connected to this repository, or was connected after the push. Check Settings → Git in Vercel, then push again (an empty commit is enough). |
| `tsc` cannot find `next/root-params`, `LayoutProps` or `PageProps`            | Generated types are missing. Run `npm run typecheck`, which calls `next typegen` first.                                                                               |
| Next.js warns about the workspace root or picks the wrong one                 | A stray lockfile exists higher up the tree. `turbopack.root` in `next.config.ts` pins the root to the repository.                                                     |
| An image or a script from another site does not load                          | Blocked by the CSP. See [security.md](../architecture/security.md).                                                                                                   |
| A new text shows in one language only, or the build fails on a dictionary key | The key is missing in one of the two locale files. See [i18n.md](../architecture/i18n.md#dictionaries).                                                               |
| The contact form shows "momentanément indisponible"                           | `DATABASE_URL` is missing in that environment, or the schema was never applied. See [database/neon.md](../database/neon.md).                                          |
| `/admin` asks for a password again and again                                  | `ADMIN_USER` or `ADMIN_PASSWORD` is missing or different in that environment (the server logs say when one is missing).                                               |
| The admin says "la copie quotidienne est inactive"                            | `WEB_ANALYTICS_TOKEN` is missing in that environment.                                                                                                                 |
| "Actualiser" answers that Vercel or the database did not reply                | The token is wrong or expired, the project or team id does not match, or the tables were never created (`npm run db:setup`). The server logs give the HTTP status.    |
| The history has a hole of several days                                        | The cron did not run (check `CRON_SECRET` and the Cron Jobs page). "Importer 30 jours" refills what Vercel still has.                                                 |
| The contact form answers 500 on a host that is not Vercel                     | BotID only runs on Vercel; the route skips it elsewhere. Check that the `VERCEL` variable is not set by hand.                                                         |
| The duration of the current job looks out of date                             | It is computed at build time. Redeploy.                                                                                                                               |
| `npm run cv:pdf` says a file has 2 pages                                      | The resume got longer than one A4 page. Shorten the content or reduce a size in the print page ([resume-pdf.md](../features/resume-pdf.md)).                          |
| A post does not show on the live site                                         | It is still a draft (`draft: true` in `lib/constants/posts.ts`), or it is not written in that language.                                                               |
| The conversion counters stay at zero in production                            | The table `funnel_daily` is missing (`npm run db:setup`), or BotID blocks the requests: `/api/events/` must be listed in `initBotId`.                                 |
