---
title: Documentation
description: Index of the technical documentation of the personal website, with one line per page and where to start.
related_code:
  - ../CLAUDE.md
  - ../README.md
last_updated: 2026-10-15
---

# Documentation

This index is the entry point of the technical documentation. Each page covers a single
topic and starts with a YAML block (`title`, `description`, `related_code`, `last_updated`)
followed by a summary. To find which page to update after a change, look for the modified
file in the `related_code` fields.

**Where to start:** [architecture/overview.md](architecture/overview.md), then
[content/resume-data.md](content/resume-data.md).

## Pages

| Page                                                                                           | Description                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [architecture/overview.md](architecture/overview.md)                                           | Stack, folder structure, how a request is served, what is static and what is not.                                                                                  |
| [architecture/i18n.md](architecture/i18n.md)                                                   | Locales, the `proxy.ts` redirect, dictionaries read through `next/root-params`, adding a locale.                                                                   |
| [architecture/security.md](architecture/security.md)                                           | Content Security Policy and security headers, `security.txt`, the DNS records still to add, and what all this implies for third-party services.                    |
| [content/resume-data.md](content/resume-data.md)                                               | Where the page texts live and how they are typed, the data kept for the structured data, and how to update the changelog, the projects and the profile.            |
| [features/pages.md](features/pages.md)                                                         | The pages of the site (home, resume, legal notice, terms of service, 404, error) and the checklist to add one.                                                     |
| [features/legal-pages.md](features/legal-pages.md)                                             | The terms of service and the legal notice: texts, layout, the PDF and its versions, English pages, the handoff, decisions taken against the brief.                 |
| [features/seo.md](features/seo.md)                                                             | Meta tags, canonical and `hreflang`, sitemap, robots, sharing image and icons, and the JSON-LD graph of each page.                                                 |
| [features/posts.md](features/posts.md)                                                         | The posts section end to end: reader's path, writing and publishing, MDX components, images, registry, drafts on previews, protected posts, SEO, tests, checklist. |
| [features/resume-pdf.md](features/resume-pdf.md)                                               | The one-page A4 resume of the charter: the print page, the script that prints it in each language, when to regenerate it.                                          |
| [features/contact-form.md](features/contact-form.md)                                           | The contact dialog for leads: steps, API contract, anti-spam, error toasts, what changes after sending.                                                            |
| [features/admin.md](features/admin.md)                                                         | The `/admin` dashboard: access protection, credentials, leads (figures, charts, table, follow-up, export), conversion, audience figures, rules.                    |
| [features/conversion.md](features/conversion.md)                                               | From a visit to a message sent: anonymous daily counters of the contact form, origin of each lead, the conversion section of the admin.                            |
| [features/lotus-sync.md](features/lotus-sync.md)                                               | Leads forwarded to lotus through a signed webhook: contract, sync status of each lead, daily retry, guards, how to verify.                                         |
| [features/analytics.md](features/analytics.md)                                                 | Audience figures: daily copy of Vercel Web Analytics to Neon to outlive the one-month retention, cron, variables, display in the admin.                            |
| [database/neon.md](database/neon.md)                                                           | The Neon database: attachment to Vercel, connection strings, driver, local development without a database, setup.                                                  |
| [database/schema.md](database/schema.md)                                                       | Tables and columns, with the log of schema changes.                                                                                                                |
| [frontend/components.md](frontend/components.md)                                               | Component conventions and the building blocks of the Changelog design.                                                                                             |
| [frontend/styling.md](frontend/styling.md)                                                     | Eucalyptus tokens, Tailwind theme, light and dark mode, Geist and Geist Mono, type scale, heading rules, page templates, global rules.                             |
| [frontend/design-system.md](frontend/design-system.md)                                         | The `/admin/design-system/` showroom: every component in day and night mode, and the rule that keeps it complete.                                                  |
| [development/code-quality.md](development/code-quality.md)                                     | TypeScript, ESLint and Prettier setup, what the lint expects, the checks to run.                                                                                   |
| [development/testing.md](development/testing.md)                                               | The test suite (Vitest): unit, route and smoke layers, what the CI runs, how tests stay away from real data, how to add one.                                       |
| [operations/runbook.md](operations/runbook.md)                                                 | Local setup, commands, continuous integration, Node version, deployment, dependency upgrades, troubleshooting.                                                     |
| [audits/2026-10-10-full-audit.md](audits/2026-10-10-full-audit.md)                             | Audit of 2026-10-10: security, performance, accessibility, SEO, technical health and French legal obligations, with measurements, priorities and an action log.    |
| [redesign/charte-graphique-valentinbourreau.md](redesign/charte-graphique-valentinbourreau.md) | Design charter (in French): principles, logo, palette, typography, components. Authoritative for the look of the site.                                             |
| [redesign/brief.md](redesign/brief.md)                                                         | Brief of the October 2026 redesign (in French), with the exact French texts and the acceptance criteria.                                                           |

## Conventions

- **One topic per page.** File names are in kebab-case and stay stable.
- **YAML header required**, then a summary of 3 to 5 lines before the detail.
- **Relative links** between pages and to the code.
- **Language:** English, like everything else in this repository.
- **No secrets.** Environment variables are documented by name only, never by value.
- **Audits** are dated pages under `audits/`. They are a snapshot: do not rewrite the findings afterwards, record what was done in their action log.
- **Maintenance:** every change to the site updates, in the same change, the pages that cover it and their `last_updated`. If no page covers the topic, create one and add it to the table above.
- **Request log:** every request handled through Claude Code is recorded in one line in the "Request log" section of [CLAUDE.md](../CLAUDE.md), then reflected in the pages concerned here.
