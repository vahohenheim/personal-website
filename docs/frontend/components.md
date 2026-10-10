---
title: Components
description: Conventions for writing components and the building blocks of the Changelog design (avatar, breadcrumb, buttons, profile card, changelog entry, project card).
related_code:
  - ../../components/
  - ../../components/header/header.tsx
  - ../../components/header/header-nav.tsx
  - ../../components/site-footer/site-footer.tsx
  - ../../components/ui/button/button.ts
  - ../../components/profile-card/profile-card.tsx
  - ../../components/changelog-entry/changelog-entry.tsx
  - ../../components/project-card/project-card.tsx
  - ../../lib/models/content.ts
  - ../../lib/utils/cn.ts
last_updated: 2026-10-11
---

# Components

**Summary.** Components are Server Components by default, one folder each under
[components/](../../components/). They are few and plain: the design is made of text,
rules and a handful of blocks defined by the design charter. There is no component
library any more: shadcn/ui, Radix and the icon packages were removed with the redesign.

## Conventions

- One folder per component, in kebab-case: `components/<name>/<name>.tsx`.
- Default export, named `<Name>Component`.
- `"use client"` only for what needs the browser: `HeaderNavComponent` (current path),
  `ThemeToggleComponent`, `ThemeProvider`, and the error boundary.
- Conditional classes with `cn()` from [lib/utils/cn.ts](../../lib/utils/cn.ts).
- Content comes in as props typed by [lib/models/content.ts](../../lib/models/content.ts);
  components hold no text.
- Delete a component when its last usage goes away.

## Building blocks

| Component                                   | Role                                                                                                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `HeaderComponent`                           | Logotype `valentinbourreau`, then the mono nav and the theme button. It wraps on small screens: no hidden menu.                                        |
| `HeaderNavComponent`                        | `cv · projets · contact`, and the `fr · en` link to the same page in the other language. The current page is in the accent colour with `aria-current`. |
| `ThemeToggleComponent`                      | 44 px square button, half-filled circle, forces the other mode.                                                                                        |
| `AvatarComponent`                           | The portrait, 88 px.                                                                                                                                   |
| `BreadcrumbComponent`                       | `~/valentin-bourreau`, or `~/valentin-bourreau/<page>` with the root linking home.                                                                     |
| `buttonClass(variant)`                      | Classes of a button, `primary` or `secondary`, applied to a link or a `<button>`.                                                                      |
| `ProfileCardComponent`                      | Key / value sheet in mono on a surface block. A row with `live` shows the status dot.                                                                  |
| `StatusDotComponent`                        | 7 px accent dot.                                                                                                                                       |
| `SectionComponent`, `SectionTitleComponent` | A block opened by a rule, and its mono title.                                                                                                          |
| `ChangelogEntryComponent`                   | Date column, then title, company, optional roles, text, achievements and earlier positions.                                                            |
| `AchievementListComponent`                  | List whose items open with a mono `+`.                                                                                                                 |
| `ProjectCardComponent`                      | Name and status, description, stack.                                                                                                                   |
| `SiteFooterComponent`                       | Closing line of inner pages: copyright, legal link, `cd ~/`. The home page has its own footer, the contact section.                                    |
| `JsonLdComponent`, `SkipLinkComponent`      | Structured data of a page; "skip to content" link.                                                                                                     |

## Links and buttons

- A button is a link styled with `buttonClass`. There is one primary button per page.
- Internal links carry the locale and a trailing slash.
- External links open in a new tab with `rel="noopener noreferrer"`.
- Social links are words (`github`, `linkedin`…), not icons.

## Accessibility

- Every link and button has a name; when an `aria-label` is set, it contains the visible
  text.
- `SkipLinkComponent` is the first element of the page and jumps to `<main id="main">`.
- Lists are real lists. Decorative glyphs (`●`, `+`) are `aria-hidden`.
- Lighthouse accessibility was 100 on the home page and the resume on 2026-10-11.
