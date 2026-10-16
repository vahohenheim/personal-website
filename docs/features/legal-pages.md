---
title: Legal pages
description: The general terms of service (/cgv/) and the legal notice (/legal/) - where their texts live, how they are laid out, the PDFs of the terms and their versions, the English pages, open items, the handoff they come from, and the decisions taken against the brief.
related_code:
  - ../../app/[locale]/cgv/page.tsx
  - ../../app/[locale]/legal/page.tsx
  - ../../locales/legal/cgv.fr.ts
  - ../../locales/legal/cgv.en.ts
  - ../../locales/legal/notice.fr.ts
  - ../../locales/legal/notice.en.ts
  - ../../locales/fr.ts
  - ../../locales/en.ts
  - ../../lib/models/legal.ts
  - ../../lib/helpers/rich-text.ts
  - ../../lib/constants/terms.ts
  - ../../lib/constants/pages.ts
  - ../../components/legal-layout/legal-layout.tsx
  - ../../components/toc/toc.tsx
  - ../../components/document-layout/document-layout.tsx
  - ../../components/numbered-section/numbered-section.tsx
  - ../../components/legal-blocks/legal-blocks.tsx
  - ../../components/key-value/key-value.tsx
  - ../../components/processing-list/processing-list.tsx
  - ../../components/rich-text/rich-text.tsx
  - ../../components/legal-links/legal-links.tsx
  - ../../components/site-footer/site-footer.tsx
  - ../../public/cgv/
  - ../../scripts/cgv-pdf.mjs
  - ../../tests/unit/legal-content.test.ts
  - ../../tests/unit/rich-text.test.ts
  - ../../tests/e2e/legal.spec.ts
  - ../../tests/helpers/legal.ts
  - ../legal-handoff/
last_updated: 2026-10-16
---

# Legal pages

**Summary.** Two pages share one layout: the general terms of service
(_conditions générales de prestation_, `/[locale]/cgv/`, version 1.0 in force from
15 October 2026) and the legal notice and privacy page (`/[locale]/legal/`). Both are
numbered documents with a summary that follows the reading. Their texts are typed data
in `locales/legal/`, copied word for word from the Markdown sources of
[docs/legal-handoff/content/](../legal-handoff/content/); a test compares them. The terms
exist in French and in English; the English text is a translation and the French version
prevails (article 20). Each language has its PDF. Every footer links to both pages.

## The pages

| Page                       | Content                                                                                                                                                                                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/fr/cgv/`                 | Trail `~/valentin-bourreau/cgv`, title, "version 1.0 · en vigueur au 15 octobre 2026" and the link to the PDF, the identity card of the provider, "Ci-après « le Prestataire »", then 20 articles (`#art-01` to `#art-20`). Articles 11 (suspension) and 12 (intellectual property) are framed by two rules in the text colour. |
| `/en/cgv/`                 | The English translation, same layout and same anchors: "General terms of service", "version 1.0 · effective from 15 October 2026", the link to the English PDF, then the notice "These Terms are a translation of the French original. In the event of any discrepancy, the French version prevails (article 20)."              |
| `/fr/legal/`, `/en/legal/` | Seven sections (`#sec-01` to `#sec-07`): publisher (with its identity card), hosting, services (link to the terms), intellectual property, personal data (one row per processing, with its retention period), cookies and local storage, your rights.                                                                           |

Internal references are links: "article 14" → `#art-14`, "article 12.2" → `#art-12-2` (the
subsection itself), "les articles 10, 12, 13 et 15" → one link per number, and article 14
points to the personal data section of the legal notice in the same language
(`/fr/legal/#sec-05`, `/en/legal/#sec-05`). Every title has a `#` link to itself, shown on
hover and on keyboard focus. An anchor reached directly keeps its title 24 px off the top
(`scroll-padding-top` in `app/globals.css`).

## Where the texts live

| File                                                                                                 | What                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [docs/legal-handoff/content/cgv.fr.md](../legal-handoff/content/cgv.fr.md)                           | The terms, French original, as Valentin handed them over. The reference.                                                                                                    |
| [docs/legal-handoff/content/cgv.en.md](../legal-handoff/content/cgv.en.md)                           | The English translation, same structure line for line. **The single source of the English terms:** the site, the English PDF and lotus (English quotes) all take this text. |
| [docs/legal-handoff/content/mentions-legales.fr.md](../legal-handoff/content/mentions-legales.fr.md) | The legal notice, French.                                                                                                                                                   |
| [locales/legal/cgv.fr.ts](../../locales/legal/cgv.fr.ts), [cgv.en.ts](../../locales/legal/cgv.en.ts) | The terms of each language: identity, designation, summary labels, anchor label, 20 sections. Same sections, subsections and anchors.                                       |
| [locales/legal/notice.fr.ts](../../locales/legal/notice.fr.ts)                                       | The seven sections of the legal notice.                                                                                                                                     |
| [locales/legal/notice.en.ts](../../locales/legal/notice.en.ts)                                       | Their English mirror, approved by Valentin: same sections, same anchors, same blocks.                                                                                       |
| `cgv` and `legal` in `locales/fr.ts` and `en.ts`                                                     | Page chrome: title, version line, PDF link, notice, summary labels of the legal notice, meta tags.                                                                          |
| [lib/constants/terms.ts](../../lib/constants/terms.ts)                                               | Version, date in force and the PDF path of each language.                                                                                                                   |
| [lib/models/legal.ts](../../lib/models/legal.ts)                                                     | The types: a section is a list of blocks (`p`, `ol`, `ul`, `subsection`, `identity`, `processing`).                                                                         |

Texts are plain strings with three inline marks, read by `parseRichText`
([lib/helpers/rich-text.ts](../../lib/helpers/rich-text.ts)) and drawn by
`RichTextComponent`: `[text](href)` for a link, `**text**` for strong text, `` `text` `` for
a name in mono (a cookie). No HTML goes through `dangerouslySetInnerHTML`.

Typography is added to the source texts, which have none: in French, a non-breaking space
(`\u00a0`) before `: ; ! ?`, inside « », between a number and its unit (`30\u00a0jours`,
`40\u00a0€`, `293\u00a0B`); in English, between a number and its unit (`30\u00a0days`); in
both, a narrow non-breaking space (`\u202f`) between the groups of the SIREN and the SIRET.
Nothing else differs from the source.

To change the terms, edit the Markdown source first, then the `.ts` file of the same
language: the test fails until both say the same thing.

## Components

| Component                  | Role                                                                                                                                                                                                                                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LegalLayoutComponent`     | The page on the document template: `PageHeaderComponent` (trail, `h1`, meta, identity), then `DocumentLayoutComponent` (summary on the left, sections on the right), then `PageNavComponent` towards the other legal page. Draws the rules between sections, and the frame of a run of emphasised sections. |
| `TocComponent`             | Shared with the posts. Client component (scroll spy). `desktop`: sticky 216 px column on the left, current entry in the accent with `aria-current="true"` (IntersectionObserver, `rootMargin: -20% 0px -70% 0px`). `mobile` (below 1024 px): a native `<details>` that folds after a choice.                |
| `NumberedSectionComponent` | Shared with the posts: the number as a mono eyebrow, `h2` in the `title` style, `#` link, body. `emphasis`: number in the text colour, 48 px of padding.                                                                                                                                                    |
| `LegalBlocksComponent`     | Paragraphs, lists (markers in `--muted`), `h3` subsections in the `subhead` style with their number in mono, the identity sheet and the processing list.                                                                                                                                                    |
| `KeyValueComponent`        | The identity of the business: the key / value sheet of the site, values that break anywhere.                                                                                                                                                                                                                |
| `ProcessingListComponent`  | The processing of personal data: name in bold, retention in mono `--muted`, then the text; one valid `<dl>`, one row each.                                                                                                                                                                                  |
| `LegalLinksComponent`      | "mentions légales · cgv" ("legal notice · terms") in every footer; the link of the current page is in the accent with `aria-current="page"`.                                                                                                                                                                |

Both summaries are hidden in print (`print-hidden`), and the print style is the day mode,
like the rest of the site.

## The PDFs of the terms

| File                        | Language | How it was made                                                                                                                                             |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/cgv/cgp-1.0.pdf`    | French   | Handed over with the brief: three A4 pages of HTML (the annex of a quote, from the design canvas, outside the repository) printed by Chromium. It prevails. |
| `public/cgv/cgp-1.0-en.pdf` | English  | `npm run cgv:pdf -- en` ([scripts/cgv-pdf.mjs](../../scripts/cgv-pdf.mjs)) from `cgv.en.md`, on 15 October 2026.                                            |

`npm run cgv:pdf -- <locale>` reproduces the look of the French PDF from a Markdown source:
A4, 20 mm margins, Geist and Geist Mono (from the `geist` package, embedded), a running
header (kicker, title, version and the articles of the page), the articles in two columns
at 8.5 pt, lists run into their paragraph, a subsection opening its first paragraph, a
"continue → page n" line and a footer with the page count. It paginates in the browser,
checks that nothing overflows, prints with a local Chrome (`CHROME_PATH` to override, like
`cv:pdf`), and refuses to replace an existing file. It needs no build. The page links each
PDF from `TERMS.pdf`.

A signed quote refers to one version of the terms, so a version is never replaced:

1. Write the new sources (`cgv.fr.md`, `cgv.en.md`) and update both `.ts` files and `TERMS`
   (version, date, PDF paths).
2. Add the new PDFs next to the old ones (`cgp-1.1.pdf`, `cgp-1.1-en.pdf`, the English one
   with `npm run cgv:pdf -- en`); keep the old ones online.
3. Bump `updatedAt` of `cgv` in `PAGES`, and tell lotus that the English text changed.

## Open items

- **E-invoicing platform** (`TODO(e-invoicing)`). The source of the legal notice says,
  in "Destinataires et transferts": "Les factures transitent par la plateforme de
  facturation électronique agréée [à compléter] et peuvent être transmises à
  l’administration fiscale, comme la loi l’exige." Valentin has not chosen the tool yet, so
  the sentence is withheld from the page in both languages: it stays as a code comment in
  `notice.fr.ts` and `notice.en.ts`, and the paragraph reads on without it. The tests
  compare the page with the source minus this sentence (`WITHHELD_FROM_NOTICE` in
  `tests/helpers/legal.ts`) and check it is not rendered. Once the platform is chosen: put
  the sentence back with its name in both languages, remove the constant and the guard,
  bump `updatedAt` of `legal`. Also tracked in the
  [runbook](../operations/runbook.md#known-issues).

## Decisions confirmed by Valentin

On 15 October 2026, after reviewing the pull request:

- **Article 5** stays "Obligations du **C**lient", as the source says ("Client" is the
  defined term), although the mockup and the PDF of the brief read "client". In English:
  "Client obligations".
- **The English legal notice** is approved as it was translated.
- **The terms in English**: a full translation replaces the French text on `/en/cgv/`, with
  its own PDF; the French version prevails.
- **The e-invoicing sentence** is withheld until the tool is chosen (above).

## Tests

- [tests/unit/legal-content.test.ts](../../tests/unit/legal-content.test.ts): in each
  language, the terms are their source, article by article and item by item (marks
  removed, non-breaking spaces read as spaces); the identity comes from the source; ids
  `art-01` to `art-20`, emphasis on 11 and 12 only; every internal link has its anchor and
  points to the legal notice of the same language. The English terms have the structure
  and links of the French ones, and their notice is in the source. The legal notice is the
  source outside the publisher's card, whose facts are checked one by one, and minus the
  withheld e-invoicing sentence, which is checked absent; the English notice has the same
  structure and links.
- [tests/e2e/legal.spec.ts](../../tests/e2e/legal.spec.ts): the rendered text against the
  source, the PDF, an anchor reached directly, internal links, the sticky summary and its
  current entry (desktop), the folded summary (phone), the English terms and their PDF,
  the withheld e-invoicing sentence, the footer on every page. Both pages also run through axe in both modes with every other page.
- Smoke tests: both pages in both languages, both PDFs and their links, the sitemap, the
  footer links, English text and notice on the English terms.

## The handoff

The brief, the texts and the mockups Valentin prepared are kept in
[docs/legal-handoff/](../legal-handoff/), as delivered (Prettier skips the folder):
`PROMPT.md` (the brief, in French), `content/*.md` (the source texts, read by the tests;
`cgv.en.md` was added afterwards, see above),
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

| Brief                                                                     | Done                                                                                                                     | Why                                                                                                                      |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Propose a plan and wait for approval                                      | Planned and built without waiting                                                                                        | Valentin delegated the whole job                                                                                         |
| Routes `/fr/cgv`, `/fr/legal#sec-05`                                      | `/fr/cgv/`, `/fr/legal/#sec-05`                                                                                          | Internal links carry a trailing slash                                                                                    |
| Title "… — valentinbourreau"                                              | "Conditions générales de prestation \| valentinbourreau"                                                                 | Every title of the site ends with "\| valentinbourreau"                                                                  |
| Body 1120 px wide, side margins 16 px on phones                           | The site's `container-page` (1040 px, `clamp(20px, 4vw, 48px)`)                                                          | The body stays aligned with the header and the footer; the article column is about 630 px wide at 1440 px instead of 700 |
| Trail `~/valentin-bourreau / cgv`                                         | The site's `BreadcrumbComponent`: `~/valentin-bourreau/cgv`                                                              | Same trail as the other pages                                                                                            |
| `#` link with `aria-label` "Lien vers l’article N", inside the H2         | Next to the H2, glyph `aria-hidden` and the label as visually hidden text                                                | The heading's name stays its title, and the repository asks for a visible text inside every `aria-label`                 |
| Footer links underlined                                                   | Not underlined, like the other footer links                                                                              | Consistency with the existing footers                                                                                    |
| Texts "mot pour mot", characters kept                                     | Word for word; non-breaking and narrow spaces added                                                                      | The source has no non-breaking space; the charter and the brief's own rules ask for them, and the mockups have them      |
| Article 5 "Obligations du client" (mockup, PDF)                           | "Obligations du Client" (source text)                                                                                    | The source text is the authority on words, and "Client" is the defined term. Confirmed by Valentin.                      |
| Legal notice order: "E-mail" after "Destinataires et transferts" (source) | "E-mail" is the last row of the processing list, before "Base légale" (mockup, brief's list)                             | The brief lists it among the processing rows                                                                             |
| Retention labels ("3 ans après le dernier échange"…)                      | Kept from the mockup, with non-breaking spaces (`3\u00a0ans`)                                                            | They are in the mockup, not in the source text                                                                           |
| Publisher lines (SIREN…, TVA, address, director, contact)                 | The identity card of the mockup                                                                                          | As specified; the test checks each fact against the source                                                               |
| Legal meta line                                                           | "dernière mise à jour le 15 octobre 2026", lowercase mono, from `PAGES.legal.updatedAt`                                  | Mockup                                                                                                                   |
| `/en/cgv`: the French text under an English notice                        | First done that way; replaced after review by a full English translation with its own PDF, the French version prevailing | Valentin's request on the pull request                                                                                   |
| `/en/legal`: translate the new passages                                   | Done; approved by Valentin                                                                                               |                                                                                                                          |
| "[à compléter]" placeholder shown in a box                                | First shown; then the whole sentence withheld until the platform is chosen                                               | Valentin's request on the pull request                                                                                   |
| Section anchor names on the legal page ("Lien vers la section éditeur")   | "Lien vers la section {title}" with the title as written                                                                 | One template for every section                                                                                           |
| Anchor of article 12.2 → `#art-12`                                        | `#art-12-2`, the subsection itself                                                                                       | The reader lands on the clause cited                                                                                     |
| `pnpm lint`, `pnpm build`                                                 | `npm run check`, `npm test`, `npm run build`, `npm run test:smoke`, `npm run test:e2e`                                   | npm is the repository's package manager                                                                                  |
| Lighthouse accessibility = 100                                            | axe (WCAG 2.2 A and AA) on both pages, both languages, both modes, desktop and 375 px                                    | Lighthouse is not part of the test suite; its accessibility audit is axe                                                 |
| Captures at 390 px                                                        | Compared at 375 px                                                                                                       | The repository's phone viewport                                                                                          |
