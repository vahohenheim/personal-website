---
title: Tests
description: The test suite of the site: what each layer covers, how to run it, what the CI runs on every push, and how to add a test.
related_code:
  - ../../tests/unit/posts.test.ts
  - ../../tests/unit/post-content.test.ts
  - ../../tests/unit/json-ld.test.ts
  - ../../tests/unit/post-access.test.ts
  - ../../tests/unit/legal-content.test.ts
  - ../../tests/unit/rich-text.test.ts
  - ../../tests/unit/type-scale.test.ts
  - ../../tests/unit/design-system-coverage.test.ts
  - ../../tests/helpers/legal.ts
  - ../../tests/routes/posts-unlock.test.ts
  - ../../tests/smoke/posts.test.ts
  - ../../tests/unit/offer.test.ts
  - ../../tests/e2e/offer.spec.ts
  - ../../vitest.config.ts
  - ../../vitest.smoke.config.ts
  - ../../tests/helpers/setup.ts
  - ../../tests/helpers/leads.ts
  - ../../tests/helpers/lotus.ts
  - ../../tests/helpers/root-params.ts
  - ../../tests/unit/
  - ../../tests/routes/
  - ../../tests/smoke/
  - ../../tests/smoke/global-setup.ts
  - ../../tests/smoke/lotus-stub.ts
  - ../../tests/e2e/
  - ../../playwright.config.ts
  - ../../.github/workflows/ci.yml
  - ../../package.json
last_updated: 2026-10-16
---

# Tests

**Summary.** The site is tested in four layers: with [Vitest](https://vitest.dev), unit
tests of the pure modules, route handlers called in process, and smoke tests that start
the built site and call it over HTTP; with [Playwright](https://playwright.dev), end-to-end
tests that drive the built site in Chromium, on a desktop and on a 375 px phone. No test reaches a real database or a real service:
stores are the in-memory ones and lotus is a stand-in. The CI runs everything on every
push to `main` and on every pull request.

## Commands

| Command              | What it runs                                                   | Needs           |
| -------------------- | -------------------------------------------------------------- | --------------- |
| `npm test`           | unit tests and route handlers (`tests/unit/`, `tests/routes/`) | nothing         |
| `npm run test:watch` | the same, re-run on change                                     | nothing         |
| `npm run test:smoke` | the built site over HTTP (`tests/smoke/`)                      | `npm run build` |
| `npm run test:e2e`   | the built site in a browser (`tests/e2e/`)                     | `npm run build` |

Before handing work back: `npm run check`, `npm test`, `npm run build`,
`npm run test:smoke`, `npm run test:e2e`. The CI runs the same five, in that order.

The first time on a machine, `npx playwright install chromium` downloads the browser. Useful
options: `npm run test:e2e -- --project=phone`, `-- contact` (one spec), `-- --ui` (step
through a test), `-- --repeat-each=3` (look for a flaky test). A failure leaves a
screenshot and a trace in `test-results/` (`npx playwright show-trace <file>`).

## The three layers

| Layer  | Folder          | How                                                      | Covers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------ | --------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit   | `tests/unit/`   | functions imported directly                              | form validation, figures of the admin, admin credentials, lead and funnel stores, posts (drafts by environment, order, next post, home block, protected posts, summary, reading time, image pairs) and sitemap, content of the MDX files (components, images, sizes, loaders), the JSON-LD of every page and post in every language, the legal texts against their sources in both languages (word for word, anchors, the withheld e-invoicing sentence) and the inline marks they use, access tokens of protected posts, dictionaries, labels, the lotus payload, signature, answers and retry rules, no font size outside the type scale, every component file shown on the design system page or skipped with a reason |
| Routes | `tests/routes/` | the `POST`/`GET` of a route file called with a `Request` | contact form, form counters, unlock of a protected post, both cron routes, CSV export, `proxy.ts` (language redirect, admin gate, gate of protected posts and its `matcher`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Smoke  | `tests/smoke/`  | `next start` on port 3219, called with `fetch`           | every public page in both languages (status, language, one `h1`, canonical, JSON-LD), redirects, 404, security headers, sitemap, PDFs (resume and terms), the legal links of the footers, the prices of the services page and the home block, the French terms on the English page, drafts, the list and each post (JSON-LD, images, sharing images), home, feed and sitemap, the protected post over HTTP (HTML, RSC, images, optimizer, cookies) and `.next/static`, the admin gate, and a lead from the form to the admin and to lotus                                                                                                                                                                                 |
| E2E    | `tests/e2e/`    | `next start` on port 3221, Chromium, desktop and 375 px  | what only a browser shows: the contact dialog, the password form, the theme, the language switch, the keyboard, accessibility (axe) and the layout of every page; see the table below                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

What is deliberately tested as a guard against regressions:

- **Stored values** (`LEAD_NEEDS`, `LEAD_STATUSES`, `FUNNEL_EVENTS`…) are compared with
  their literal list: renaming one fails a test.
- **Both dictionaries** must have the same keys, and meta descriptions stay under 155
  characters.
- **No personal data in logs**: tests read what was logged and look for the name, the
  address and the message.
- **Closed by default**: the admin, the cron routes and protected posts are tested
  without their variables, with wrong ones, then with the right ones.
- **Protected posts leak nothing**: without a valid cookie, no sentence of the post in
  the HTML, the RSC answer, its images, the image optimizer or `.next/static`; every
  protected post is in the `matcher` of `proxy.ts`.
- **Content matches the code**: every component an MDX file uses is registered, every
  image it names exists (both variants of a pair) with the declared proportions.

## End-to-end coverage

Every spec runs twice: `desktop` (1280 × 800) and `phone` (375 × 812, touch). The server is
the production build with in-memory stores, its own admin credentials and protected-post
secrets, and the stand-in for lotus on port 3222
([playwright.config.ts](../../playwright.config.ts), [global-setup.ts](../../tests/e2e/global-setup.ts)).

| Feature        | Spec                                                             | What a visitor or the admin does, and what is checked                                                                                                                                                                                                                                                                                                                                    |
| -------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accessibility  | [accessibility.spec.ts](../../tests/e2e/accessibility.spec.ts)   | every public page, the 404, the password page and each step of the contact dialog pass axe (WCAG 2.2 A and AA), in day and night mode; no page scrolls sideways                                                                                                                                                                                                                          |
| Legal pages    | [legal.spec.ts](../../tests/e2e/legal.spec.ts)                   | the terms and the legal notice show the source texts word for word, the PDF, an anchor reached directly with room above its title, internal references, the sticky summary and its current entry (desktop), the folded summary that folds again after a choice (phone), the English terms and their PDF, the e-invoicing sentence withheld, both legal links in every footer             |
| Navigation     | [navigation.spec.ts](../../tests/e2e/navigation.spec.ts)         | header links and `aria-current`, the menu on a phone, the skip link, no posts link in a language without posts, the 404 (status, title, way home) in both languages, the legal page from the footer, external links of the contact section in a new tab                                                                                                                                  |
| Language       | [navigation.spec.ts](../../tests/e2e/navigation.spec.ts)         | the switch keeps the page, sets `lang` and the cookie, and the root then follows it; a French-only post falls back to the English home; the root follows the browser language                                                                                                                                                                                                            |
| Theme          | [theme.spec.ts](../../tests/e2e/theme.spec.ts)                   | system preference first, the toggle, the choice kept across pages and reloads, the class set before React runs (no flash), night images in night mode                                                                                                                                                                                                                                    |
| Home           | [home.spec.ts](../../tests/e2e/home.spec.ts)                     | sections, the portrait preloaded, the three latest posts, project cards to their post and their site, links to the resume, English texts                                                                                                                                                                                                                                                 |
| Contact form   | [contact.spec.ts](../../tests/e2e/contact.spec.ts)               | the three steps with every validation toast, going back keeps the answers, the confirmation and its recap, the home page then and after a reload, "new message", the lead at lotus; Escape, focus trap and focus given back; a network failure and a server refusal; a form sent too fast looks sent but is never stored; the English dialog                                             |
| Posts          | [posts.spec.ts](../../tests/e2e/posts.spec.ts)                   | the list (order, reading time, tags, feed, no protected post), a post (dates, summary on the left of the text and folded on phones, anchors from the summary and from a shared link, every image loaded with its alt, `Stats` figures on one line), the next post, the sharing image                                                                                                     |
| Protected post | [protected-post.spec.ts](../../tests/e2e/protected-post.spec.ts) | the form shows nothing of the post, a wrong password gives a toast, the right one opens the post and keeps it open (cookie flags, `noindex`, images)                                                                                                                                                                                                                                     |
| Services       | [offer.spec.ts](../../tests/e2e/offer.spec.ts)                   | from the home block to the page, the current header link, the summary on the left of the five services, a price on quote and the rates table, the contact dialog from the end of the page, the English page                                                                                                                                                                              |
| Resume         | [resume.spec.ts](../../tests/e2e/resume.spec.ts)                 | content and breadcrumb, both PDFs downloadable, the print page on one A4 page and `noindex`                                                                                                                                                                                                                                                                                              |
| Admin          | [admin.spec.ts](../../tests/e2e/admin.spec.ts)                   | closed without credentials; the dashboard; a new lead with its details; follow-up (status, amount, date, notes) saved and kept; deletion only after confirmation; CSV export; the period of the audience; the toast without the Vercel token; the design system page (closed without credentials, its sections, the summary on the left, axe in both modes, reached from the admin menu) |

Rules for a new spec: find elements by role, label or visible text, as a person would, never
by class; give data a unique value (`Date.now()` and the project name), since both projects
share one server and one memory; never wait a fixed time where a web-first assertion
(`toBeVisible`, `expect.poll`) can wait for the state. The contact form refuses, silently,
what is sent less than 3 seconds after opening: the specs set the browser clock back 10
seconds (`page.clock.install`) instead of waiting.

## How tests stay away from real data

- [tests/helpers/setup.ts](../../tests/helpers/setup.ts) runs before each unit and route
  test: it sets `LEADS_MEMORY_STORE=1`, empties `DATABASE_URL`, `VERCEL_ENV`, the admin
  credentials, the cron secret, the lotus variables and the protected posts variables, and clears the in-memory stores. A test turns on
  what it needs with `vi.stubEnv`; the environment is restored after each test.
- The smoke setup ([global-setup.ts](../../tests/smoke/global-setup.ts)) starts the site
  with the same empty variables (a variable already set wins over `.env.local`), its own
  admin credentials, cron secret and protected posts password and secret, and a stand-in for lotus on port 3220.
- `fetch` is never left free in unit tests: lotus is `mockLotus`
  ([tests/helpers/lotus.ts](../../tests/helpers/lotus.ts)).

## Things to know

- **`next/root-params`** only exists inside a Next.js build. `vitest.config.ts` aliases it
  to a stub that answers `fr`, so modules that read the locale can be imported.
- **`after()`** needs a running request. Route tests mock it, keep the callbacks and run
  them once the response is in hand, which is also how they prove that the visitor is
  answered before anything is sent to lotus.
- **`next/headers`** is mocked where a guard reads the request headers (CSV export).
- **`NextRequest` outside a server** does not know `trailingSlash`: the route test of the
  proxy tolerates a missing final slash, and the smoke test checks the real redirect.
- **A language without posts** is no longer a fact of the content: `withFrenchOnlyPosts`
  ([tests/helpers/posts.ts](../../tests/helpers/posts.ts)) runs a test on a registry where
  every post exists in French only, then puts the real one back.
- **Drafts** are visible when `NODE_ENV` is `development` or `VERCEL_ENV` is `preview`; tests switch both with
  `vi.stubEnv`.
- Smoke tests share one server and one memory: they use unique e-mail addresses and never
  assume the store is empty.

## Adding a test

1. A pure function: a file in `tests/unit/`, with `makeLead`, `leadInput` or `formBody`
   from [tests/helpers/leads.ts](../../tests/helpers/leads.ts) for data.
2. A route: import its handler in `tests/routes/` and call it with `jsonRequest`.
3. Something only the built site shows (headers, redirects, a full path): `tests/smoke/`.
4. A new stored value, environment variable or protected route gets its guard test, as in
   the list above.

A new feature comes with its tests, in the same change.

## State and limits

- The end-to-end tests run Chromium only: Safari and Firefox are checked by hand. Axe finds
  about half of what an accessibility audit would; reading order, wording and screen reader
  output still need a person.
- The Neon store is not run by the tests (no database in CI): its SQL is checked by hand
  against the database when it changes. The memory store follows the same contract and is
  what the tests exercise.
- BotID is skipped outside Vercel, so it is not covered.
