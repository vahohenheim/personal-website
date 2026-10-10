---
title: Runbook
description: Local setup, commands, deployment to Vercel, dependency upgrades and their current limits, and troubleshooting.
related_code:
  - ../../package.json
  - ../../next.config.ts
  - ../../.github/workflows/ci.yml
  - ../../.nvmrc
  - ../../AGENTS.md
  - ../../.gitignore
last_updated: 2026-10-10
---

# Runbook

**Summary.** The site needs Node 22 or later (24 is the pinned version) and nothing else: no environment variable,
no database, no external service to configure. A push to `main` deploys to production on
Vercel.

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The root URL redirects to `/en/` or `/fr/` according to the
browser language.

| Command         | What it does                                                                   |
| --------------- | ------------------------------------------------------------------------------ |
| `npm run dev`   | Development server (Turbopack)                                                 |
| `npm run build` | Production build                                                               |
| `npm run start` | Serves the production build                                                    |
| `npm run check` | Types, lint and formatting ([code-quality.md](../development/code-quality.md)) |

`next dev` generates `AGENTS.md`, which points coding agents to the Next.js documentation
shipped in `node_modules/next/dist/docs/`. Do not edit it; commit it when it changes.

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
- Under `public/`, only `avatar.jpg` is referenced by the code (logos are React components in
  `components/icons/`). The other files may still be linked from outside the site, so check
  before deleting.
- The `bloom` personal project has no link: `github.com/vahohenheim/bloom` returns a 404.

## Troubleshooting

| Symptom                                                                       | Cause and fix                                                                                                                                                         |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A push to `main` does not deploy                                              | The Vercel project is not connected to this repository, or was connected after the push. Check Settings → Git in Vercel, then push again (an empty commit is enough). |
| `tsc` cannot find `next/root-params`, `LayoutProps` or `PageProps`            | Generated types are missing. Run `npm run typecheck`, which calls `next typegen` first.                                                                               |
| Next.js warns about the workspace root or picks the wrong one                 | A stray lockfile exists higher up the tree. `turbopack.root` in `next.config.ts` pins the root to the repository.                                                     |
| An image or a script from another site does not load                          | Blocked by the CSP. See [security.md](../architecture/security.md).                                                                                                   |
| A new text shows in one language only, or the build fails on a dictionary key | The key is missing in one of the two locale files. See [i18n.md](../architecture/i18n.md#dictionaries).                                                               |
| The duration of the current job looks out of date                             | It is computed at build time. Redeploy.                                                                                                                               |
