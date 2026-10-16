---
title: Components
description: Conventions for writing components and the building blocks of the Changelog design (avatar, breadcrumb, buttons, profile card, changelog entry, project card).
related_code:
  - ../../components/post-image/
  - ../../components/post-unlock-form/
  - ../../mdx-components.tsx
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
  - ../../components/key-value/key-value.tsx
  - ../../components/log-entry/log-entry.tsx
  - ../../components/offer-line/offer-line.tsx
  - ../../components/fact-grid/fact-grid.tsx
  - ../../components/heading/heading.tsx
  - ../../components/page-header/page-header.tsx
  - ../../components/page-nav/page-nav.tsx
  - ../../components/document-layout/document-layout.tsx
  - ../../components/admin/admin-header.tsx
  - ../../components/changelog-entry/changelog-entry.tsx
  - ../../components/project-card/project-card.tsx
  - ../../lib/models/content.ts
  - ../../lib/utils/cn.ts
  - ../../components/legal-layout/legal-layout.tsx
  - ../../components/toc/toc.tsx
  - ../../components/numbered-section/numbered-section.tsx
  - ../../components/legal-blocks/legal-blocks.tsx
  - ../../components/processing-list/processing-list.tsx
  - ../../components/rich-text/rich-text.tsx
  - ../../components/legal-links/legal-links.tsx
last_updated: 2026-10-16
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
  `ThemeToggleComponent`, `ThemeProvider`, `TocComponent` (scroll spy), and the error
  boundary.
- Conditional classes with `cn()` from [lib/utils/cn.ts](../../lib/utils/cn.ts).
- Content comes in as props typed by [lib/models/content.ts](../../lib/models/content.ts);
  components hold no text.
- Delete a component when its last usage goes away.

## Building blocks

| Component                                   | Role                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HeaderComponent`                           | Logotype `valentinbourreau`, then the mono nav and the theme button. It wraps on small screens: no hidden menu.                                                                                                                                                                                                                                             |
| `HeaderNavComponent`                        | `cv · projets · articles · contact`, and the `fr · en` link to the same page in the other language. The current page is in the accent colour with `aria-current`.                                                                                                                                                                                           |
| `ThemeToggleComponent`                      | 44 px square button, half-filled circle, forces the other mode.                                                                                                                                                                                                                                                                                             |
| `HeadingComponent`                          | Every heading: `level` (1 to 3) for the outline, `variant` (`display`, `display-compact`, `title`, `subhead`, `label`) for the look. See [styling.md](styling.md#headings).                                                                                                                                                                                 |
| `PageHeaderComponent`                       | The top of every page: trail, `h1`, lead, meta line, then the page's own blocks. `avatar` on the home page and the resume; `compact` on a post.                                                                                                                                                                                                             |
| `BreadcrumbComponent`                       | `~/valentin-bourreau`, then a `trail` of segments (`/articles/pensee`), the root and the parents linking back.                                                                                                                                                                                                                                              |
| `AvatarComponent`                           | The portrait, 88 px.                                                                                                                                                                                                                                                                                                                                        |
| `KeyValueComponent`                         | The key / value sheet of the charter (profile, stack, identity of the business, project sheet of a post): mono, on a surface block. A row with `live` shows the status dot; an optional footer under a rule.                                                                                                                                                |
| `StatusDotComponent`                        | 7 px accent dot.                                                                                                                                                                                                                                                                                                                                            |
| `SectionComponent`, `SectionTitleComponent` | A block of an index page, opened by a rule, and its `h2` in the `label` style.                                                                                                                                                                                                                                                                              |
| `LogEntryComponent`                         | One line of a dated list: a 160 px mono date column (accent when current), a `subhead` title at the level asked, then any content. The changelog and the lists of posts are made of it.                                                                                                                                                                     |
| `OfferLineComponent`                        | One service on one line of the home page: title, summary, starting price in mono.                                                                                                                                                                                                                                                                           |
| `FactGridComponent`                         | Short facts side by side in cells parted by 1 px rules on the surface colour: the duration and the prices of a service on the services page.                                                                                                                                                                                                                |
| `ChangelogEntryComponent`                   | A changelog entry on `LogEntryComponent`: roles, text, achievements and earlier positions.                                                                                                                                                                                                                                                                  |
| `AchievementListComponent`                  | List whose items open with a mono `+`.                                                                                                                                                                                                                                                                                                                      |
| `ProjectCardComponent`                      | Name and status, description, stack if any, and "lire l’article →" when a post is about the project.                                                                                                                                                                                                                                                        |
| `DocumentLayoutComponent`                   | The body of a document page: under a rule, `TocComponent` on the left (sticky, 216 px) and the text on the right (680 px at most); below 1024 px the summary folds into a `<details>` above the text.                                                                                                                                                       |
| `TocComponent`                              | The summary of a document (client, scroll spy): number and title per entry, current entry in the accent with `aria-current="true"`.                                                                                                                                                                                                                         |
| `NumberedSectionComponent`                  | A numbered section of a document: mono eyebrow (`01 · contexte`), `h2` in the `title` style, `#` link on hover when given a label. Used by the posts (`<Section>`) and the legal pages.                                                                                                                                                                     |
| `PageNavComponent`                          | End of a document page, under a rule: the next page to read, then a way back.                                                                                                                                                                                                                                                                               |
| `PostTagsComponent`                         | The tags of a post as mono chips.                                                                                                                                                                                                                                                                                                                           |
| `PostUnlockFormComponent`                   | The password form of a protected post (client): `fetch`, honeypot, time trap, toasts.                                                                                                                                                                                                                                                                       |
| `Post*` MDX components                      | `components/post-*/`: the fourteen components a post may use, registered in `mdx-components.tsx`. Props and examples in [posts.md](../features/posts.md#mdx-components). `PostImageComponent` draws a day/night pair without client code; `PostFigureComponent` is the shared `<figure>` and caption; `PostProjectSheetComponent` is a `KeyValueComponent`. |
| `SiteFooterComponent`                       | Closing line of every page: copyright, legal links, `cd ~/` (left out on the home page).                                                                                                                                                                                                                                                                    |
| `LegalLinksComponent`                       | "mentions légales · cgv" in the footer; `current` puts the link of the page being read in the accent with `aria-current="page"`.                                                                                                                                                                                                                            |
| `LegalLayoutComponent` and its parts        | The two legal pages, on the document template: `NumberedSectionComponent`, `LegalBlocksComponent`, `ProcessingListComponent`, `RichTextComponent`. See [legal-pages.md](../features/legal-pages.md#components).                                                                                                                                             |
| `AdminHeaderComponent`                      | Header of the admin pages: logotype, admin menu (demandes · fréquentation · design system), optional action.                                                                                                                                                                                                                                                |
| `JsonLdComponent`, `SkipLinkComponent`      | Structured data of a page; "skip to content" link.                                                                                                                                                                                                                                                                                                          |

Every component is shown on the design system page of the admin; a new one is added there
in the same change (see [design-system.md](design-system.md)).

## shadcn/ui

Configured in [components.json](../../components.json) (style `new-york`, Tailwind v4, CSS
variables). Files are flat, as the CLI writes them: `components/ui/button.tsx`.

| Component                    | Used for                                                                                                    | Changed from the original                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                     | every button and button-like link (`asChild`), the theme button                                             | 44 px high, 2 px radius, no shadow; variants `default` (filled, the main action) and `secondary` (outlined); sizes `default` and `icon` |
| `Card`                       | the profile sheet, the project cards, the "what I bring" cells, the project sheet and the callouts of posts | 1 px rule, 2 px radius, no shadow, padding set by the caller; `CardTitle` accepts `asChild` to be a real heading                        |
| `Badge`                      | the status of a project, the tags of a post (with a 1 px frame)                                             | a mono label with no pill; `default` is live (accent), `secondary` is archived (muted)                                                  |
| `Separator`                  | the rule that opens each section and the footers                                                            | colour only                                                                                                                             |
| `Breadcrumb`                 | the path next to the portrait                                                                               | mono, set tight, a slash as separator instead of a chevron icon                                                                         |
| `Dialog`                     | the contact dialog                                                                                          | no shadow, no blur, no entrance animation; the close control is a word in mono (`closeLabel`)                                           |
| `Sonner`                     | every error and confirmation toast                                                                          | surface block, no icon, no shadow                                                                                                       |
| `Input`, `Textarea`, `Label` | the fields of the contact form and of the password form                                                     | 44 px high, 1 px rule; labels in mono                                                                                                   |
| `RadioGroup`                 | the choices of the contact form                                                                             | the checked mark is the accent dot                                                                                                      |
| `Table`                      | the leads of the admin, the decision tables of posts                                                        | mono header on the surface colour                                                                                                       |
| `Chart`                      | the charts of the admin (Recharts)                                                                          | no shadow; kept close to the original, with relaxed lint rules for this file                                                            |

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
- **The summary of the legal pages** is a native `<details>` on phones, not `Accordion`,
  and a list of anchors on wide screens, not `NavigationMenu`: the browser already folds
  and unfolds, and only the scroll spy needs client code.
- **Numbered sections, the processing list and inline marks of legal texts** have no
  shadcn equivalent; the identity card is the shadcn `Card`.

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
