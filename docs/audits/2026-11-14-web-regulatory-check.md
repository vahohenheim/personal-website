---
title: Web regulatory check of 2026-11-14
description: The site checked against six often-forgotten French and EU obligations (age at sign-up, Google Fonts, session replay, marketing e-mails, three-click cancellation, legal notice), with the exact rule, the real maximum penalty and what is left to do.
related_code:
  - ../../locales/legal/notice.fr.ts
  - ../../locales/legal/notice.en.ts
  - ../../app/[locale]/layout.tsx
  - ../../app/api/contact/route.ts
  - ../../next.config.ts
last_updated: 2026-11-14
---

# Web regulatory check of 2026-11-14

Started from a social-media video listing six breaches "worth €375,000". Each claim was checked against the text of the law, then against the code. The publisher is Valentin Bourreau, sole proprietorship (EI), so the **natural person** ceilings apply, not the company ones the video quotes.

This page is a technical snapshot, not legal advice.

## Result

| Point                    | Rule                                                                                                                                                        | Real ceiling for an EI                                                   | State                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Age at sign-up           | GDPR art. 8 and French Data Protection Act art. 45: parental consent under 15, only for an online service offered directly to children and based on consent | GDPR fines (CNIL); no fixed €20,000 fine exists                          | ✓ Not applicable: no account, the contact form is aimed at businesses                                                     |
| Google Fonts             | Visitor IP sent to Google without a legal basis (GDPR art. 6); German civil judgment LG München I, 2022-01-20, 3 O 17493/20: €100 damages to one visitor    | No French precedent                                                      | ✓ Geist is served from the site (`geist` package); the CSP allows same-origin resources only                              |
| Session replay           | French Data Protection Act art. 82: prior consent; CNIL recommendation of 2026-11-05                                                                        | CNIL fines; "illegal wiretapping" comes from US lawsuits, not French law | ✓ None. Vercel Web Analytics is cookieless and stores aggregated counts only                                              |
| Marketing e-mails        | French Post and Electronic Communications Code (CPCE) art. L34-5: sender identity and an opt-out in every message                                           | €75,000 (DGCCRF)                                                         | ✓ Not applicable: the site sends no marketing e-mail (leads go to lotus, see its own check)                               |
| Three-click cancellation | Consumer Code art. L215-1-1                                                                                                                                 | €15,000 (L241-3-1)                                                       | ✓ Not applicable: no subscription sold online; maintenance is a B2B contract signed on a quote                            |
| Legal notice             | LCEN art. 1-1 (formerly art. 6, III, moved by the SREN law of 2024-05-21); offence under art. 1-2                                                           | €75,000 and one year in prison                                           | **✗ Phone number missing** — everything else is there (name, address, SIREN, SIRET, APE, VAT, publication director, host) |

## To do

1. **Add a phone number to the legal notice** (`locales/legal/notice.fr.ts` and `.en.ts`, `identity` rows), in both languages, and bump the legal page's `updatedAt`. For a natural person publishing as a professional, article 1-1 asks for name, first names, address **and phone number**; an e-mail address or a form does not replace it. A dedicated or forwarding number is fine. Not done here because the number is Valentin's to choose.
2. Host: the law also asks for the host's phone number. Vercel does not publish one; the page gives its address and website (common practice, low risk).

## When to redo this check

When adding a third-party tool (analytics, chat, embedded map, session replay), an account, an online sale or subscription, or a newsletter.

## Sources

- Légifrance, law no. 2024-449 of 21 May 2024 (SREN), articles 1-1 and 1-2 of the LCEN
- CPCE art. L34-5; Consumer Code art. L215-1-1 and L241-3-1
- CNIL, recommendation on session replay tools (November 2026) and recommendation 4 on minors
- LG München I, 20 January 2022, 3 O 17493/20; LG München I, 30 March 2023, 4 O 13063/22 (mass claims ruled abusive)

## See also

- [Legal pages](../features/legal-pages.md)
- [Full audit of 2026-10-10](2026-10-10-full-audit.md)
