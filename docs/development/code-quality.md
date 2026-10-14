---
title: Code quality
description: TypeScript, ESLint and Prettier setup, what the lint expects when writing code, and the checks to run before handing work back.
related_code:
  - ../../eslint.config.mjs
  - ../../.prettierrc.json
  - ../../.prettierignore
  - ../../.editorconfig
  - ../../tsconfig.json
  - ../../package.json
last_updated: 2026-10-14
---

# Code quality

**Summary.** Three tools guard the code: TypeScript in strict mode, ESLint with type-aware
rules, and Prettier. One command runs all three: `npm run check`. The test
suite is described in [testing.md](testing.md); the type system carries the guarantees a
test would repeat (dictionary keys, page registry, icon maps).

## Commands

| Command                | What it does                                 |
| ---------------------- | -------------------------------------------- |
| `npm run check`        | `typecheck`, `lint:check` and `format:check` |
| `npm run typecheck`    | `next typegen`, then `tsc --noEmit`          |
| `npm run lint`         | ESLint with `--fix`                          |
| `npm run lint:check`   | ESLint, failing on any warning               |
| `npm run format`       | Prettier on the whole repository             |
| `npm run format:check` | Prettier, read-only                          |

Before handing work back, `npm run check`, `npm test`, `npm run build`,
`npm run test:smoke` and `npm run test:e2e` must all pass. The same five
commands run in CI on every push ([runbook](../operations/runbook.md#continuous-integration)).

The `typegen` step matters: `LayoutProps`, `PageProps` and the exports of `next/root-params`
are generated types.

## ESLint

[eslint.config.mjs](../../eslint.config.mjs), flat config:

- `eslint-config-next/core-web-vitals`: Next.js, React and React Hooks rules, including the
  React Compiler ones.
- `typescript-eslint` `strictTypeChecked` and `stylisticTypeChecked`, with type information
  (`projectService`).
- The full `jsx-a11y` recommended set.
- Import ordering, a ban on `../../` imports, and a few React rules.
- `eslint-config-prettier` last, so that no rule fights with Prettier.

What it expects when writing code:

- `type` rather than `interface`, `T[]` rather than `Array<T>`, inline type imports
  (`import { type Company } from …`).
- No `any`, no non-null assertion, no condition that the types make always true or always
  false, `??` rather than `||` for defaults.
- Imports in one block, sorted: packages, then `@/…`, then relative.
- A stable `key` in lists, never the array index.
- No class used as a namespace: export plain functions.
- No `eslint-disable` comment without a reason written next to it. Unused ones are errors.

The lint takes about six seconds because of the type analysis.

## Prettier

[.prettierrc.json](../../.prettierrc.json) keeps Prettier's defaults (2 spaces, double
quotes, trailing commas) at 100 columns, with `lf` line endings, and sorts Tailwind classes.
[.editorconfig](../../.editorconfig) mirrors it for editors. Files listed in `.gitignore`
are skipped; [.prettierignore](../../.prettierignore) only adds the lockfile and the
generated `AGENTS.md`.

## TypeScript

Strict mode, `moduleResolution: bundler`, alias `@/*` to the repository root. `next dev`
and `next build` may adjust [tsconfig.json](../../tsconfig.json) (for example the `jsx`
setting or the generated type folders); commit those changes.

Structured data is typed with `schema-dts` ([seo.md](../features/seo.md)).
