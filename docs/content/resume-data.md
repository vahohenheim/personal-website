---
title: Content and resume data
description: Where the texts of the pages live, how they are typed, and which data is kept apart for the structured data; how to update the changelog, the projects and the profile.
related_code:
  - ../../locales/content/fr.ts
  - ../../locales/content/en.ts
  - ../../locales/fr.ts
  - ../../locales/en.ts
  - ../../lib/models/content.ts
  - ../../lib/constants/experiences.ts
  - ../../lib/constants/companies.ts
  - ../../lib/constants/qualifications.ts
  - ../../lib/constants/languages.ts
  - ../../lib/constants/personal-projects.ts
  - ../../lib/constants/project-links.ts
  - ../../lib/constants/skills.ts
  - ../../lib/constants/site.ts
last_updated: 2026-10-16
---

# Content and resume data

**Summary.** What the pages show is written, as finished text, in
[locales/content/](../../locales/content/): one file per language, same structure, typed
by [lib/models/content.ts](../../lib/models/content.ts). The facts needed by search engines
(employers, dates, schools, skills) are kept as data in
[lib/constants/](../../lib/constants/) and feed the structured data only. The two must
tell the same story: a change to one usually means a change to the other.

## Page texts

`locales/content/fr.ts` and `en.ts` export `home` and `resume`. The French file is the
reference: it reproduces the redesign brief word for word, except the pull quote of the
home page, reworded by Valentin on 2026-10-11. The English file mirrors it,
entry for entry.

| Content                                              | Type               | Where it shows     |
| ---------------------------------------------------- | ------------------ | ------------------ |
| `home.card`, `resume.stack.rows`                     | `ProfileRow[]`     | key / value sheets |
| `home.changelog.entries`, `resume.changelog.entries` | `ChangelogEntry[]` | changelogs         |
| `home.projects.items`                                | `ProjectContent[]` | project cards      |
| `resume.education.rows`, `resume.languages.rows`     | `ProfileRow[]`     | dated lists        |

The other dictionary keys (`metadata`, `a11y`, `legal`, `cgv`, `not-found`, `error`…) are in
`locales/fr.ts` and `locales/en.ts`; the legal texts themselves are in `locales/legal/`
([legal-pages.md](../features/legal-pages.md)), and the texts of the services page in
`locales/offer/`, under `offre`, with their prices in `lib/constants/offer.ts`
([offer.md](../features/offer.md)). `en.ts` defines the `Dictionary` type and `fr.ts` is
typed with it, so a missing key fails the type check.

Writing rules are in [styling.md](../frontend/styling.md#typography-of-texts): typographic
apostrophes, non-breaking spaces written ` `, en dashes, no emoji.

## Positioning

- One title everywhere: "Ingénieur front-end senior" / "Senior front-end engineer".
- "Freelance" is a status, shown apart with the accent dot, never merged into the title.
- No objective stated ("Engineering Manager"), no level labels ("expert", "confirmed"),
  no framework version numbers in the hero.

## Data for the structured data

| Data                       | Constant                                          | Dictionary keys used                     |
| -------------------------- | ------------------------------------------------- | ---------------------------------------- |
| Employers and roles        | `EXPERIENCES`, `MISSIONS`, `COMPANIES`            | `companies.list.<id>.name`, `roles.<id>` |
| Schools and qualifications | `SCHOOLS`, `QUALIFICATIONS`                       | `schools.*`, `qualifications.*`          |
| Languages                  | `USER_LANGUAGES`                                  | `languages.list.<id>.name`               |
| Skills                     | `SKILLS`                                          | none                                     |
| Profiles                   | `SOCIAL_NETWORKS`                                 | none                                     |
| Project URLs               | `PERSONAL_PROJECTS`, read through `PROJECT_LINKS` | none                                     |

Every experience has an end date: there is no current employer while freelance, so the
`Person` node carries no `worksFor`.

## Updating

- **A new assignment or position:** add an entry at the top of both changelogs (home and
  resume) in both languages; mark it `current` and remove the flag from the previous one.
  If it is an employment, add it to `EXPERIENCES` too.
- **A project:** add it to `home.projects.items` (or `moreItems`) in both languages, and
  its URL to `PERSONAL_PROJECTS` under the same `id`. A project without a URL shows its
  name as plain text.
  Its status is `online` or `archived`; `stack` is left out while the project
  has none settled.
- **The profile sheet or the stack:** edit the rows in both languages; keep `SKILLS` in
  line.
- **Any visible change:** bump `updatedAt` of the page in
  [lib/constants/pages.ts](../../lib/constants/pages.ts).

The domain, the site name and the portrait path come from `lib/constants/site.ts` only.
