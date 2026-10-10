---
title: Security headers
description: Content Security Policy and security headers set on every route, and what they imply for images, fonts and third-party services.
related_code:
  - ../../next.config.ts
last_updated: 2026-10-10
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

| Directive                                            | Allowed                                         |
| ---------------------------------------------------- | ----------------------------------------------- |
| `default-src`, `font-src`, `base-uri`, `form-action` | same origin                                     |
| `script-src`                                         | same origin, inline, `eval` (needed by Next.js) |
| `style-src`                                          | same origin, inline                             |
| `img-src`                                            | same origin, `blob:`, `data:`                   |
| `object-src`, `frame-ancestors`                      | none                                            |

## What it implies

- **Images.** No remote image is allowed: `images.remotePatterns` is not set. The portrait
  is a local file ([styling.md](../frontend/styling.md#portrait)). A remote image would go
  through `next/image` and need its domain added to `remotePatterns`.
- **Fonts.** Geist is self-hosted by `next/font`, so it passes `font-src 'self'`.
- **Analytics.** Vercel Analytics is served from the site's own origin on Vercel.
- **Third-party services.** A script, iframe, font or browser-side network call to another
  origin is blocked until the policy allows it. Open the policy explicitly, document it
  here and record it in the request log.
- **SVG.** `images.dangerouslyAllowSVG` is on, with a sandboxed policy for optimised images.
