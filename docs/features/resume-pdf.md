---
title: Resume PDF
description: The one-page A4 resume of the design charter: the print page it is made from, the script that prints it in each language, and when to regenerate it.
related_code:
  - ../../app/[locale]/resume/print/page.tsx
  - ../../app/[locale]/resume/page.tsx
  - ../../app/globals.css
  - ../../scripts/cv-pdf.mjs
  - ../../public/cv-fr.pdf
  - ../../public/cv-en.pdf
  - ../../locales/content/fr.ts
  - ../../locales/content/en.ts
  - ../../next.config.ts
last_updated: 2026-10-12
---

# Resume PDF

**Summary.** The download button of the resume serves `public/cv-fr.pdf` or
`public/cv-en.pdf`: one A4 page, laid out as the
[design charter](../redesign/charte-graphique-valentinbourreau.md) asks. Both files are
printed from a dedicated page by `npm run cv:pdf` and committed. They are **not** rebuilt
on deployment: regenerate them after any change to the resume.

## The print page

[/[locale]/resume/print/](../../app/[locale]/resume/print/page.tsx) renders the same
content as the resume (`resume` in `locales/content/`), for paper:

- day mode, whatever the theme, on screen too;
- 20 mm margins; a header with the 22 mm portrait, the wordmark, the title and a mono
  line, with no rule under it;
- two columns: 40 mm for the stack, education and languages; 120 mm for the changelog;
- sizes in mm and pt. The charter's print scale is 28 pt for the title and 8.5 pt for
  mono; body text is 9.5 pt on 13 pt (the charter says 10 on 14) so that everything fits
  on one page.

The page is `noindex`, absent from the sitemap and from `PAGES`, and linked from nowhere.
The `.resume-sheet` rules in [globals.css](../../app/globals.css) hide what the root
layout renders around it (header, skip link, toasts) and give its page no margin, since
the sheet carries its own.

## Generating the files

```bash
npm run build
npm run cv:pdf
```

[scripts/cv-pdf.mjs](../../scripts/cv-pdf.mjs) starts the build on a local port, prints
each language with a local Chrome in headless mode, and **fails when a file is not exactly
one page**. Then look at both files and commit them. `CHROME_PATH` points to Chrome when
it is not in a usual place.

If a file comes out on two pages, the content got longer: shorten it, or reduce a size in
the print page. Do not shrink the margins.

## Links

- The button of the resume links to `/cv-<locale>.pdf`.
- `/cv.pdf`, the single file that existed before, redirects to `/cv-fr.pdf`
  (`redirects()` in `next.config.ts`).

## Printing the resume page itself

A visitor who prints `/[locale]/resume/` gets the `@media print` rules of `globals.css`:
day mode, no navigation, no buttons. It is not the charter's layout and takes two pages.
