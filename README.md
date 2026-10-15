# valentinbourreau.com

Personal website of Valentin Bourreau, senior front-end engineer: a home page, an online
resume with a one-page PDF, posts, a legal notice and the general terms of service, in
English and French. Live at [valentinbourreau.com](https://www.valentinbourreau.com).

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 and shadcn/ui, on a design
charter of its own ([docs/redesign/](docs/redesign/charte-graphique-valentinbourreau.md)).
Pages are generated at build time. A contact form stores leads in a Neon database and
forwards them to a private management app; a private admin area follows them up and shows
the conversion funnel and the audience figures, copied from Vercel every day.

## Getting started

Requires Node 22 or later (`.nvmrc` pins 24).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000): the root URL redirects to `/en/` or
`/fr/` according to the browser language.

No configuration is needed locally: without a database, leads sent through the contact
form stay in memory. Copy [.env.example](.env.example) to `.env.local` to set the admin
credentials or a database.

## Scripts

| Command              | What it does                                   |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Development server                             |
| `npm run build`      | Production build                               |
| `npm run start`      | Serves the production build                    |
| `npm run check`      | Types, lint and formatting, in one command     |
| `npm test`           | Unit tests and route handlers                  |
| `npm run test:smoke` | The built site called over HTTP, after a build |
| `npm run test:e2e`   | The built site in a browser, after a build     |
| `npm run lint`       | ESLint with `--fix`                            |
| `npm run format`     | Prettier on the whole repository               |
| `npm run cv:pdf`     | Prints the resume PDFs, after a build          |
| `npm run cgv:pdf`    | Prints the terms of one language to a PDF      |
| `npm run db:setup`   | Applies the database schema                    |

## Where things are

| Folder                                                           | Content                                                               | Documentation                                                                                          |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `app/`                                                           | Routing only: pages, layout, 404, error, sitemap, robots              | [features/pages.md](docs/features/pages.md), [architecture/overview.md](docs/architecture/overview.md) |
| `components/`                                                    | Header, portrait, profile card, changelog entry, project card…        | [frontend/components.md](docs/frontend/components.md), [frontend/styling.md](docs/frontend/styling.md) |
| `locales/content/`                                               | Texts of the home page and the resume, in French and English          | [content/resume-data.md](docs/content/resume-data.md)                                                  |
| `lib/constants/`, `lib/models/`                                  | Resume data used by the structured data, content types                | [content/resume-data.md](docs/content/resume-data.md)                                                  |
| `locales/`                                                       | Dictionaries: metadata, labels                                        | [architecture/i18n.md](docs/architecture/i18n.md)                                                      |
| `locales/legal/`, `public/cgv/`                                  | Legal notice and terms of service, and the PDF of each terms version  | [features/legal-pages.md](docs/features/legal-pages.md)                                                |
| `lib/i18n/`, `proxy.ts`                                          | Locales, dictionaries, language redirect                              | [architecture/i18n.md](docs/architecture/i18n.md)                                                      |
| `lib/helpers/`                                                   | Meta tags and structured data (JSON-LD)                               | [features/seo.md](docs/features/seo.md)                                                                |
| `components/contact/`, `app/api/contact/`                        | Contact dialog for leads and its API                                  | [features/contact-form.md](docs/features/contact-form.md)                                              |
| `app/admin/`, `lib/admin/`                                       | Dashboard of leads, behind HTTP Basic                                 | [features/admin.md](docs/features/admin.md)                                                            |
| `db/`, `lib/db/`, `lib/leads/`                                   | Neon schema, client and lead storage                                  | [database/neon.md](docs/database/neon.md)                                                              |
| `lib/analytics/`, `app/api/cron/`, `vercel.json`                 | Daily copy of Vercel Web Analytics to Neon, shown in the admin        | [features/analytics.md](docs/features/analytics.md)                                                    |
| `lib/funnel/`, `app/api/events/`                                 | Anonymous counters of the contact form and the conversion funnel      | [features/conversion.md](docs/features/conversion.md)                                                  |
| `lib/lotus/`, `app/api/cron/lotus-sync/`                         | Leads forwarded to lotus through a signed webhook, with a daily retry | [features/lotus-sync.md](docs/features/lotus-sync.md)                                                  |
| `tests/`, `vitest.config.ts`, `vitest.smoke.config.ts`           | Test suite: unit, route handlers, smoke tests of the built site       | [development/testing.md](docs/development/testing.md)                                                  |
| `content/posts/`, `lib/constants/posts.ts`, `mdx-components.tsx` | Posts written in MDX, their registry and their MDX components         |
| `public/posts/`                                                  | Images of the posts, WebP at 2x, day and night pairs                  | [features/posts.md](docs/features/posts.md#images)                                                     |
| `lib/posts/`, `app/api/posts/unlock/`, `app/[locale]/unlock/`    | Reading time and summary; password-protected posts                    | [features/posts.md](docs/features/posts.md)                                                            |
| `app/[locale]/resume/print/`, `scripts/`                         | The resume on one A4 page and the script that prints it               | [features/resume-pdf.md](docs/features/resume-pdf.md)                                                  |
| `next.config.ts`                                                 | Security headers and CSP                                              | [architecture/security.md](docs/architecture/security.md)                                              |
| `docs/`                                                          | Documentation                                                         | [docs/README.md](docs/README.md)                                                                       |

## Changing the site

- **A text of the home page or the resume**: edit [locales/content/fr.ts](locales/content/fr.ts)
  and [locales/content/en.ts](locales/content/en.ts). Both files keep the same structure.
- **A new position, a project, the profile sheet**: follow the recipes in
  [content/resume-data.md](docs/content/resume-data.md).
- **The resume**: after changing its texts, run `npm run build && npm run cv:pdf` and commit
  the two PDFs ([features/resume-pdf.md](docs/features/resume-pdf.md)).
- **A post**: write `content/posts/<slug>/<locale>.mdx`, put its images in
  `public/posts/<slug>/`, add it to [lib/constants/posts.ts](lib/constants/posts.ts) and
  its loader to [lib/constants/post-bodies.ts](lib/constants/post-bodies.ts). Drafts show
  on preview deployments. Checklist in [features/posts.md](docs/features/posts.md#checklist-publishing-a-post).
- **The legal notice or the terms**: edit the Markdown source in `docs/legal-handoff/content/`
  and `locales/legal/`; a new version of the terms adds its PDFs in `public/cgv/`
  (`npm run cgv:pdf -- en` for the English one) and never replaces one ([features/legal-pages.md](docs/features/legal-pages.md)).
- **A new page**: follow the checklist in [features/pages.md](docs/features/pages.md#adding-a-page).
  It includes the meta tags and the structured data.
- **The portrait**: replace [public/avatar.jpg](public/avatar.jpg) with another square image
  ([frontend/styling.md](docs/frontend/styling.md#portrait)).

Before pushing, run `npm run check`, `npm test`, `npm run build`, `npm run test:smoke` and
`npm run test:e2e`. A GitHub Actions workflow runs all five on every push.

## Deployment

A push to `main` deploys to production on Vercel. See the
[runbook](docs/operations/runbook.md#deployment) for how to follow a deployment, upgrade
dependencies and troubleshoot.

## Project rules

The working rules and the request log are in [CLAUDE.md](CLAUDE.md). The main one: **every
change updates, in the same commit, the pages of [docs/](docs/README.md) that cover it.**

## Licence

The code, the texts and the images are © Valentin Bourreau, all rights reserved. The
repository is public for reference; it is not open source.
