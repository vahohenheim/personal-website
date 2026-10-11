---
title: Architecture overview
description: Stack, folder structure and rendering model of the site, with the path of a request from the browser to a static page.
related_code:
  - ../../app/[locale]/layout.tsx
  - ../../app/[locale]/page.tsx
  - ../../app/[locale]/resume/page.tsx
  - ../../proxy.ts
  - ../../next.config.ts
  - ../../package.json
last_updated: 2026-10-11
---

# Architecture overview

**Summary.** The site is a Next.js 16 application (App Router, Turbopack) deployed on
Vercel. Its three public pages (home, resume, legal notice), each in French and English,
are generated at build time. Three things run per request: `proxy.ts` (locale redirect and
the gate of the admin area), `POST /api/contact/` (the contact form, stored in a Neon
database) and `/admin` (the dashboard of leads).

## The system at a glance

```mermaid
flowchart LR
    V([Visitor]) -->|/ or /resume/| P[proxy.ts<br/>picks en or fr]
    P -->|307 to /fr/...| V
    V -->|/fr/, /en/resume/...| S[Static pages<br/>built from locales/ and lib/constants/]
    V -->|unknown URL| N[not-found.tsx<br/>rendered on demand, 404]
    V -->|contact dialog| C[POST /api/contact/<br/>BotID, validation]
    C --> DB[(Neon: leads)]
    T([Valentin]) -->|/admin, HTTP Basic| ADM[Admin dashboard]
    ADM --> DB
    S -->|page views| A[Vercel Analytics]
```

## Stack

| Layer        | Choice                                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router), React 19                                                                                             |
| Language     | TypeScript 6, strict                                                                                                          |
| Styling      | Tailwind CSS v4 and shadcn/ui, themed with the Eucalyptus tokens of the design charter ([styling.md](../frontend/styling.md)) |
| Translations | Plain dictionaries, no library ([i18n.md](i18n.md))                                                                           |
| Dates        | `dayjs`                                                                                                                       |
| Fonts        | Geist and Geist Mono, from the `geist` package                                                                                |
| Analytics    | Vercel Analytics                                                                                                              |
| Hosting      | Vercel, deployed on every push to `main` ([runbook](../operations/runbook.md))                                                |

## Folder structure

`app/` holds routing only. Everything else lives in `components/`, `lib/` and `locales/`.

```
app/
  globals.css               Tailwind v4 + the Eucalyptus tokens and global rules
  favicon.ico, apple-icon.tsx  Favicon, and the generated Apple icon
  manifest.ts, robots.ts, sitemap.ts
  [locale]/                 Root segment: every route is under a locale
    layout.tsx              Root layout: <html>, fonts, theme, header, analytics
    page.tsx                Home (ends with its contact footer)
    opengraph-image.tsx     Sharing image, one per locale
    error.tsx               Error boundary (Client Component), translated
    not-found.tsx           Translated 404, rendered inside the layout
    [...rest]/page.tsx      Catch-all that sends unknown URLs to not-found.tsx
    resume/page.tsx         Resume
    legal/page.tsx          Legal notice and privacy
  admin/                    Dashboard of leads: own root layout, French only
  api/contact/route.ts      Receives a lead from the contact dialog
components/                 One folder per component (header, avatar, breadcrumb,
                            profile-card, changelog-entry, project-card…)
  ui/                       shadcn/ui components, restyled for the charter
lib/
  i18n/                     Locales, getLocale, getDictionary
  leads/                    Validation and storage of leads
  db/                       Neon client
  admin/                    Authentication, guard and figures of the admin
  models/                   Types: page contents (content.ts) and resume data
  constants/                Site data used by the structured data, page registry
  helpers/                  metadata.ts, json-ld.ts, og-fonts.ts
  utils/                    cn.ts
locales/                    en.ts, fr.ts: dictionaries
  content/                  en.ts, fr.ts: texts of the home page and the resume
proxy.ts                    Locale redirect and gate of /admin
instrumentation-client.ts   Routes protected by Vercel BotID
db/                         schema.sql and its setup script
public/                     Portrait, security.txt
docs/                       This documentation; redesign/ holds the brief and the charter
```

Import alias: `@/*` points to the repository root. A relative import may reach a sibling
folder (`../appear/appear`); anything further goes through the alias.

## Rendering model

- `app/[locale]/layout.tsx` is the root layout. There is no `app/layout.tsx`, which makes
  `locale` a root parameter readable anywhere on the server ([i18n.md](i18n.md)).
- `generateStaticParams` in the root layout lists the locales, so `/en/`, `/fr/`,
  `/en/resume/` and `/fr/resume/` are prerendered.
- Almost every component is a Server Component. Client Components exist only for
  what needs the browser: the header nav (current path), the theme button, the theme
  provider and the error boundary.
- The catch-all route `[...rest]` is the only dynamic route. It calls `notFound()`, which
  renders `not-found.tsx` inside the layout, in the right language, with a 404 status.
- Durations on the resume ("2 years") are computed at build time. They refresh on the next
  deployment, not by themselves.

## Related pages

- Pages and how to add one: [features/pages.md](../features/pages.md).
- Where the content lives: [content/resume-data.md](../content/resume-data.md).
- Headers and CSP: [security.md](security.md).
