---
title: Tests
description: The test suite of the site: what each layer covers, how to run it, what the CI runs on every push, and how to add a test.
related_code:
  - ../../tests/unit/posts.test.ts
  - ../../tests/unit/post-content.test.ts
  - ../../tests/unit/json-ld.test.ts
  - ../../tests/unit/post-access.test.ts
  - ../../tests/routes/posts-unlock.test.ts
  - ../../tests/smoke/posts.test.ts
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
  - ../../.github/workflows/ci.yml
  - ../../package.json
last_updated: 2026-10-14
---

# Tests

**Summary.** The site is tested with [Vitest](https://vitest.dev) in three layers: unit
tests of the pure modules, route handlers called in process, and smoke tests that start
the built site and call it over HTTP. No test reaches a real database or a real service:
stores are the in-memory ones and lotus is a stand-in. The CI runs everything on every
push to `main` and on every pull request.

## Commands

| Command              | What it runs                                                   | Needs           |
| -------------------- | -------------------------------------------------------------- | --------------- |
| `npm test`           | unit tests and route handlers (`tests/unit/`, `tests/routes/`) | nothing         |
| `npm run test:watch` | the same, re-run on change                                     | nothing         |
| `npm run test:smoke` | the built site over HTTP (`tests/smoke/`)                      | `npm run build` |

Before handing work back: `npm run check`, `npm test`, `npm run build`,
`npm run test:smoke`. The CI runs the same four, in that order.

## The three layers

| Layer  | Folder          | How                                                      | Covers                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------ | --------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit   | `tests/unit/`   | functions imported directly                              | form validation, figures of the admin, admin credentials, lead and funnel stores, posts (drafts by environment, order, next post, home block, protected posts, summary, reading time, image pairs) and sitemap, content of the MDX files (components, images, sizes, loaders), the JSON-LD of every page and post in every language, access tokens of protected posts, dictionaries, labels, the lotus payload, signature, answers and retry rules |
| Routes | `tests/routes/` | the `POST`/`GET` of a route file called with a `Request` | contact form, form counters, unlock of a protected post, both cron routes, CSV export, `proxy.ts` (language redirect, admin gate, gate of protected posts and its `matcher`)                                                                                                                                                                                                                                                                       |
| Smoke  | `tests/smoke/`  | `next start` on port 3219, called with `fetch`           | every public page in both languages (status, language, one `h1`, canonical, JSON-LD), redirects, 404, security headers, sitemap, PDFs, drafts, the list and each post (JSON-LD, images, sharing images), home, feed and sitemap, the protected post over HTTP (HTML, RSC, images, optimizer, cookies) and `.next/static`, the admin gate, and a lead from the form to the admin and to lotus                                                       |

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

- No browser test: the contact dialog, the password form, the theme and the layout are
  not exercised by the suite. They are checked by hand (the posts section was, with
  Playwright at 375 and 1280 px in both modes, when built).
- The Neon store is not run by the tests (no database in CI): its SQL is checked by hand
  against the database when it changes. The memory store follows the same contract and is
  what the tests exercise.
- BotID is skipped outside Vercel, so it is not covered.
