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
last_updated: 2026-10-11
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

## Global rules

- **Radius:** `rounded` is 2 px. `rounded-photo` (6 px) is for the portrait only,
  `rounded-full` for the status dot only.
- **Rules:** 1 px in `--line`.
- **Links:** `--text`, underlined in `--line` with a 3 px offset, `--accent` on hover.
  Add `no-underline` where the charter shows none (logotype, nav, buttons, breadcrumb).
- **Focus:** a 2 px `--accent` outline, offset by 3 px, on every focusable element.
- **Selection:** `--accent` background, `--on-accent` text.
- **Motion:** colour transitions of 150 ms at most, removed under
  `prefers-reduced-motion`. No entrance animation: nothing starts at `opacity: 0`.
- **Layout:** `container-page` gives the 1040 px container with its fluid side padding.

## Light and dark mode

`next-themes` sets the `dark` class on `<html>` (`attribute="class"`, system preference by
default) from a script that runs before paint, so there is no flash.
[ThemeToggleComponent](../../components/theme-toggle/theme-toggle.tsx) is the square
button of the header: one click forces the mode opposite to the one displayed.

## Fonts

Geist and Geist Mono come from the `geist` package (`geist/font/sans`, `geist/font/mono`),
loaded in the [root layout](../../app/[locale]/layout.tsx) and exposed as `font-sans` and
`font-mono`. They are self-hosted, which the CSP requires.

- **Geist:** everything that is read (titles, texts, buttons).
- **Geist Mono:** everything that is scanned (breadcrumb, section titles, dates, labels,
  key / value sheets, statuses, footer links), always in lowercase.

| Level      | Size                                          | Weight     | Line height | Tracking |
| ---------- | --------------------------------------------- | ---------- | ----------- | -------- |
| Page title | `clamp(40px, 6.4vw, 76px)` (resume: 38 to 64) | 600        | 1           | −0.04em  |
| Pull quote | `clamp(22px, 2.3vw, 28px)`                    | 500        | 1.35        | −0.02em  |
| Subtitle   | 19 to 21 px                                   | 600        | 1.3         | −0.01em  |
| Lead       | 18 to 21 px                                   | 400        | 1.5         | 0        |
| Text       | 15 to 16 px                                   | 400        | 1.6         | 0        |
| Mono       | 12 to 13 px                                   | 400 to 500 | 1.6         | 0        |

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
