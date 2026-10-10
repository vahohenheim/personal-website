---
title: Styling
description: Tailwind v4 theme in globals.css, light and dark mode, the Geist font, the portrait, and how formatting sorts classes.
related_code:
  - ../../app/globals.css
  - ../../app/[locale]/layout.tsx
  - ../../components/theme-provider/theme-provider.tsx
  - ../../components/ui/mode-toggle/mode-toggle.tsx
  - ../../postcss.config.mjs
  - ../../public/avatar.jpg
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
- A hardcoded colour (`bg-gray-100`) needs its `dark:` counterpart.
- Headings `h1` to `h4` get their size from `globals.css`. `.container-mobile` adds the
  side padding under 900 px.

## Light and dark mode

`next-themes` sets the `dark` class on `<html>` (`attribute="class"`, system preference by
default). [ModeToggle](../../components/ui/mode-toggle/mode-toggle.tsx) lets the visitor
choose light, dark or system. The `dark` variant is declared in `globals.css` with
`@custom-variant dark`.

## Font

Geist, loaded with `next/font/google` in the
[root layout](../../app/[locale]/layout.tsx) and exposed as `--font-geist-sans`. The font
files are self-hosted, which the CSP requires ([security.md](../architecture/security.md)).

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

## Leftovers

`globals.css` still carries unused shadcn tokens (`--sidebar-*`, `--chart-*`) and unused
helper classes (`fade-bottom`, `bg-gradient-radial`, `max-w-container`, `animate-appear*`).
