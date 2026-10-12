---
title: Components
description: Conventions for writing components and the building blocks of the Changelog design (avatar, breadcrumb, buttons, profile card, changelog entry, project card).
related_code:
  - ../../components/
  - ../../components/header/header.tsx
  - ../../components/header/header-nav.tsx
  - ../../components/site-footer/site-footer.tsx
  - ../../components/ui/button.tsx
  - ../../components/ui/card.tsx
  - ../../components/ui/badge.tsx
  - ../../components/ui/separator.tsx
  - ../../components/ui/breadcrumb.tsx
  - ../../components.json
  - ../../components/profile-card/profile-card.tsx
  - ../../components/changelog-entry/changelog-entry.tsx
  - ../../components/project-card/project-card.tsx
  - ../../lib/models/content.ts
  - ../../lib/utils/cn.ts
last_updated: 2026-10-12
---

# Components

**Summary.** Components are Server Components by default, one folder each under
[components/](../../components/). Interface elements come from
[shadcn/ui](https://ui.shadcn.com) first: its source is copied into
[components/ui/](../../components/ui/) and restyled there to follow the design charter.
The blocks of the design (profile sheet, project card, changelog entry…) are built on top.

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
| `ProfileCardComponent`                      | Key / value sheet in mono on a surface block. A row with `live` shows the status dot.                                                                  |
| `StatusDotComponent`                        | 7 px accent dot.                                                                                                                                       |
| `SectionComponent`, `SectionTitleComponent` | A block opened by a rule, and its mono title.                                                                                                          |
| `ChangelogEntryComponent`                   | Date column, then title, company, optional roles, text, achievements and earlier positions.                                                            |
| `AchievementListComponent`                  | List whose items open with a mono `+`.                                                                                                                 |
| `ProjectCardComponent`                      | Name and status, description, stack if any.                                                                                                            |
| `SiteFooterComponent`                       | Closing line of inner pages: copyright, legal link, `cd ~/`. The home page has its own footer, the contact section.                                    |
| `JsonLdComponent`, `SkipLinkComponent`      | Structured data of a page; "skip to content" link.                                                                                                     |

## shadcn/ui

Configured in [components.json](../../components.json) (style `new-york`, Tailwind v4, CSS
variables). Files are flat, as the CLI writes them: `components/ui/button.tsx`.

| Component                    | Used for                                                        | Changed from the original                                                                                                               |
| ---------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                     | every button and button-like link (`asChild`), the theme button | 44 px high, 2 px radius, no shadow; variants `default` (filled, the main action) and `secondary` (outlined); sizes `default` and `icon` |
| `Card`                       | the profile sheet, the project cards, the "what I bring" cells  | 1 px rule, 2 px radius, no shadow, padding set by the caller; `CardTitle` accepts `asChild` to be a real heading                        |
| `Badge`                      | the status of a project                                         | a mono label with no pill; `default` is live (accent), `secondary` is archived (muted)                                                  |
| `Separator`                  | the rule that opens each section and the footers                | colour only                                                                                                                             |
| `Breadcrumb`                 | the path next to the portrait                                   | mono, set tight, a slash as separator instead of a chevron icon                                                                         |
| `Dialog`                     | the contact dialog                                              | no shadow, no blur, no entrance animation; the close control is a word in mono (`closeLabel`)                                           |
| `Sonner`                     | every error and confirmation toast                              | surface block, no icon, no shadow                                                                                                       |
| `Input`, `Textarea`, `Label` | the fields of the contact form                                  | 44 px high, 1 px rule; labels in mono                                                                                                   |
| `RadioGroup`                 | the choices of the contact form                                 | the checked mark is the accent dot                                                                                                      |
| `Table`                      | the leads of the admin                                          | mono header on the surface colour                                                                                                       |
| `Chart`                      | the charts of the admin (Recharts)                              | no shadow; kept close to the original, with relaxed lint rules for this file                                                            |

Adding one: `npx shadcn@latest add <component>`, then restyle it in its file: remove
shadows, use `rounded`, check the colours in both modes
([styling.md](styling.md#shadcn-theme)). The CLI imports `cn` from the `cn` package; this
repository imports it from `@/lib/utils/cn`, which re-exports it.

Not shadcn, on purpose:

- **The portrait** uses `next/image`. shadcn `Avatar` renders a plain `<img>` once loaded
  on the client, which would lose image optimisation and delay the largest paint.
- **The header nav** is a list of links. `NavigationMenu` ships client code that a static
  menu does not need; it was removed for that reason after the October 2026 audit.
- **Changelog entries, achievement lists, dated lists** have no shadcn equivalent: they
  are semantic lists (`<ol>`, `<ul>`, `<dl>`).
- **The status select of the admin** is a native `<select>`: three fixed choices do not
  need a custom listbox.

The CLI overwrites files it depends on: adding `chart` rewrote `card.tsx`. After every
`add`, check `git status` and restore what was restyled.

## Links and buttons

- A button-like link is `<Button asChild><Link …/></Button>` (or `<a>`). There is one
  primary button per page.
- Internal links carry the locale and a trailing slash.
- External links open in a new tab with `rel="noopener noreferrer"`.
- Social links are words (`github`, `linkedin`…), not icons.

## Accessibility

- Every link and button has a name; when an `aria-label` is set, it contains the visible
  text.
- `SkipLinkComponent` is the first element of the page and jumps to `<main id="main">`.
- Lists are real lists. Decorative glyphs (`●`, `+`) are `aria-hidden`.
- Lighthouse accessibility was 100 on the home page and the resume on 2026-10-11.
