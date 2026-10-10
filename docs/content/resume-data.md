---
title: Resume data and texts
description: How the content of the site is split between structure and texts, linked by identifiers, and how to add an experience, a project, a qualification or a language.
related_code:
  - ../../lib/models/
  - ../../lib/constants/companies.ts
  - ../../lib/constants/experiences.ts
  - ../../lib/constants/qualifications.ts
  - ../../lib/constants/languages.ts
  - ../../lib/constants/personal-projects.ts
  - ../../lib/constants/resume.ts
  - ../../lib/constants/skills.ts
  - ../../lib/constants/social-network.ts
  - ../../lib/constants/site.ts
  - ../../locales/en.ts
  - ../../locales/fr.ts
  - ../../components/company-icon/company-icon.tsx
  - ../../components/personal-project/personal-project.tsx
  - ../../lib/utils/format-date-difference.ts
last_updated: 2026-10-10
---

# Resume data and texts

**Summary.** Content is split in two. Structure (dates, links, order) lives in
[lib/constants/](../../lib/constants/); texts live in [locales/](../../locales/). The link
between them is an identifier, defined by an enum in [lib/models/](../../lib/models/): the
enum value is the dictionary key. Because constants and dictionaries are typed by these
enums, a missing entry or text fails the type check.

## The model

| Data              | Model                                   | Constant                                     | Dictionary keys                                                    |
| ----------------- | --------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| Companies         | `CompanyId`                             | `COMPANIES` (`companies.ts`)                 | `companies.list.<id>.name`                                         |
| Experiences       | `Experience`                            | `EXPERIENCES` (`experiences.ts`)             | none, through the company and the missions                         |
| Missions          | `MissionId`                             | `MISSIONS` (`experiences.ts`)                | `experiences.roles.<id>.content`                                   |
| Roles             | `RoleId`                                | inside each mission                          | `roles.<id>`                                                       |
| Qualifications    | `QualificationId`, `QualificationLevel` | `QUALIFICATIONS` (`qualifications.ts`)       | `qualifications.list.<id>.label`, `qualifications.level.<id>.name` |
| Schools           | `SchoolId`                              | `SCHOOLS` (`qualifications.ts`)              | `schools.list.<id>.name`                                           |
| Languages         | `LanguageId`, `LanguageLevel`           | `USER_LANGUAGES` (`languages.ts`)            | `languages.list.<id>.name`, `languages.level.<id>.name`            |
| Expertises        | `ExpertiseId`                           | `EXPERTISES` (`resume.ts`)                   | `expertises.list.<id>.{label,title,text}`                          |
| Personal projects | `PersonalProjectId`                     | `PERSONAL_PROJECTS` (`personal-projects.ts`) | `personal-projects.list.<id>.{title,description}`                  |
| Social networks   | `SocialNetworkType`                     | `SOCIAL_NETWORKS` (`social-network.ts`)      | none                                                               |
| Skills            | none                                    | `SKILLS` (`skills.ts`)                       | none, used by the structured data only                             |

Texts are read by indexing the dictionary with the identifier:

```tsx
const { companies } = await getDictionary();
companies.list[experience.company.id].name;
```

## Rules

- Never hardcode a visible text in a component: add it to both locale files.
- Reference data through the enum (`MISSIONS[MissionId.EP_LEAD_FRONT_END]`), not the string.
- `EXPERIENCES` and `PERSONAL_PROJECTS` are displayed in array order, most recent first.
- Dates are `IsoDate` values (`YYYY-MM-DD`). `endDate: "today"` marks the current position.
- A mission shows its own dates only when it has both `startDate` and `endDate`. Use them
  when one experience holds several missions.
- The domain, the site name and the portrait come from `lib/constants/site.ts`. Do not
  write them anywhere else.
- The headline title ("senior front-end engineer") is the same in the hero, the resume
  title, the meta tags, `person.jobTitle` and the role of the current position. Change
  them together.
- Texts use typographic apostrophes (`’`), no emoji, and an en dash in date ranges
  ([styling.md](../frontend/styling.md#typography-of-texts)).
- The same data feeds the structured data of the pages ([seo.md](../features/seo.md)), so
  a change here is also a change to what search engines read.

## Durations

[format-date-difference.ts](../../lib/utils/format-date-difference.ts) turns two dates into
"2 years", "8 months" or "a year and 6 months", rounded to the nearest month, in both
languages. It does not use the `humanize()` helper of `dayjs`, which rounds 11 months to
"a year".

## Adding an experience

1. `lib/models/company.ts`: a value in `CompanyId`. `lib/constants/companies.ts`: an entry
   in `COMPANIES`.
2. `components/icons/companies/<id>.tsx`: the logo as an SVG component (`IconProps` props,
   colour through `className` and `fill`). Register it in `COMPANY_ICONS` in
   `company-icon.tsx`.
3. `lib/models/mission.ts`: a value in `MissionId`. `lib/constants/experiences.ts`: an
   entry in `MISSIONS`, then in `EXPERIENCES`.
4. Both locale files: `companies.list.<id>.name` and
   `experiences.roles.<mission-id>.content`.
5. If it brings new skills, add them to `lib/constants/skills.ts`.

The company also appears in the logo strip of the home page (`Object.values(COMPANIES)`,
in declaration order), and as an employer in the structured data.

## Adding a personal project

1. `lib/models/personal-project.ts`: a value in `PersonalProjectId`.
2. `lib/constants/personal-projects.ts`: an entry with `status` and, if the project is
   public, `link`. A project without a link is displayed but not clickable.
3. `components/personal-project/personal-project.tsx`: its `lucide-react` icon in
   `PROJECT_ICONS`.
4. Both locale files: `personal-projects.list.<id>.title` and `.description`.

## Adding a qualification or a language

Same pattern: a value in the enum, an entry in the constant, the texts in both locale
files. A new school also needs an entry in `SCHOOLS`.

Language levels are `native`, `professional` and `notion` (`LanguageLevel`), each with its
label under `languages.level` in the locale files.

## Updating a page's content

When the visible content of a page changes, bump its `updatedAt` in
[lib/constants/pages.ts](../../lib/constants/pages.ts). It feeds the sitemap and the
`dateModified` of the structured data.
