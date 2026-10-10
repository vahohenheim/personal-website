---
title: Styling
description: Tailwind v4 theme in globals.css, colour tokens, light and dark mode, fonts, animations, text typography and the portrait.
related_code:
  - ../../app/globals.css
  - ../../app/[locale]/layout.tsx
  - ../../components/theme-provider/theme-provider.tsx
  - ../../components/ui/mode-toggle/mode-toggle.tsx
  - ../../postcss.config.mjs
  - ../../public/avatar.jpg
  - ../../components/appear/appear.tsx
  - ../../components/wordmark/wordmark.tsx
  - ../../lib/constants/site.ts
last_updated: 2026-10-10
---

# Styling

**Summary.** The site is styled with Tailwind CSS v4, configured entirely in
[app/globals.css](../../app/globals.css): there is no `tailwind.config.ts`. Colours are
CSS variables with a light and a dark value, switched by a class on `<html>`.

## Theme

- `@theme inline` in `globals.css` exposes the shadcn tokens to Tailwind (`--color-background`,
  `--color-primary`, `--radius-*`…). Their values are set in `:root` (light) and `.dark`.
- Use the tokens in classes: `bg-background`, `text-foreground`, `text-muted-foreground`,
  `border-border`.
- Use tokens only. Tailwind palette colours (`gray-*`, `slate-*`…) are not used anywhere:
  mixing them with the tokens gave two families of grey. `muted` is the soft background,
  `muted-foreground` the secondary text, `accent` the hover background.
- Headings `h1` to `h4` get their size from `globals.css`. `.container-mobile` adds the
  side padding under 900 px.

## Light and dark mode

`next-themes` sets the `dark` class on `<html>` (`attribute="class"`, system preference by
default). [ModeToggle](../../components/ui/mode-toggle/mode-toggle.tsx) lets the visitor
choose light, dark or system. The `dark` variant is declared in `globals.css` with
`@custom-variant dark`.

## Font

Geist, loaded with `next/font/google` in the
[root layout](../../app/[locale]/layout.tsx) and exposed to Tailwind as `font-sans`. The
font files are self-hosted, which the CSP requires
([security.md](../architecture/security.md)).

Geist is Valentin's choice. A design audit flagged it as the Next.js default and a
serif-and-grotesque pairing was tried on 2026-10-10; he rejected it. Do not change the
font without asking him.

The wordmark in the header is the name in Geist with a contrast of weights (first name
bold, surname light) and a space between the two
([WordmarkComponent](../../components/wordmark/wordmark.tsx)). Under 640 px it is shortened
to the initials.

## Animations

Entrance animations are CSS only (`.appear` and `.appear-on-scroll` in `globals.css`,
applied by [AppearComponent](../../components/appear/appear.tsx)).

- The content is in the HTML and visible without JavaScript. An earlier version hid it
  until a script ran, which left the top of the page blank for seconds.
- Above the fold: a 0.4 s fade, with a stagger of at most 0.2 s. Keep delays short.
- Below the fold: `onScroll` reveals a block as it enters the viewport, with CSS
  scroll-driven animations. Browsers without them show the block as is.
- Nothing moves under `prefers-reduced-motion`.
- The header and the footer are never animated.

## Typography of texts

- Typographic apostrophes (`’`) in every visible text, in both languages.
- An en dash between two dates: "June 2021 – September 2024".
- No emoji in the interface or the texts. Icons come from `lucide-react`; language choices
  are shown as codes (`EN`, `FR`), not flags.

## Portrait

[public/avatar.jpg](../../public/avatar.jpg) is a 480 × 480 px JPEG (about 44 KB), cropped
square on the face. It is displayed at 120 px by `next/image`, which serves an optimised
version of a few kilobytes, and it loads eagerly with a high fetch priority because it is
the largest element of the hero.

To change it, replace the file with another square image. If the size changes, update
`AVATAR_SIZE` in [site.ts](../../lib/constants/site.ts): it is used by the Open Graph tags
and the structured data.

## Class order

Prettier sorts Tailwind classes with `prettier-plugin-tailwindcss`, including inside
`cn()`, `clsx()` and `cva()` ([code-quality.md](../development/code-quality.md)).
