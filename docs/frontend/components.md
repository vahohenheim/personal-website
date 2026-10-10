---
title: Components
description: Conventions for writing components, how shadcn/ui is used, how icons are registered, and the rules for links and buttons.
related_code:
  - ../../components/
  - ../../components/ui/
  - ../../components/icons/
  - ../../components/company-icon/company-icon.tsx
  - ../../components/social-network/social-network.tsx
  - ../../components/section/section.tsx
  - ../../components/appear/appear.tsx
  - ../../components/cover/cover.tsx
  - ../../components/wordmark/wordmark.tsx
  - ../../components/header/header.tsx
  - ../../components/personal-project/personal-project.tsx
  - ../../components.json
  - ../../lib/utils/cn.ts
last_updated: 2026-10-10
---

# Components

**Summary.** Components are Server Components by default, one folder each, shared ones in
[components/](../../components/) and page-specific ones next to their page. Simple
interface elements come from [shadcn/ui](https://ui.shadcn.com), whose source is copied
into [components/ui/](../../components/ui/). Only what is used is kept.

## Conventions

- One folder per component, in kebab-case: `components/<name>/<name>.tsx`. Separately typed
  props go in `<name>.model.ts`, constants in `<name>.constants.ts`.
- Default export, named `<Name>Component`.
- A component used by a single page lives in that page's `_components/` private folder. A
  shared component lives in the root `components/`.
- `"use client"` only for interactivity: `LanguageToggle`, `ModeToggle`, `ThemeProvider`.
- Conditional classes with `cn()` from [lib/utils/cn.ts](../../lib/utils/cn.ts).
- Delete a component when its last usage goes away.

## Building blocks

| Component                            | Role                                                                                                           |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `SectionComponent`                   | Content width of the site (900 px) and optional section title                                                  |
| `AppearComponent`                    | Entrance animation in CSS: on load by default, on scroll with `onScroll` ([styling.md](styling.md#animations)) |
| `CoverComponent`                     | Hero of both pages: portrait, name, title, summary, action, social links                                       |
| `HeaderComponent`, `FooterComponent` | Rendered by the root layout, never animated                                                                    |
| `WordmarkComponent`                  | The site signature in the header: the name with a contrast of weights, initials under 640 px                   |
| `JsonLdComponent`                    | Structured data of a page ([seo.md](../features/seo.md))                                                       |

## shadcn/ui

- Style `new-york`, configured in [components.json](../../components.json).
- Installed today: `badge`, `button`, `dropdown-menu`, `navigation-menu`. `heading` and
  `mode-toggle` in the same folder are custom.
- Add one with `npx shadcn@latest add <component>`. Here each component sits in its own
  folder (`components/ui/button/button.tsx`): move the generated file and import from
  `@/components/ui/button/button`.
- Do not keep unused ones: each pins a Radix dependency.

## Links and buttons

- A link that looks like a button: `<Button asChild><Link href="…">…</Link></Button>`.
- A navigation link: `<NavigationMenuLink asChild><Link … /></NavigationMenuLink>`.
- Never nest a `<button>` or an `<a>` inside a `<Link>`.
- Internal links carry the locale and a trailing slash ([i18n.md](../architecture/i18n.md)).
- External links open in a new tab with `rel="noopener noreferrer"`.

## Icons

SVGs are React components in [components/icons/](../../components/icons/), with `IconProps`
(`width`, `height`, `className`). Colour comes from `className` (`fill-…` or `stroke-…`).

- **Company logos** are registered in `COMPANY_ICONS` in
  [company-icon.tsx](../../components/company-icon/company-icon.tsx), a
  `Record<CompanyId, …>`: a company without a logo fails the type check.
- **Social networks** are registered the same way in `SOCIAL_NETWORK_ICONS` in
  [social-network.tsx](../../components/social-network/social-network.tsx).
- **Personal projects** get a `lucide-react` icon through `PROJECT_ICONS` in
  `personal-project.tsx`.
- Generic icons come from `lucide-react`. Do not use emoji as icons: they render differently
  on every platform and cannot follow the theme.

## Lists

Use a stable `key` taken from the data (`company.id`, `mission.id`), never the array index.
