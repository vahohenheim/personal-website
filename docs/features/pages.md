---
title: Pages
description: The pages of the site (home, resume, 404, error), what each one shows, and the checklist to add a page.
related_code:
  - ../../app/[locale]/page.tsx
  - ../../app/[locale]/resume/page.tsx
  - ../../app/[locale]/resume/_components/
  - ../../app/[locale]/not-found.tsx
  - ../../app/[locale]/error.tsx
  - ../../app/[locale]/[...rest]/page.tsx
  - ../../lib/constants/pages.ts
  - ../../components/header/header.constants.ts
last_updated: 2026-10-10
---

# Pages

**Summary.** The site has two public pages, each in English and French, plus a translated
404 page and a translated error page. Pages are declared in
[lib/constants/pages.ts](../../lib/constants/pages.ts): metadata, the sitemap and the
structured data are keyed by that list, so a page cannot be added without completing them.

## Home: `/[locale]/`

[app/[locale]/page.tsx](../../app/[locale]/page.tsx), top to bottom:

1. **Cover**: portrait, name, title, summary with the main technologies, a contact button
   (`mailto:`) and the social network links.
2. **Companies**: logo strip of every company in `COMPANIES`, each linking to its site.
3. **Expertises**: three columns, with a button to the resume.
4. **Personal projects**: cards with status badge; a card links to the project when it has
   a `link`.

## Resume: `/[locale]/resume/`

[app/[locale]/resume/page.tsx](../../app/[locale]/resume/page.tsx):

1. **Cover**, left-aligned, with a button back to the home page.
2. **Expertises**, without the resume button.
3. **Experiences**: one block per experience (logo, company, location, dates and duration),
   then one entry per mission (roles, optional dates, description).
4. **Qualifications** and **Languages**.

The components used only here live in
[resume/_components/](../../app/[locale]/resume/_components/).

## 404 and error

- **404.** An unknown URL under a locale reaches `[...rest]/page.tsx`, which calls
  `notFound()`. Next.js renders [not-found.tsx](../../app/[locale]/not-found.tsx) inside
  the layout, in the right language, with a 404 status and a `noindex` tag. A URL without
  a locale is first redirected by `proxy.ts`.
- **Error.** [error.tsx](../../app/[locale]/error.tsx) is a Client Component. It gets its
  texts from a context set by the root layout ([i18n.md](../architecture/i18n.md)) and
  falls back to English if the context is missing.

## Header menu

Entries are in [header.constants.ts](../../components/header/header.constants.ts), as paths
without the locale and with a trailing slash. The `retrospectives` and `posts` entries are
commented out there; their translations already exist.

## Adding a page

Structured data is part of the job, not a follow-up.

1. Create `app/[locale]/<name>/page.tsx` and add its texts to both locale files.
2. Add the page to `PAGES` in `lib/constants/pages.ts` (path, `createdAt`, `updatedAt`).
   This feeds the canonical URL, the `hreflang` alternates and the sitemap.
3. Add its title and description to `getPageTexts` in `lib/helpers/metadata.ts`, and export
   `generateMetadata` from the page.
4. Describe it in `PAGE_GRAPHS` in `lib/helpers/json-ld.ts`, then render
   `<JsonLdComponent page="<name>" />` at the top of the page.
5. Choose the schema.org type from what the page is ([seo.md](seo.md#rules)).
6. Add it to the header menu if it belongs there.
7. Document it on this page.

Steps 3 and 4 are records keyed by `PageId`: the type check fails until both are filled in.
