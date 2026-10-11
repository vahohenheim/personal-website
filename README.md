# valentinbourreau.com

Personal website of Valentin Bourreau, senior front-end engineer: a home page, an online
resume and a legal notice, in English and French. Live at [valentinbourreau.com](https://www.valentinbourreau.com).

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 and shadcn/ui, on a design
charter of its own ([docs/redesign/](docs/redesign/charte-graphique-valentinbourreau.md)).
Pages are generated at build time. A contact form stores leads in a Neon database, read in
a private admin area that also shows the audience figures, copied from Vercel every day.

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

| Command          | What it does                               |
| ---------------- | ------------------------------------------ |
| `npm run dev`    | Development server                         |
| `npm run build`  | Production build                           |
| `npm run start`  | Serves the production build                |
| `npm run check`  | Types, lint and formatting, in one command |
| `npm run lint`   | ESLint with `--fix`                        |
| `npm run format` | Prettier on the whole repository           |

## Where things are

| Folder                                           | Content                                                        | Documentation                                                                                          |
| ------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `app/`                                           | Routing only: pages, layout, 404, error, sitemap, robots       | [features/pages.md](docs/features/pages.md), [architecture/overview.md](docs/architecture/overview.md) |
| `components/`                                    | Header, portrait, profile card, changelog entry, project card… | [frontend/components.md](docs/frontend/components.md), [frontend/styling.md](docs/frontend/styling.md) |
| `locales/content/`                               | Texts of the home page and the resume, in French and English   | [content/resume-data.md](docs/content/resume-data.md)                                                  |
| `lib/constants/`, `lib/models/`                  | Resume data used by the structured data, content types         | [content/resume-data.md](docs/content/resume-data.md)                                                  |
| `locales/`                                       | Dictionaries: metadata, labels, legal texts                    | [architecture/i18n.md](docs/architecture/i18n.md)                                                      |
| `lib/i18n/`, `proxy.ts`                          | Locales, dictionaries, language redirect                       | [architecture/i18n.md](docs/architecture/i18n.md)                                                      |
| `lib/helpers/`                                   | Meta tags and structured data (JSON-LD)                        | [features/seo.md](docs/features/seo.md)                                                                |
| `components/contact/`, `app/api/contact/`        | Contact dialog for leads and its API                           | [features/contact-form.md](docs/features/contact-form.md)                                              |
| `app/admin/`, `lib/admin/`                       | Dashboard of leads, behind HTTP Basic                          | [features/admin.md](docs/features/admin.md)                                                            |
| `db/`, `lib/db/`, `lib/leads/`                   | Neon schema, client and lead storage                           | [database/neon.md](docs/database/neon.md)                                                              |
| `lib/analytics/`, `app/api/cron/`, `vercel.json` | Daily copy of Vercel Web Analytics to Neon, shown in the admin | [features/analytics.md](docs/features/analytics.md)                                                    |
| `next.config.ts`                                 | Security headers and CSP                                       | [architecture/security.md](docs/architecture/security.md)                                              |
| `docs/`                                          | Documentation                                                  | [docs/README.md](docs/README.md)                                                                       |

## Changing the site

- **A text of the home page or the resume**: edit [locales/content/fr.ts](locales/content/fr.ts)
  and [locales/content/en.ts](locales/content/en.ts). Both files keep the same structure.
- **A new position, a project, the profile sheet**: follow the recipes in
  [content/resume-data.md](docs/content/resume-data.md).
- **A new page**: follow the checklist in [features/pages.md](docs/features/pages.md#adding-a-page).
  It includes the meta tags and the structured data.
- **The portrait**: replace [public/avatar.jpg](public/avatar.jpg) with another square image
  ([frontend/styling.md](docs/frontend/styling.md#portrait)).

Before pushing, run `npm run check` and `npm run build`. A GitHub Actions workflow runs both
on every push.

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
