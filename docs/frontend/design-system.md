---
title: Design system page
description: The /admin/design-system/ page, which shows the tokens and every component of the site in day and night mode side by side, and the rule that keeps it complete.
related_code:
  - ../../app/admin/design-system/page.tsx
  - ../../app/admin/design-system/coverage.ts
  - ../../app/admin/design-system/_components/registry.tsx
  - ../../app/admin/design-system/_components/specimen.tsx
  - ../../components/admin/admin-header.tsx
  - ../../app/globals.css
  - ../../tests/unit/design-system-coverage.test.ts
  - ../../tests/e2e/admin.spec.ts
last_updated: 2026-10-16
---

# Design system page

**Summary.** `/admin/design-system/` is the showroom of the site: the eight colour tokens,
the type scale, the spacing, and every component rendered with the production code, each
one twice, in day mode and in night mode side by side. It sits in the [admin](../features/admin.md),
behind the same protection, and is reached from the admin menu ("demandes · fréquentation ·
design system"). It is a page of the document template, like the posts: summary on the
left, numbered sections on the right.

## How it is built

- **[registry.tsx](../../app/admin/design-system/_components/registry.tsx)** lists the
  sections (fondations, atomes, composés, gabarits) and their specimens. A specimen has a
  name, the files it comes from and a `render(mode)` function, called once per mode so that
  ids stay unique on the page. Contents come from the site itself (`locales/`) wherever
  possible, so that the page shows real cases.
- **[specimen.tsx](../../app/admin/design-system/_components/specimen.tsx)** draws the
  frame: name and files on top, then the two halves, one with the `.light` class and one
  with the `.dark` class. Those classes of [globals.css](../../app/globals.css) set the
  eight tokens on their subtree, whatever the mode of the page.
- **[coverage.ts](../../app/admin/design-system/coverage.ts)** says, for every `.tsx`
  file under `components/`, whether the page shows it (`SHOWN_FILES`) or not
  (`SKIPPED_FILES`, with the reason shown in the last section of the page). Components
  that read the locale of the page (header, footer, legal links) cannot render outside
  `[locale]`; the contact dialog needs its context; post images are better seen in a post.

## The rule

Every new component reaches this page in the same change:

1. add its file to `SHOWN_FILES` in `coverage.ts` (or to `SKIPPED_FILES`, with a reason);
2. add a specimen to `registry.tsx`, with the file in its `files`.

[design-system-coverage.test.ts](../../tests/unit/design-system-coverage.test.ts) fails
when a file of `components/` is in neither list, in both, or shown without a specimen.
The end-to-end tests check that the page is closed without credentials, that it shows its
sections with the summary on the left, and that it passes axe in both modes.

## Rules of the admin

Like every admin page: `requireAdmin()` first, `noindex`, `force-dynamic`, and the proxy
answers `401` without credentials (see [admin.md](../features/admin.md#access)).
