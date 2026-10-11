---
title: Security headers
description: Content Security Policy and security headers set on every route, and what they imply for images, fonts and third-party services.
related_code:
  - ../../next.config.ts
  - ../../public/.well-known/security.txt
last_updated: 2026-10-11
---

# Security headers

**Summary.** [next.config.ts](../../next.config.ts) sets a strict Content Security Policy
and a few security headers on every route. The site loads nothing from another origin:
scripts, styles, fonts and images are all served by the site itself. Any third-party
service therefore starts with a change to the policy.

## Headers

| Header                    | Value                               | Effect                                  |
| ------------------------- | ----------------------------------- | --------------------------------------- |
| `Content-Security-Policy` | see below                           | Restricts where resources can load from |
| `X-Frame-Options`         | `DENY`                              | The site cannot be embedded in a frame  |
| `X-Content-Type-Options`  | `nosniff`                           | No MIME type guessing                   |
| `Referrer-Policy`         | `origin-when-cross-origin`          | Only the origin is sent to other sites  |
| `Permissions-Policy`      | camera, microphone, geolocation off | These browser features are disabled     |

## Content Security Policy

| Directive                                            | Allowed                                                                           |
| ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| `default-src`, `font-src`, `base-uri`, `form-action` | same origin                                                                       |
| `script-src`                                         | same origin and inline. `eval` is added in development only, where React needs it |
| `style-src`                                          | same origin, inline                                                               |
| `img-src`                                            | same origin, `blob:`, `data:`                                                     |
| `object-src`, `frame-ancestors`                      | none                                                                              |

## What it implies

- **Images.** No remote image is allowed: `images.remotePatterns` is not set. The portrait
  is a local file ([styling.md](../frontend/styling.md#portrait)). A remote image would go
  through `next/image` and need its domain added to `remotePatterns`.
- **Fonts.** Geist and Geist Mono come from the `geist` package and are self-hosted by
  `next/font`, so they pass `font-src 'self'`.
- **Analytics.** Vercel Analytics is served from the site's own origin on Vercel.
- **Third-party services.** A script, iframe, font or browser-side network call to another
  origin is blocked until the policy allows it. Open the policy explicitly, document it
  here and record it in the request log.
- **SVG.** `images.dangerouslyAllowSVG` is on, with a sandboxed policy for optimised images.

## Contact form and admin

The site now accepts input and has a private area. What protects them:

- **Contact API:** Vercel BotID, a honeypot and a time trap; validation and length limits
  on the server; parameterised SQL only; no personal data in the logs
  ([contact-form.md](../features/contact-form.md)). Not in place: a rate limit.
- **Admin:** HTTP Basic over HTTPS, closed by default, constant-time comparison, access
  re-checked in every page, action and route, `no-store` and `noindex`
  ([admin.md](../features/admin.md)).
- **CSP:** unchanged. BotID is loaded through same-origin rewrites added by `withBotId`,
  and the form posts to the site's own origin.

## Disclosure contact

[public/.well-known/security.txt](../../public/.well-known/security.txt) gives the address
to report a vulnerability. It carries an expiry date: renew it before 2027-10-10.

## Outside the repository

Two protections are DNS records, set at the domain provider and not in this code:

- **DMARC.** The domain has an SPF record but no DMARC policy, so mail can be forged in its
  name. Add a `TXT` record on `_dmarc.valentinbourreau.com`, starting with
  `v=DMARC1; p=quarantine; rua=mailto:contact@valentinbourreau.com`, and enable DKIM at the
  mail provider.
- **CAA.** A `CAA` record limits which authorities may issue certificates for the domain.
  Vercel uses Let's Encrypt: `0 issue "letsencrypt.org"`.

Both were still missing on 2026-10-10.
