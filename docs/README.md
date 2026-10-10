---
title: Documentation
description: Index of the technical documentation of the personal website, with one line per page and where to start.
related_code:
  - ../CLAUDE.md
  - ../README.md
last_updated: 2026-10-10
---

# Documentation

This index is the entry point of the technical documentation. Each page covers a single
topic and starts with a YAML block (`title`, `description`, `related_code`, `last_updated`)
followed by a summary. To find which page to update after a change, look for the modified
file in the `related_code` fields.

**Where to start:** [architecture/overview.md](architecture/overview.md), then
[content/resume-data.md](content/resume-data.md).

## Pages

| Page                                                       | Description                                                                                                      |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [architecture/overview.md](architecture/overview.md)       | Stack, folder structure, how a request is served, what is static and what is not.                                |
| [architecture/i18n.md](architecture/i18n.md)               | Locales, the `proxy.ts` redirect, dictionaries read through `next/root-params`, adding a locale.                 |
| [architecture/security.md](architecture/security.md)       | Content Security Policy and security headers, and what they imply for images and third-party services.           |
| [content/resume-data.md](content/resume-data.md)           | How resume data and texts are split and linked by identifiers; adding an experience, a project, a qualification. |
| [features/pages.md](features/pages.md)                     | The pages of the site (home, resume, 404, error) and the checklist to add one.                                   |
| [features/seo.md](features/seo.md)                         | Meta tags, canonical and `hreflang`, sitemap, robots, and the JSON-LD graph of each page.                        |
| [frontend/components.md](frontend/components.md)           | Component conventions, shadcn/ui usage, icons, links and buttons.                                                |
| [frontend/styling.md](frontend/styling.md)                 | Tailwind v4 theme, light and dark mode, font, portrait.                                                          |
| [development/code-quality.md](development/code-quality.md) | TypeScript, ESLint and Prettier setup, what the lint expects, the checks to run.                                 |
| [operations/runbook.md](operations/runbook.md)             | Local setup, commands, deployment, dependency upgrades, troubleshooting.                                         |

## Conventions

- **One topic per page.** File names are in kebab-case and stay stable.
- **YAML header required**, then a summary of 3 to 5 lines before the detail.
- **Relative links** between pages and to the code.
- **Language:** English, like everything else in this repository.
- **No secrets.** The site has no environment variable today; if one appears, document its name only, never its value.
- **Maintenance:** every change to the site updates, in the same change, the pages that cover it and their `last_updated`. If no page covers the topic, create one and add it to the table above.
- **Request log:** every request handled through Claude Code is recorded in one line in the "Request log" section of [CLAUDE.md](../CLAUDE.md), then reflected in the pages concerned here.
