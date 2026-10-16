---
title: Styling
description: The Eucalyptus tokens, the Tailwind theme built on them, light and dark mode, Geist and Geist Mono, the type scale, and the global rules (radius, rules, links, focus, motion).
related_code:
  - ../../app/globals.css
  - ../../app/[locale]/layout.tsx
  - ../../components/theme-provider/theme-provider.tsx
  - ../../components/theme-toggle/theme-toggle.tsx
  - ../../components/avatar/avatar.tsx
  - ../../public/avatar.jpg
  - ../redesign/charte-graphique-valentinbourreau.md
  - ../../components/heading/heading.tsx
  - ../../components/page-header/page-header.tsx
  - ../../components/document-layout/document-layout.tsx
  - ../../tests/unit/type-scale.test.ts
last_updated: 2026-10-16
---

# Styling

**Summary.** The look of the site follows the design charter
([charte-graphique-valentinbourreau.md](../redesign/charte-graphique-valentinbourreau.md)),
"Changelog" direction: one palette (Eucalyptus) in two modes, one type family (Geist, with
Geist Mono for structure), one radius, no shadow, no gradient, no emoji. Everything is
declared in [app/globals.css](../../app/globals.css); there is no `tailwind.config.ts`.
The charter wins over this page if they ever disagree.

## Tokens

Eight variables, set on `:root` (day) and `.dark` (night), exposed to Tailwind under the
same names. The default Tailwind palette, radii and shadows are removed from the theme, so
no other colour can be used by accident.

| Token         | Class examples             | Use                                                                   |
| ------------- | -------------------------- | --------------------------------------------------------------------- |
| `--bg`        | `bg-bg`                    | page background                                                       |
| `--surface`   | `bg-surface`               | blocks, key / value sheets                                            |
| `--line`      | `border-line`              | 1 px rules and borders                                                |
| `--muted`     | `text-muted`               | dates, labels, section titles                                         |
| `--text2`     | `text-text2`               | running text                                                          |
| `--text`      | `text-text`                | titles, strong text, logotype                                         |
| `--accent`    | `text-accent`, `bg-accent` | what is live: current status, ongoing work, main action, hover, focus |
| `--on-accent` | `text-on-accent`           | text placed on the accent                                             |

The accent is never used for running text or decoration. All text tokens reach a contrast
of at least 4.5:1 on the backgrounds they are used on (measured on 2026-10-11).

## shadcn theme

The semantic names shadcn/ui components use are declared in the same `@theme` block and
point to the eight tokens, so a component added with the CLI is in the charter's colours
without retouching.

| shadcn name                                                                   | Token                             |
| ----------------------------------------------------------------------------- | --------------------------------- |
| `background`, `card`, `popover`                                               | `--bg`                            |
| `foreground`, `card-foreground`, `popover-foreground`, `secondary-foreground` | `--text`                          |
| `primary`, `ring`                                                             | `--accent`                        |
| `primary-foreground`, `accent-foreground`                                     | `--on-accent`                     |
| `secondary`                                                                   | `--surface`                       |
| `muted-foreground`                                                            | `--muted`                         |
| `border`, `input`                                                             | `--line`                          |
| `destructive`                                                                 | `--text` (the charter has no red) |

Two names keep the charter's meaning, not shadcn's: `muted` is the meta text colour and
`accent` the accent colour, where shadcn expects two background tints. A generated
component that uses `bg-muted` or `hover:bg-accent` must be adjusted (`bg-surface`, or a
colour change on hover). The radius scale (`rounded-sm` to `rounded-xl`) is 2 px at every
step, and no shadow utility exists.

## Global rules

- **Radius:** `rounded` is 2 px. `rounded-photo` (6 px) is for the portrait only,
  `rounded-full` for the status dot only.
- **Rules:** 1 px in `--line`.
- **Links:** `--text`, underlined in `--line` with a 3 px offset, `--accent` on hover.
  Add `no-underline` where the charter shows none (logotype, nav, buttons, breadcrumb).
- **Focus:** a 2 px `--accent` outline, offset by 3 px, on every focusable element.
- **Selection:** `--accent` background, `--on-accent` text.
- **Motion:** colour transitions of 150 ms at most, removed under
  `prefers-reduced-motion`. No entrance animation: nothing starts at `opacity: 0`. One
  exception, which is not an entrance: the `#` link next to the titles of the legal pages
  is transparent until its title is hovered or the link is focused.
- **Layout:** `container-page` gives the 1040 px container with its fluid side padding.
- **Anchors:** `html` has `scroll-padding-top: 24px`, so a title reached by its anchor
  (`#art-12`, `#sec-05`, a section of a post) is not stuck to the top edge.

## Light and dark mode

`next-themes` sets the `dark` class on `<html>` (`attribute="class"`, system preference by
default) from a script that runs before paint, so there is no flash.
[ThemeToggleComponent](../../components/theme-toggle/theme-toggle.tsx) is the square
button of the header: one click forces the mode opposite to the one displayed.

The `.dark` and `.light` classes also work on any element: they set the eight tokens for
its subtree, whatever the mode of the page. The design system page of the admin uses them
to show each component in both modes side by side.

## Fonts

Geist and Geist Mono come from the `geist` package (`geist/font/sans`, `geist/font/mono`),
loaded in the [root layout](../../app/[locale]/layout.tsx) and exposed as `font-sans` and
`font-mono`. They are self-hosted, which the CSP requires.

- **Geist:** everything that is read (titles, texts, buttons).
- **Geist Mono:** everything that is scanned (breadcrumb, section titles, dates, labels,
  key / value sheets, statuses, footer links), always in lowercase.

## Type scale

Nine screen styles, declared once as `@utility type-*` in
[globals.css](../../app/globals.css), each carrying size, line height, weight and tracking
(colour stays a separate utility). Nothing else sets a font size: no `text-[19px]`, no
`text-[clamp(…)]`, no `text-sm`. A unit test
([type-scale.test.ts](../../tests/unit/type-scale.test.ts)) fails on any of them, except in
the print sheet of the resume (sizes in points) and the sharing images drawn by `next/og`.
A size relative to its parent (`text-[0.85em]`, inline code) is allowed.

| Style                  | Size                       | Weight | Line height | Tracking | Use                                                             |
| ---------------------- | -------------------------- | ------ | ----------- | -------- | --------------------------------------------------------------- |
| `type-display`         | `clamp(40px, 5.6vw, 64px)` | 600    | 1.02        | −0.04em  | The `h1`, once per page, every page                             |
| `type-display-compact` | `clamp(34px, 4.4vw, 52px)` | 600    | 1.06        | −0.035em | The same `h1`, one step down, for the long titles of posts      |
| `type-title`           | `clamp(24px, 2.6vw, 28px)` | 600    | 1.2         | −0.02em  | `h2` of a document (post, terms, legal notice), dialog title    |
| `type-subhead`         | 20 px                      | 600    | 1.3         | −0.01em  | Every `h3`; title of an entry, a card, a list of posts          |
| `type-quote`           | `clamp(22px, 2.4vw, 26px)` | 500    | 1.3         | −0.02em  | Pull quote                                                      |
| `type-lead`            | `clamp(18px, 1.6vw, 19px)` | 400    | 1.5         | 0        | Lead under the `h1`, in `text2`                                 |
| `type-body`            | 16 px                      | 400    | 1.6         | 0        | Running text (the default of `body`)                            |
| `type-small`           | 15 px                      | —      | 1.45        | 0        | Summary, buttons, fields, table cells, captions                 |
| `type-label`           | mono 13 px                 | —      | 1.5         | 0        | Trail, menu, eyebrows, `h2` of index pages (with `font-medium`) |
| `type-meta`            | mono 12 px, tabular        | 400    | 1.5         | 0        | Dates, durations, small print, footer                           |

The logotype has its own utility, `logotype` (Geist Bold 18 px): it is a mark, not a
level of text.

### Headings

`HeadingComponent` ([components/heading/](../../components/heading/heading.tsx)) sets the
level and the style apart: the level follows the outline of the page, the style follows
the role.

- One `h1` per page, always `display` (`display-compact` on a post), right under the
  trail: home, resume, posts, post, legal notice, terms, 404, error, protected post, admin.
- **Index pages** (home, resume, posts, admin): `h2` in the `label` style, the content in
  lists opened by rules. The list of posts has its titles as `h2` in the `subhead` style.
- **Document pages** (post, terms, legal notice, design system): `h2` in the `title`
  style, under a mono eyebrow (`01 · contexte`, `12`), with a `#` link on hover.
- Every `h3` is in the `subhead` style. There is no `h4`: one more level becomes a `+`
  list, or a paragraph that opens in bold.

## Page templates

Every page is made of the same pieces, in the same order:

1. `HeaderComponent` (or the admin header).
2. `PageHeaderComponent`: trail, `h1`, lead, mono meta line, then the page's own blocks
   (key / value sheet, tags, buttons). Same padding everywhere. The portrait sits beside
   the trail on the home page and the resume only, as on the paper resume.
3. The body, on one of two templates:
   - **index**: `SectionComponent` blocks, each opened by a rule and an `h2` label;
   - **document**: `DocumentLayoutComponent`, the summary on the **left** in a sticky
     column of 216 px and the text on the right (680 px at most); below 1024 px the
     summary folds into a `<details>` above the text. Then `PageNavComponent` (next post,
     or the other legal page).
4. `SiteFooterComponent`, on every page, the home page included.

The design system page of the admin (`/admin/design-system/`) shows all of it: see
[design-system.md](design-system.md).

## Typography of texts

- Typographic apostrophes (`’`), never `'`.
- In French, a non-breaking space before `: ; ! ?` and between a number and its unit. It
  is written ` ` in the locale files so that it stays visible in the source.
- An en dash in ranges (`2016–2018`), an arrow in changelog dates (`2024.10 → 2026.10`).
- Real lists (`<ul>`, `<ol>`, `<dl>`), never bullets typed by hand.
- No emoji. Glyphs replace icons: `●` live, `○` archived, `→` link or period, `+` item of
  an achievement list, `~/` start of the breadcrumb.

## Portrait

[public/avatar.jpg](../../public/avatar.jpg) is a 480 px square JPEG, displayed at 88 px
with a 6 px radius by [AvatarComponent](../../components/avatar/avatar.tsx), preloaded
because it is above the fold. It is a human marker, never a cover image: do not show it
larger. To change it, replace the file with another square image.

## Print

Two sets of rules in [globals.css](../../app/globals.css):

- `@media print` switches any page to day mode and hides the navigation, the buttons and
  anything marked `print-hidden` (the summaries of the legal pages).
- `.resume-sheet` lays out the one-page A4 resume, in mm and pt, always in day mode. See
  [resume-pdf.md](../features/resume-pdf.md).
