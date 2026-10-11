---
title: Pages
description: The pages of the site (home, resume, legal notice, 404, error), what each one shows, and the checklist to add a page.
related_code:
  - ../../app/[locale]/page.tsx
  - ../../app/[locale]/resume/page.tsx
  - ../../app/[locale]/legal/page.tsx
  - ../../app/[locale]/not-found.tsx
  - ../../app/[locale]/error.tsx
  - ../../app/[locale]/[...rest]/page.tsx
  - ../../lib/constants/pages.ts
  - ../../locales/content/fr.ts
  - ../../locales/content/en.ts
last_updated: 2026-10-11
---

# Pages

**Summary.** The site has three public pages, each in French and English (home, resume,
legal notice), plus a translated 404 page and a translated error page. The home page and
the resume follow the brief of the redesign ([brief.md](../redesign/brief.md)), whose
French texts are reproduced word for word. Pages are declared in
[lib/constants/pages.ts](../../lib/constants/pages.ts): metadata, the sitemap and the
structured data are keyed by that list.

## Home: `/[locale]/`

[app/[locale]/page.tsx](../../app/[locale]/page.tsx), top to bottom:

1. **Hero:** portrait and breadcrumb, title, lead, the key / value sheet, two buttons
   (contact, resume). Contact buttons open the [contact dialog](contact-form.md).
2. **What I bring:** a pull quote, then three cells separated by 1 px rules.
3. **Changelog:** five entries, the current one dated in the accent colour, with a link
   to the full changelog (the resume).
4. **Projects** (`#projects`): three cards, then the archived ones as a line of links.
5. **Contact** (`#contact`): the page footer, with the main contact link, the social
   links as words, the copyright line and the link to the legal notice.

## Resume: `/[locale]/resume/`

[app/[locale]/resume/page.tsx](../../app/[locale]/resume/page.tsx):

1. **Header:** portrait and breadcrumb, title, a mono line (name, status, experience,
   location), summary, two buttons (download `cv.pdf`, contact).
2. **Stack:** a key / value sheet.
3. **Changelog:** every position, with durations, successive roles, achievements, and the
   earlier positions grouped in a last entry.
4. **Education** and **languages**, side by side.

The download button points to `/cv.pdf`, which is expected in `public/`.

## Legal notice and privacy: `/[locale]/legal/`

[app/[locale]/legal/page.tsx](../../app/[locale]/legal/page.tsx) renders the sections of
`legal.sections` in the dictionaries. Both footers link to it.

It exists because French law requires a site to name at least its hosting provider, and
the GDPR requires visitors to be told how their data is handled. Whenever a tool that
touches visitor data is added, removed or changed, update the texts in both languages and
bump `updatedAt` for `legal` in `PAGES`.

## 404 and error

- **404.** An unknown URL under a locale reaches `[...rest]/page.tsx`, which calls
  `notFound()`: Next.js renders `not-found.tsx` inside the layout, in the right language,
  with a 404 status.
- **Error.** `error.tsx` is a Client Component. It gets its texts from a context set by
  the root layout, and offers "try again" and a link home.

## Header and footers

The header is rendered by the root layout. Its links are `cv` (the resume), `projets` and
`contact` (the two anchors of the home page), the language link and the theme button.
Each page renders its own footer: the home page ends with its contact section, the other
pages with `SiteFooterComponent`.

## Adding a page

Structured data is part of the job, not a follow-up.

1. Create `app/[locale]/<name>/page.tsx`. Start `<main id="main" className="container-page">`
   and end with `<SiteFooterComponent />`.
2. Add its texts to both locale files, typed in `lib/models/content.ts` if they are
   structured.
3. Add the page to `PAGES` in `lib/constants/pages.ts` (path, dates, sitemap hints).
4. Add its title and description to `getPageTexts` in `lib/helpers/metadata.ts`, and
   export `generateMetadata` from the page.
5. Describe it in `PAGE_GRAPHS` in `lib/helpers/json-ld.ts`, and render
   `<JsonLdComponent page="<name>" />`.
6. Add it to the header nav only if it belongs there, and check the header at 375 px.
7. Document it on this page.

Steps 4 and 5 are records keyed by `PageId`: the type check fails until both are filled in.
