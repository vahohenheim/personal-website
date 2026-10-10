# Redesign progress

Working file for the redesign described in [brief.md](brief.md), with the design charter in
[charte-graphique-valentinbourreau.md](charte-graphique-valentinbourreau.md). It exists so
that the work can be resumed by a new session at any point. Delete this folder's
`progress.md` once the redesign is merged; keep the brief and the charter.

## How to resume

1. `git checkout redesign/changelog` and read this file, then the brief and the charter.
2. `git log --oneline main..HEAD` shows what is done. Each step below is one commit.
3. Continue with the first unchecked step. Tick it here in the same commit.
4. After each step: `npm run check` and `npm run build` must pass.
5. Do not merge or push to `main`: Valentin validates the result first.

## Plan

Architecture is kept: routes `/[locale]/` and `/[locale]/resume/`, dictionaries read with
`getDictionary()`, metadata through `getPageMetadata`, JSON-LD through `getPageJsonLd`.

| Area             | Files                                                                                                                                                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tokens and fonts | `app/globals.css`, `app/[locale]/layout.tsx`, `package.json` (`geist`)                                                                                                                                                                                                        |
| Layout           | `components/header/`, `components/footer/`, `components/container/`, `components/theme-toggle/`                                                                                                                                                                               |
| New components   | `avatar`, `breadcrumb`, `ui/button` (rewritten), `profile-card`, `status-dot`, `section` (rewritten), `changelog-entry`, `achievement-list`, `project-card`                                                                                                                   |
| Content          | `locales/fr.ts`, `locales/en.ts` (new `home` and `resume` structures)                                                                                                                                                                                                         |
| Pages            | `app/[locale]/page.tsx`, `app/[locale]/resume/page.tsx`, then `legal`, `not-found`, `error` restyled with the same tokens                                                                                                                                                     |
| Metadata         | `lib/helpers/metadata.ts`, `app/[locale]/opengraph-image.tsx`, `app/icon.tsx`                                                                                                                                                                                                 |
| Removed          | `cover`, `companies`, `company-icon`, `icons/companies`, `expertise(s)`, `personal-project(s)`, `appear`, `wordmark`, `language-toggle`, `ui/mode-toggle`, `ui/dropdown-menu`, `ui/badge`, `ui/heading`, `ui/nav-link`, resume `_components`, and the packages they alone use |

## Steps

- [x] 0. Save the brief, the charter and this file (`docs/redesign/`).
- [x] 1. Tokens, fonts and global rules: Eucalyptus variables, Tailwind theme (`bg`,
      `surface`, `line`, `muted`, `text2`, `text`, `accent`, `on-accent`, radius 2 px),
      `geist` package, selection, focus, links, motion.
- [x] 2. Layout: container, header (logo, nav `cv · projets · contact · fr · en`, theme
      button), footers (home and resume variants).
- [x] 3. Primitives: `Avatar`, `Breadcrumb`, `Button`, `ProfileCard`, `StatusDot`,
      section and section title, `ChangelogEntry`, `AchievementList`, `ProjectCard`.
- [x] 4. Content: French texts word for word from the brief, English mirror, micro-typography.
- [x] 5. Home page.
- [x] 6. Resume page.
- [x] 7. Legal, 404 and error pages restyled with the new tokens and layout.
- [x] 8. Metadata: titles, descriptions, Open Graph image, favicon.
- [x] 9. Data and structured data aligned with the new content (freelance since 2026-10,
      SOLO ended 2026-10, lead roles); dead code and unused packages removed.
- [ ] 10. Documentation and `CLAUDE.md` rules rewritten for the new design.
- [x] 11. Verification: screenshots at 1280 and 375 px, light and dark, both pages;
      Lighthouse; acceptance criteria of the brief ticked below.

## State after step 11

Everything is done except step 10: the pages of `docs/` and the rules of `CLAUDE.md` still
describe the previous design and must be rewritten before merging. Then answer the open
questions below with Valentin, and merge only after his validation.

## Decisions taken

- **Tailwind names.** Colours are exposed as `--color-bg`, `--color-text`… so classes read
  `bg-bg`, `text-text`, `text-text2`, `text-muted`, `border-line`, `bg-surface`,
  `bg-accent text-on-accent`.
- **Exact texts live in the dictionaries.** The brief gives prose, not data: the home and
  resume contents are arrays in `locales/`. `lib/constants/` keeps the facts used by the
  structured data only.
- **Theme.** `next-themes` stays (system default, class attribute, no flash). The toggle
  switches to the opposite of the resolved theme.
- **Language switch.** A plain link to the same page in the other locale: no client code.
- **Header.** Not sticky, no blur.
- **Legal page.** Kept and reachable: it is a legal requirement added the same day.

## Open questions for Valentin

1. **`cv.pdf` does not exist.** The resume has a "Télécharger cv.pdf" button. Until the
   file is provided (or generated from the charter's "CV PDF" section), the button points
   to `/cv.pdf`, which must exist before merging.
2. **Legal link in the footer.** The brief's footer has no link to the legal page. Default
   taken: a mono 12 px "mentions légales" link next to the copyright line. Say if it
   should go elsewhere.
3. **Legal page content.** It says the site is published "in a personal capacity". As a
   freelancer, the notice probably needs the business identity (SIRET, address). To update
   once the status is registered.
4. **Sitemap and proxy** are unchanged. The section anchors `projets` and `contact` are
   links to `/#projects` and `/#contact` on the home page.

## Verification tooling

Screenshots need real device emulation (headless Chrome clamps the window to 500 px). The
script used so far drives Chrome through the DevTools protocol; recreate it if the session
scratchpad is gone:

```bash
# node --experimental-websocket shot.mjs <url> <out.png> <width> <height> [waitMs] [light|dark]
# Launch Chrome with --headless=new --remote-debugging-port, then send over the WebSocket:
# Emulation.setDeviceMetricsOverride, Emulation.setEmulatedMedia (prefers-color-scheme),
# Page.navigate, Page.captureScreenshot.
```

Lighthouse: `CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npx -y lighthouse <url> --output=json`.

## Acceptance criteria

Checked on 2026-10-11 against the local production build (`next start`).

| Check                                | Result                                                                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Elements starting at `opacity: 0`    | 0                                                                                                                       |
| `cv` link at 375 px                  | visible, inside the viewport                                                                                            |
| Theme                                | follows the system; one click forces the other mode, a second one switches back; `next-themes` script runs before paint |
| Fonts in the DOM                     | GeistSans and GeistMono only                                                                                            |
| Radii in the DOM                     | 0, 2 px, 6 px (portrait), full (status dot)                                                                             |
| Shadows, gradients, backdrop filters | 0                                                                                                                       |
| Emoji in the built pages             | 0                                                                                                                       |
| Contrast, light                      | muted 5.10 on bg and 4.74 on surface, text2 10.17, accent 5.80, on-accent 6.12                                          |
| Contrast, dark                       | muted 6.41 and 6.00, text2 10.81, accent 9.99, on-accent 9.99                                                           |
| Lighthouse                           | accessibility 100 on home and resume, CLS 0                                                                             |
| Structured data                      | no error, no warning (schema.org validator)                                                                             |

Screenshots: [screenshots/](screenshots/) (home and resume, 1280 and 375 px, light and dark).

Not covered by a tool: the word-for-word comparison of the French texts was done by
generating `locales/content/fr.ts` from the brief; reread the pages once before merging.

- [x] Hero visible and complete on first render, no animation hiding content.
- [x] `cv` link visible in the header at 375 px.
- [x] Theme follows the system, the button forces the other mode, no flash on load.
- [x] Only Eucalyptus variables: no slate or blue left.
- [x] Geist and Geist Mono only. No emoji in the DOM.
- [x] Radius 2 px everywhere, 6 px for the avatar. No shadow, no gradient.
- [x] `’`, en dashes and non-breaking spaces correct in French. No hand-typed bullets.
- [x] Contrast at least 4.5:1 in both modes. Visible focus. Theme button has `aria-label`.
- [x] French contents match the brief word for word; English mirrors the structure.
- [x] Lighthouse: accessibility at least 95, CLS about 0.
- [x] Screenshots at 1280 and 375 px, light and dark, both pages, delivered at the end.
