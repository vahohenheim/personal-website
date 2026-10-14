# Project articles: content kit

This branch (`content/articles`) adds three long-form articles about Valentin's projects,
as content only: MDX bodies and images. No code, no registry entry yet. The components the
MDX uses are **not implemented**: implementing them, the registry entries, the richer post
header, the home block and the structured data is the job of the follow-up session (see
the brief published with this branch).

> The texts are drafts prepared with Valentin on 2026-10-13/14. Rule of the repository:
> nothing is published under his name that he did not write. Every entry is added with
> `draft: true`; Valentin removes it after his own read.

## Posts

| Slug     | Title (fr)                                                    | Dates      | Images                 |
| -------- | ------------------------------------------------------------- | ---------- | ---------------------- |
| `pensee` | pensee, un carnet hors ligne qui prend du recul               | 2026-10-13 | `public/posts/pensee/` |
| `lotus`  | lotus, l’app qui gère ma micro-entreprise                     | 2026-10-14 | `public/posts/lotus/`  |
| `brut`   | BRUT, le site d’un camion qui change d’adresse chaque semaine | 2026-10-14 | `public/posts/brut/`   |

French only for now. Suggested descriptions (under 155 characters) and leads are in the
brief. All data in the screenshots is fictional (demo seeds, invented notes, example.com).

## Images

- WebP, rendered at 2x. Files ending in `-jour.webp` / `-nuit.webp` come in pairs: one for
  the light theme, one for the dark theme.
- In MDX, a `src` **without extension** names a pair (`/posts/pensee/ecran-notes` →
  `ecran-notes-jour.webp` and `ecran-notes-nuit.webp`); the component shows the one that
  matches the active theme (both rendered, one hidden by CSS with the `dark:` variant (`.dark` class from next-themes), so no
  flash and no client JS). A `src` **with extension** is a single image, shown in both
  themes (BRUT screenshots: the site has one look).
- All images are same-origin, which the CSP (`img-src 'self'`) already allows.

## Components used by the MDX

All are server components, styled with the charter tokens only (one accent, radius 2 px,
no shadow, French typography). Props are exactly those below.

| Component         | Props                                                           | Renders                                                                                                                                                                                    |
| ----------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<Screens>`       | `caption`, `variant?: "hero"`; children: `<Screen>`             | A row of phone screens (390×844 ratio), wrapping on small screens, with a caption.                                                                                                         |
| `<Screen>`        | `src`, `alt`, `mode?: "nuit"`                                   | One phone screen. `mode="nuit"` forces the night image whatever the theme (to show both modes side by side).                                                                               |
| `<Shot>`          | `src`, `alt`, `width`, `height`, `caption?`, `variant?: "hero"` | One large screenshot in a 1 px frame, with a caption.                                                                                                                                      |
| `<Shots>`         | `caption`; children: `<Shot>`                                   | Two shots side by side on wide screens, stacked below 768 px, one shared caption.                                                                                                          |
| `<Diagram>`       | `src`, `alt`, `width`, `height`, `caption`                      | A diagram (always a jour/nuit pair). The `alt` describes the whole diagram.                                                                                                                |
| `<ProjectSheet>`  | `rows: [label, value][]`, `status`, `link?: [label, href]`      | The "fiche projet" box: mono labels, values, a status line with the accent dot.                                                                                                            |
| `<Section>`       | `n?`, `label?`, `title?`; children                              | With props: a numbered section (`01 · contexte`) whose `title` is the `h2` (and an anchor for the summary). Without props: continuation of the previous section after a full-width figure. |
| `<PlusList>`      | children: `<Plus>`                                              | A list whose bullet is the `+` glyph.                                                                                                                                                      |
| `<Plus>`          | `title`; children                                               | One item: the title in bold, then the text.                                                                                                                                                |
| `<Definitions>`   | `items: [term, text][]`, `stacked?`                             | A definition list, term in mono on the left (or above when `stacked`).                                                                                                                     |
| `<Callout>`       | `label`; children                                               | A boxed aside on the surface color, with a mono label.                                                                                                                                     |
| `<DecisionTable>` | `columns: string[]`, `rows: string[][]`                         | A table, scrollable horizontally on phones.                                                                                                                                                |
| `<PullQuote>`     | children                                                        | A large quote with an accent rule.                                                                                                                                                         |
| `<Stats>`         | `items: [label, value][]`                                       | A row of figures, mono labels.                                                                                                                                                             |

Plain Markdown is also used: `###` headings, code fences (`text`, `ts`), inline code.
Each article starts with an MDX comment (`{/* … */}`), which renders nothing.

The summary (sommaire) of an article is built from the `<Section n title>` props, and
the link to the next article from the registry: neither is written in the MDX.
