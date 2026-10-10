---
title: Full audit of 2026-10-10
description: Audit of the production site and the repository on security, performance, accessibility, SEO, technical health and French legal obligations, with measurements, prioritised findings and an action log.
related_code:
  - ../../next.config.ts
  - ../../proxy.ts
  - ../../app/globals.css
  - ../../app/[locale]/layout.tsx
  - ../../lib/helpers/metadata.ts
  - ../../package.json
last_updated: 2026-10-11
---

# Full audit — 2026-10-10

**Summary.** The site is in good shape: it is static, exposes no form, no API and no
secret, ships sound security headers and scores 94 to 100 in Lighthouse performance. Nothing
found is urgent in the sense of an exploitable flaw. Six points deserve action first:

1. **No legal notice.** French law requires at least the identity of the hosting provider.
2. **No privacy information**, although the site uses an audience measurement tool and a
   US host.
3. **17 links have no accessible name** (company logos and social icons).
4. **The CSP allows `unsafe-eval` in production**, which Next.js does not need.
5. **Blocks revealed on scroll stay half-transparent at the fold**, which fails the contrast
   check on desktop. This comes from the animation change made the same day.
6. **No continuous integration.** Types, lint and formatting only run when someone thinks
   of it.

All tests were read-only, run against `https://www.valentinbourreau.com` at commit
`64ff197`. The legal section is a reading of public sources, not legal advice.

## Method

| Area               | How                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Security           | Response headers, redirects, probing of sensitive paths, TLS and DNS records, `npm audit`, search for secrets in the git history, review of the code         |
| Performance        | Lighthouse 13.5 (mobile and desktop presets) on the home page and the resume, transfer sizes with and without Brotli, cache headers, composition of the HTML |
| Accessibility, SEO | Lighthouse audits, review of the markup, meta tags and structured data                                                                                       |
| Technical          | Review of the repository: tooling, dependencies, dead code, robustness                                                                                       |
| Legal              | Comparison of what the site does with the LCEN, the GDPR and the CNIL guidance                                                                               |

## Measurements

### Lighthouse

| Page           | Performance | Accessibility | Best practices | LCP   | TBT   | CLS |
| -------------- | ----------- | ------------- | -------------- | ----- | ----- | --- |
| Home, mobile   | 94          | 96            | 100            | 3.0 s | 0 ms  | 0   |
| Resume, mobile | 99          | 96            | 100            | 2.0 s | 10 ms | 0   |
| Home, desktop  | 100         | 92            | 100            | 0.5 s | 0 ms  | 0   |

The SEO category could not be scored: its `canonical` audit crashed in the tool
(`URL.parse is not a function`, a Lighthouse issue under Node 20). The other SEO audits
pass: title, description, crawlability, `robots.txt`, link text, `hreflang`, status code.

### Weight

| Resource               | Raw    | Brotli     |
| ---------------------- | ------ | ---------- |
| Home HTML              | 266 KB | 49 KB      |
| Resume HTML            | 278 KB | 51 KB      |
| JavaScript, 13 chunks  | 745 KB | 243 KB     |
| CSS                    | 36 KB  | 8 KB       |
| Font (Geist, one file) | 29 KB  | 29 KB      |
| Portrait, as served    | —      | about 7 KB |

Total transferred for the home page: 378 KiB. Static assets are cached for a year
(`immutable`), pages are served from the Vercel cache (TTFB around 85 ms from France).

Of the 266 KB of home HTML, 98 KB are inline SVG logos and 142 KB are the React payload,
which repeats those same logos.

## Security

### What is in place

- HTTPS everywhere: HTTP and the apex domain redirect (308) to `https://www.…`, HSTS for two
  years, TLS 1.1 refused, certificate renewed automatically.
- CSP limited to the site's own origin, plus `X-Frame-Options: DENY`, `nosniff`,
  `Referrer-Policy` and `Permissions-Policy` ([security.md](../architecture/security.md)).
- No attack surface on the server: no form, no API route, no database, no environment
  variable. `/.env`, `/.git/config` and directory listings return 404.
- The locale redirect cannot be turned into an open redirect: `//evil.com` stays on the
  site's host.
- No secret in the repository or its history.
- `npm audit --omit=dev` reports nothing: no known vulnerability ships to visitors.
- External links carry `rel="noopener noreferrer"`. HTML injected from texts comes only
  from the locale files.

### Findings

| #   | Finding                                                                                                                                                                                                                                                                        | Priority      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| S1  | `script-src` contains `'unsafe-eval'`. The Next.js CSP guide states it is only needed in development. Emit it only when `NODE_ENV` is `development`.                                                                                                                           | P1            |
| S2  | `script-src` contains `'unsafe-inline'`. It is required today: pages are static, and nonces need dynamic rendering. Next.js documents an experimental Subresource Integrity option as the static alternative; worth testing, not urgent given there is no user input anywhere. | P2            |
| S3  | The domain has an SPF record (`~all`) but no DMARC record. Anyone can send mail that appears to come from `contact@valentinbourreau.com`. Add `_dmarc` with at least `p=quarantine`, and DKIM at the mail provider.                                                            | P1            |
| S4  | No CAA record restricting which authorities may issue certificates for the domain.                                                                                                                                                                                             | P2            |
| S5  | `npm audit` reports 5 high-severity advisories (`braces`, `micromatch`, `fast-glob`), all through `eslint-config-next`. Development tooling only; no fixed release yet.                                                                                                        | P2, watch     |
| S6  | The resume names the security and API tooling of the current employer (Cloudflare WAF, Gravitee). Check that the employer is comfortable with it.                                                                                                                              | P2, to decide |
| S7  | No `/.well-known/security.txt`. Optional for a personal site.                                                                                                                                                                                                                  | P3            |
| S8  | HSTS has no `includeSubDomains` and no `preload`. Vercel's default; fine unless subdomains appear.                                                                                                                                                                             | P3            |
| S9  | Pages are served with `Access-Control-Allow-Origin: *` (Vercel's default for static files). Harmless: the content is public and no cookie is involved.                                                                                                                         | Info          |

## Performance

### Findings

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                | Priority |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| P1  | **Half-visible blocks at the fold.** `.appear-on-scroll` ties opacity to the scroll position (`animation-range: entry 0% entry 35%`). A block that sits at the bottom edge of the screen on load stays partly transparent until the visitor scrolls. Lighthouse reports it as a contrast failure on desktop (expertises). Shorten the range, or keep a minimum opacity, or animate the transform only. | P1       |
| P2  | **Mobile LCP of 3.0 s on the home page** (2.0 s on the resume), under Lighthouse's 4G throttling. The hero fades in from `opacity: 0`, so its text and portrait are painted late and the browser picks a header link as the largest paint. Do not fade the title and the portrait: animate them with a transform only, or not at all.                                                                  | P1       |
| P3  | **243 KB of JavaScript for a static site.** Lighthouse estimates 48 KiB unused. Radix `navigation-menu` is used to render plain lists of links (header menu, social links) and brings its client code; replacing it with a `<nav>` and links would remove a dependency and a client boundary.                                                                                                          | P2       |
| P4  | **Logos are sent twice.** Inline SVG weighs 98 KB in the HTML and again in the React payload. Serving the company logos as static `.svg` files (with `<img>` and a CSS filter or `currentColor` masks) would cut the document by more than half and let the browser cache them.                                                                                                                        | P2       |
| P5  | `proxy.ts` runs for every page request, including URLs that already carry a locale. Narrowing its `matcher` to paths without a locale would keep those requests entirely on the CDN.                                                                                                                                                                                                                   | P3       |
| P6  | Vercel Speed Insights is not enabled. It would give real-user Core Web Vitals instead of lab runs.                                                                                                                                                                                                                                                                                                     | P3       |

## Accessibility

Lighthouse: 92 to 96.

| #   | Finding                                                                                                                                                                                                                                                                                           | Priority |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| A1  | **17 links have no accessible name**: the 8 company logos, the 4 social icons of the hero and the 5 of the footer. A screen reader announces "link" and nothing else. `SOCIAL_NETWORKS` already has an `alt` field that is never rendered. Add `aria-label` (translated) or visually hidden text. | P1       |
| A2  | Contrast failure on the expertises block on desktop: see P1.                                                                                                                                                                                                                                      | P1       |
| A3  | The labels of the two header buttons ("Toggle theme", "Toggle Language") and the portrait `alt` are hardcoded in English, also on the French pages. Move them to the dictionaries.                                                                                                                | P2       |
| A4  | No skip link to the main content, and the language menu items do not carry a `lang` attribute.                                                                                                                                                                                                    | P3       |
| A5  | The company strip uses `overflow-y-scroll`: it should scroll horizontally (`overflow-x-auto`), and some systems show a permanent vertical scrollbar.                                                                                                                                              | P2       |

## SEO

In place: canonical URLs, `hreflang` with `x-default`, sitemap with real modification dates,
`robots.txt`, and structured data validated without error ([seo.md](../features/seo.md)).

| #   | Finding                                                                                                                                                                                                                               | Priority |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| O1  | Meta descriptions are 235 characters long. Search engines cut around 155 to 160. Write a shorter version that keeps the key terms in the first 150 characters.                                                                        | P2       |
| O2  | The social card is declared `summary_large_image` but uses the 480 px square portrait. Platforms expect 1200 × 630: the portrait will be cropped or upscaled. Add an `opengraph-image` of that size, or switch the card to `summary`. | P2       |
| O3  | No `apple-touch-icon`, and the favicon is not the wordmark. The manifest only lists `favicon.ico`.                                                                                                                                    | P3       |
| O4  | Google's Rich Results Test has not been run on the live pages yet.                                                                                                                                                                    | P2       |
| O5  | A Google site verification record exists in the DNS. Check in Search Console that both locales are indexed and that the `www` host is the one reported.                                                                               | P3       |

## Technical health

| #   | Finding                                                                                                                                                                                                                                   | Priority |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| T1  | **No continuous integration.** Nothing runs `npm run check` on a push. A GitHub Actions workflow (install, `check`, `build`) would catch a broken commit before Vercel does.                                                              | P1       |
| T2  | **Node is not pinned.** No `engines`, no `.nvmrc`. Local Node is 20.15.1; the Node 20 line reached end of life in April 2026, and ESLint 10 needs 20.19 or later. Pin a supported LTS in `package.json`, `.nvmrc` and the Vercel project. | P1       |
| T3  | No automated test. A small end-to-end suite would cover what the type system cannot: the locale redirect, the 404, the header at 320 px, one screenshot per page.                                                                         | P2       |
| T4  | `DurationComponent` has a fixed width of 760 px (`w-[760px]`) inside a column that can be narrower. It did not overflow in the screenshots taken at 390 px, but the class is wrong.                                                       | P3       |
| T5  | `HeadingComponent` types `children` as `ReactNode` but injects it as HTML, and its prop is spelled `apperance`. Type it as `string` and rename the prop.                                                                                  | P3       |
| T6  | `error.tsx` offers no "try again" action although Next.js 16 passes a `retry` function.                                                                                                                                                   | P3       |
| T7  | About 16 files under `public/` are not referenced by the code.                                                                                                                                                                            | P3       |
| T8  | TypeScript and ESLint are held back one major by the lint toolchain ([runbook](../operations/runbook.md#dependencies)). Nothing to do but re-check.                                                                                       | Watch    |
| T9  | The repository is public without a `LICENSE` file. By default that means all rights reserved, which is probably the intent; saying so in the README would remove the doubt.                                                               | P3       |

## Legal (France)

This section is not legal advice. Have it confirmed if the site becomes a commercial
activity.

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Priority |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| L1  | **No legal notice.** Since the SREN law of May 2024, legal notices are governed by article 1-1 of the LCEN (formerly article 6 III). A person publishing a site in a non-professional capacity may stay anonymous but must at least give the name and address of the hosting provider. A site presenting a professional profile is safer with the full notice: name of the publisher, a means of contact, and the host (Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA). Omitting it is a criminal offence on paper. | P1       |
| L2  | **No privacy information.** The site processes little, but not nothing: Vercel Analytics counts visits, Vercel keeps technical logs with IP addresses, and both involve a provider in the United States. The CNIL states that an exemption from consent for audience measurement does not remove the duty to inform visitors. A short privacy section should name the publisher as controller, the purposes, the providers, the transfer outside the EU, the retention periods and how to exercise GDPR rights.                    | P1       |
| L3  | **No consent banner needed, as far as this audit can tell.** The `NEXT_LOCALE` cookie (language choice) and the theme stored in the browser are functional and exempt from consent. Vercel Analytics states that it sets no cookie; it is not on the CNIL's list of solutions recognised as exempt, so describe it precisely in the privacy section rather than claiming an exemption.                                                                                                                                             | Info     |
| L4  | Fonts are self-hosted and the portrait is local: no visitor data goes to Google or GitHub when a page loads. Good.                                                                                                                                                                                                                                                                                                                                                                                                                 | Info     |
| L5  | The logos of former employers are trademarks. Using them to state where one worked is a customary, referential use; a company can still ask for removal. The portrait and the texts are the author's own.                                                                                                                                                                                                                                                                                                                          | Info     |
| L6  | The footer says "All rights reserved" with the current year: consistent with T9.                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Info     |

## Priorities

| Priority            | Items                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1, do first        | L1, L2 (a legal and privacy page), A1 (link names), P1 and P2 (animation: fold opacity and LCP), S1 (`unsafe-eval`), S3 (DMARC), T1 (CI), T2 (Node version) |
| P2, next            | P3, P4 (JavaScript and logo weight), A3, A5, O1, O2, O4, T3, S2, S4, S6                                                                                     |
| P3, when convenient | P5, P6, A4, O3, O5, T4 to T7, T9, S7, S8                                                                                                                    |

## Action log

| Date       | Action                                                                                                                                                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-10 | Audit written. No fix applied yet.                                                                                                                                                                                                                                                                                |
| 2026-10-10 | **L1, L2** fixed: page `/[locale]/legal/` with the legal notice and the privacy information, linked from the footer.                                                                                                                                                                                              |
| 2026-10-10 | **A1, A2, A3, A4, A5** fixed: names on every icon-only link, labels and portrait description translated, skip link, `lang` on the language choices, horizontal scroll on the company strip. Lighthouse accessibility is 100 on the local build.                                                                   |
| 2026-10-10 | **P1, P2** fixed: the title and the portrait are no longer faded in, and blocks revealed on scroll only move. The largest paint is now the title. To re-measure in production.                                                                                                                                    |
| 2026-10-10 | **P3** fixed: Radix `navigation-menu` replaced by plain lists of links, dependency removed.                                                                                                                                                                                                                       |
| 2026-10-10 | **P5** fixed: `proxy.ts` no longer runs for URLs that already carry a locale.                                                                                                                                                                                                                                     |
| 2026-10-10 | **S1** fixed: `unsafe-eval` is only sent in development. **S7** fixed: `security.txt` added.                                                                                                                                                                                                                      |
| 2026-10-10 | **O1** fixed: meta descriptions under 155 characters. **O2** fixed: the social card is now `summary`, which suits the square portrait.                                                                                                                                                                            |
| 2026-10-10 | **T1** fixed: GitHub Actions workflow running `check` and `build`. **T2** fixed: Node 24 in `.nvmrc`, `engines` at 22 or later.                                                                                                                                                                                   |
| 2026-10-10 | **T4, T5, T6, T9** fixed: fixed width removed, heading typed as text with `appearance` spelled correctly, "try again" on the error page, licence statement in the README.                                                                                                                                         |
| 2026-10-10 | **Still open.** In the DNS, by the owner: S3 (DMARC), S4 (CAA). To decide: S6 (employer tooling named in the resume). In the code: P4 (logos sent twice), S2 (`unsafe-inline`), T3 (tests), O3 (icons), T7 (unused files in `public/`). To run: O4 (Rich Results Test), O5 (Search Console), P6 (Speed Insights). |
| 2026-10-11 | Redesign (branch `redesign/changelog`): **P4** closed, the logo strip is gone and the home HTML drops from 266 KB to about 55 KB; **O2** and **O3** closed, with a 1200 × 630 sharing image and generated icons; **P1, P2** no longer apply, there is no entrance animation at all.                               |

## Sources

- Next.js 16 Content Security Policy guide, shipped in
  `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`.
- [CNIL, measuring the audience of websites and apps](https://www.cnil.fr/fr/mesurer-la-frequentation-de-vos-sites-web-et-de-vos-applications).
- [Simonnet Avocat, legal notices of a website: obligations and penalties](https://www.simonnetavocat.fr/?p=278538).
- [Legiscope, legal notice template](https://www.legiscope.com/blog/modele-mentions-legales-site.html).
- [Données personnelles, legal notices of a website](https://www.donneespersonnelles.fr/mentions-legales-site-internet).
- [CMS Francis Lefebvre, missing legal notices as unfair competition](https://cms.law/fr/fra/a-la-une/le-defaut-de-mentions-legales-sur-un-site-internet-est-constitutif-de-concurrence-deloyale).
