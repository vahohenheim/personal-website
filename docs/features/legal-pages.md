---
title: Legal pages
description: The general terms of service (/cgv/) and the legal notice (/legal/) - where their texts live, how they are laid out, the PDF of the terms and its versions, the English pages, the handoff they come from, and the decisions taken against the brief.
related_code:
  - ../../app/[locale]/cgv/page.tsx
  - ../../app/[locale]/legal/page.tsx
  - ../../locales/legal/cgv.fr.ts
  - ../../locales/legal/notice.fr.ts
  - ../../locales/legal/notice.en.ts
  - ../../locales/fr.ts
  - ../../locales/en.ts
  - ../../lib/models/legal.ts
  - ../../lib/helpers/rich-text.ts
  - ../../lib/constants/terms.ts
  - ../../lib/constants/pages.ts
  - ../../components/legal-layout/legal-layout.tsx
  - ../../components/legal-toc/legal-toc.tsx
  - ../../components/numbered-section/numbered-section.tsx
  - ../../components/legal-blocks/legal-blocks.tsx
  - ../../components/identity-card/identity-card.tsx
  - ../../components/processing-list/processing-list.tsx
  - ../../components/rich-text/rich-text.tsx
  - ../../components/legal-links/legal-links.tsx
  - ../../components/site-footer/site-footer.tsx
  - ../../public/cgv/
  - ../../tests/unit/legal-content.test.ts
  - ../../tests/unit/rich-text.test.ts
  - ../../tests/e2e/legal.spec.ts
  - ../../tests/helpers/legal.ts
  - ../legal-handoff/
last_updated: 2026-10-15
---

# Legal pages

**Summary.** Two pages share one layout: the general terms of service
(_conditions générales de prestation_, `/[locale]/cgv/`, version 1.0 in force from
15 October 2026) and the legal notice and privacy page (`/[locale]/legal/`). Both are
numbered documents with a summary that follows the reading. Their texts are typed data
in `locales/legal/`, copied word for word from the handoff of 15 October 2026
([docs/legal-handoff/](../legal-handoff/)); a test compares them with the source. The
terms exist in French only: the English page shows the French text under a notice. Every
footer links to both pages.

## The pages

| Page                       | Content                                                                                                                                                                                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/fr/cgv/`                 | Trail `~/valentin-bourreau/cgv`, title, "version 1.0 · en vigueur au 15 octobre 2026" and the link to the PDF, the identity card of the provider, "Ci-après « le Prestataire »", then 20 articles (`#art-01` to `#art-20`). Articles 11 (suspension) and 12 (intellectual property) are framed by two rules in the text colour. |
| `/en/cgv/`                 | The same terms, in French, inside `lang="fr"` (identity card, summary, articles). Above them, in English: the title, the version line, the PDF link and "These terms are available in French only. The French version prevails (article 20)."                                                                                   |
| `/fr/legal/`, `/en/legal/` | Seven sections (`#sec-01` to `#sec-07`): publisher (with its identity card), hosting, services (link to the terms), intellectual property, personal data (one row per processing, with its retention period), cookies and local storage, your rights.                                                                           |

Internal references are links: "article 14" → `#art-14`, "article 12.2" → `#art-12-2` (the
subsection itself), "les articles 10, 12, 13 et 15" → one link per number, and article 14
points to the personal data section of the legal notice (`/fr/legal/#sec-05`). Every title
has a `#` link to itself, shown on hover and on keyboard focus. An anchor reached directly
keeps its title 24 px off the top (`scroll-padding-top` in `app/globals.css`).

## Where the texts live

| File                                                           | What                                                                                                                                  |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [locales/legal/cgv.fr.ts](../../locales/legal/cgv.fr.ts)       | The terms: identity, designation, summary labels, anchor label, 20 sections. French only; both dictionaries point to the same object. |
| [locales/legal/notice.fr.ts](../../locales/legal/notice.fr.ts) | The seven sections of the legal notice.                                                                                               |
| [locales/legal/notice.en.ts](../../locales/legal/notice.en.ts) | Their English mirror: same sections, same anchors, same blocks.                                                                       |
| `cgv` and `legal` in `locales/fr.ts` and `en.ts`               | Page chrome: title, version line, PDF link, notice, summary labels of the legal notice, meta tags.                                    |
| [lib/constants/terms.ts](../../lib/constants/terms.ts)         | Version, date in force and PDF path of the terms shown on the page.                                                                   |
| [lib/models/legal.ts](../../lib/models/legal.ts)               | The types: a section is a list of blocks (`p`, `ol`, `ul`, `subsection`, `identity`, `processing`).                                   |

Texts are plain strings with four inline marks, read by `parseRichText`
([lib/helpers/rich-text.ts](../../lib/helpers/rich-text.ts)) and drawn by
`RichTextComponent`: `[text](href)` for a link, `**text**` for strong text, `` `text` `` for
a name in mono (a cookie), `[[text]]` for a blank still to fill. No HTML goes through
`dangerouslySetInnerHTML`.

French typography is added to the source text, which has none: a non-breaking space
(`\u00a0`) before `: ; ! ?`, inside « », between a number and its unit (`30\u00a0jours`,
`40\u00a0€`, `293\u00a0B`), and a narrow non-breaking space (`\u202f`) between the groups of
the SIREN and the SIRET. Nothing else differs from the source.

## Components

| Component                  | Role                                                                                                                                                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LegalLayoutComponent`     | Intro (trail, H1 36 px on phones and 60 px from 768 px, meta, identity), then the summary and the sections. Draws the rules between sections, and the frame of a run of emphasised sections.                                              |
| `LegalTocComponent`        | Client component (scroll spy). `desktop`: sticky 248 px column, current entry in the accent with `aria-current="true"` (IntersectionObserver, `rootMargin: -20% 0px -70% 0px`). `mobile`: a native `<details>` that folds after a choice. |
| `NumberedSectionComponent` | Grid `32px / 1fr` (48 px from 768 px): number in mono, H2 21 px, `#` link, body. `emphasis`: number in the text colour, 48 px of padding.                                                                                                 |
| `LegalBlocksComponent`     | Paragraphs, lists (markers in `--muted`), H3 subsections with their number in mono, and the two cards below.                                                                                                                              |
| `IdentityCardComponent`    | shadcn `Card` on `--surface`: a mono `<dl>`, labels in a 140 px column (96 px on phones), values that break anywhere.                                                                                                                     |
| `ProcessingListComponent`  | The processing of personal data: name in bold, retention in mono `--muted`, then the text; one valid `<dl>`, one row each.                                                                                                                |
| `LegalLinksComponent`      | "mentions légales · cgv" ("legal notice · terms") in every footer; the link of the current page is in the accent with `aria-current="page"`.                                                                                              |

Both summaries are hidden in print (`print-hidden`), and the print style is the day mode,
like the rest of the site.

## The PDF of the terms

`public/cgv/cgp-1.0.pdf`, linked from the page in both languages. A signed quote refers to
one version of the terms, so a version is never replaced:

1. Add the new PDF next to the old one (`public/cgv/cgp-1.1.pdf`); keep the old one online.
2. Update the texts in `locales/legal/cgv.fr.ts` and `TERMS` (version, date, PDF path).
3. Bump `updatedAt` of `cgv` in `PAGES`, and replace `docs/legal-handoff/content/cgv.fr.md`
   with the new source so that the word-for-word test follows.

## Placeholders still to fill

| Where                                                      | Text                                                                                                |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Legal notice, personal data, "Destinataires et transferts" | "la plateforme de facturation électronique agréée **[à compléter]**" (English: "[to be completed]") |

It shows as a small mono box on purpose. A unit test lists the placeholders: when Valentin
fills it, remove the `[[…]]` mark in both languages and update the test.

## English passages to proofread

Translated on 15 October 2026 without Valentin, in `locales/legal/notice.en.ts` and the
`cgv` chrome of `locales/en.ts`:

- Publisher: the "Business: freelance software development and front-end engineering"
  sentence, and the card rows `siret (head office)`, `vat` ("not applicable, article 293 B
  of the French tax code (CGI)"), `publication` ("Valentin Bourreau, publication director").
- Services (whole section), with "(in French)" after the link, which the French text does
  not need.
- Intellectual property: the fonts and third-party names paragraph.
- Personal data: the "Clients" row; "For clients: …" in the legal basis; the e-invoicing
  sentence in recipients; the retention labels of every row.
- Your rights: "Data the law requires to be kept…".
- Terms page: title "General terms of service", "version … · effective from …",
  "download as PDF", the notice, the meta description, and the footer label "terms".

## Tests

- [tests/unit/legal-content.test.ts](../../tests/unit/legal-content.test.ts): the terms are
  the source, article by article and item by item (marks removed, non-breaking spaces read
  as spaces); the identity comes from the source; ids `art-01` to `art-20`, emphasis on 11
  and 12 only; every internal link has its anchor. The legal notice is the source outside
  the publisher's card, whose facts are checked one by one; the English notice has the same
  structure and links; the placeholders are listed.
- [tests/e2e/legal.spec.ts](../../tests/e2e/legal.spec.ts): the rendered text against the
  source, the PDF, an anchor reached directly, internal links, the sticky summary and its
  current entry (desktop), the folded summary (phone), the English page, the footer on every
  page. Both pages also run through axe in both modes with every other page.
- Smoke tests: both pages in both languages, the PDF, the sitemap, the footer links,
  `lang="fr"` on the English terms.

## The handoff

The brief, the texts and the mockups Valentin prepared are kept in
[docs/legal-handoff/](../legal-handoff/), as delivered (Prettier skips the folder):
`PROMPT.md` (the brief, in French), `content/*.md` (the source texts, read by the tests),
`reference/*.html` (the mockups, open them in a browser) and `tokens.css`. Removed from the
final tree, and still in the commit that added them (`3c37e31`): the eight PNG captures
(6.7 MB, 1440 and 390 px, day and night), the copy of the charter (identical to
[redesign/charte-graphique-valentinbourreau.md](../redesign/charte-graphique-valentinbourreau.md))
and `cgp-1.0.pdf`, moved to `public/cgv/`. `git show 3c37e31:docs/legal-handoff/reference/captures/cgv-desktop-jour.png > cgv.png`
gets a capture back.

## Decisions taken against the brief

The brief was written without the repository. Where they disagreed, the repository won on
architecture and conventions, and the brief, its mockups and the charter on look and
content. Valentin delegated the work and could not be asked; these are the calls made.

| Brief                                                                     | Done                                                                                                                                                                       | Why                                                                                                                             |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Propose a plan and wait for approval                                      | Planned and built without waiting                                                                                                                                          | Valentin delegated the whole job                                                                                                |
| Routes `/fr/cgv`, `/fr/legal#sec-05`                                      | `/fr/cgv/`, `/fr/legal/#sec-05`                                                                                                                                            | Internal links carry a trailing slash                                                                                           |
| Title "… — valentinbourreau"                                              | "Conditions générales de prestation \| valentinbourreau"                                                                                                                   | Every title of the site ends with "\| valentinbourreau"                                                                         |
| Body 1120 px wide, side margins 16 px on phones                           | The site's `container-page` (1040 px, `clamp(20px, 4vw, 48px)`)                                                                                                            | The body stays aligned with the header and the footer; the article column is about 630 px wide at 1440 px instead of 700        |
| Trail `~/valentin-bourreau / cgv`                                         | The site's `BreadcrumbComponent`: `~/valentin-bourreau/cgv`                                                                                                                | Same trail as the other pages                                                                                                   |
| `#` link with `aria-label` "Lien vers l’article N", inside the H2         | Next to the H2, glyph `aria-hidden` and the label as visually hidden text                                                                                                  | The heading's name stays its title, and the repository asks for a visible text inside every `aria-label`                        |
| Footer links underlined                                                   | Not underlined, like the other footer links                                                                                                                                | Consistency with the existing footers                                                                                           |
| Texts "mot pour mot", characters kept                                     | Word for word; non-breaking and narrow spaces added                                                                                                                        | The source has no non-breaking space; the charter and the brief's own rules ask for them, and the mockups have them             |
| Article 5 "Obligations du client" (mockup, PDF)                           | "Obligations du Client" (source text)                                                                                                                                      | The source text is the authority on words, and "Client" is the defined term. **The PDF and the mockup say "client": to align.** |
| Legal notice order: "E-mail" after "Destinataires et transferts" (source) | "E-mail" is the last row of the processing list, before "Base légale" (mockup, brief's list)                                                                               | The brief lists it among the processing rows                                                                                    |
| Retention labels ("3 ans après le dernier échange"…)                      | Kept from the mockup, with non-breaking spaces (`3\u00a0ans`)                                                                                                              | They are in the mockup, not in the source text                                                                                  |
| Publisher lines (SIREN…, TVA, address, director, contact)                 | The identity card of the mockup                                                                                                                                            | As specified; the test checks each fact against the source                                                                      |
| Legal meta line                                                           | "dernière mise à jour le 15 octobre 2026", lowercase mono, from `PAGES.legal.updatedAt`                                                                                    | Mockup                                                                                                                          |
| `/en/cgv`: only the article in `lang="fr"`                                | The identity card, the designation, the summary and the articles in `lang="fr"`; title, version line, PDF link and notice in English; "article 20" in the notice is a link | Everything French on the page is marked as French                                                                               |
| `/en/legal`: translate the new passages                                   | Done, see the list above; the services paragraph says "(in French)"                                                                                                        | An English reader lands on French terms                                                                                         |
| Section anchor names on the legal page ("Lien vers la section éditeur")   | "Lien vers la section {title}" with the title as written                                                                                                                   | One template for every section                                                                                                  |
| Anchor of article 12.2 → `#art-12`                                        | `#art-12-2`, the subsection itself                                                                                                                                         | The reader lands on the clause cited                                                                                            |
| `pnpm lint`, `pnpm build`                                                 | `npm run check`, `npm test`, `npm run build`, `npm run test:smoke`, `npm run test:e2e`                                                                                     | npm is the repository's package manager                                                                                         |
| Lighthouse accessibility = 100                                            | axe (WCAG 2.2 A and AA) on both pages, both languages, both modes, desktop and 375 px                                                                                      | Lighthouse is not part of the test suite; its accessibility audit is axe                                                        |
| Captures at 390 px                                                        | Compared at 375 px                                                                                                                                                         | The repository's phone viewport                                                                                                 |
