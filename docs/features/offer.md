---
title: Services page and offer block
description: The services page (/offre/) and the offer block of the home page: sections, where the prices and the texts live, how prices are written, structured data, how to change a price or add a service.
related_code:
  - ../../app/[locale]/offre/page.tsx
  - ../../app/[locale]/page.tsx
  - ../../lib/constants/offer.ts
  - ../../lib/helpers/offer.ts
  - ../../lib/models/offer.ts
  - ../../locales/offer/offer.fr.ts
  - ../../locales/offer/offer.en.ts
  - ../../components/fact-grid/fact-grid.tsx
  - ../../components/offer-line/offer-line.tsx
  - ../../lib/helpers/json-ld.ts
last_updated: 2026-10-16
---

# Services page and offer block

**Summary.** `/[locale]/offre/` presents the freelance services and their prices, on the
document template (summary on the left). The home page shows four of them in a compact
block that links to it. Prices are numbers in one file, `lib/constants/offer.ts`, written
out by `lib/helpers/offer.ts` in the typography of each language; texts are in
`locales/offer/`. Both come from Valentin's brief of 16 October 2026 and its mock-ups
(Design canvas "valentinbourreau.com — harmonisation", boards 08 to 14).

## The page

[app/[locale]/offre/page.tsx](../../app/[locale]/offre/page.tsx). The path is `/offre/` in
both languages, like `/cgv/`. Top to bottom:

1. **Page header:** trail `~/valentin-bourreau/offre`, title ("Offre", "Services"), lead,
   a mono line (freelance with the live dot, 100 % remote, prices excluding VAT), two
   buttons (contact, resume).
2. **Summary on the left** and five numbered sections, `#sec-01` to `#sec-05`:
   - `01 · positionnement`: two or three sentences and a key / value sheet.
   - `02 · offres`: the six services as changelog entries (`LogEntryComponent`): a mono
     code and the billing in the date column, the title, a short text, the deliverables
     (`AchievementListComponent`), then the duration and the prices (`FactGridComponent`).
   - `03 · tarifs`: a table (reference day rate, short or urgent assignment, fixed-price
     services billed by scope), then the VAT line.
   - `04 · méthode`: the way of working, as a `+` list.
   - `05 · contact`: one sentence and the button that opens the [contact dialog](contact-form.md).
3. **Page nav:** the terms of service, as the page to read next.

## The home page block

Between "ce que j’apporte" and the changelog, `#offer`: an `h2` "offre", one sentence,
the four services of `HOME_SERVICES` as `OfferLineComponent` (title, summary, starting
price), a "Voir l’offre complète →" button and "prix HT". The header nav has an `offre`
link (`services` in English), between `articles` and `contact`.

## Prices

- **One source.** `SERVICES` lists each service and the ways to buy it (`options`), each
  with a `Price`: `fixed` (an amount), `range` (a minimum and a maximum), `from` (a starting
  amount, written `dès 5 500 €`) or `quote`, with an optional unit (`day`, `month`). An option
  marked `addOn` (an extra page, the maintenance of a website) is bought with another one: it
  is shown on the page but never sets the starting price of its service. `DAY_RATES` holds the two day rates of the table. All
  amounts are in euros, excluding VAT. The page, the home block, the design system page and
  the structured data read them; never write a price in a text.
- **Written by language.** `formatEuros` uses `Intl.NumberFormat`: `1 900 €` in French
  (narrow non-breaking spaces, a non-breaking space before the sign), `€1,900` in English.
  `formatPrice` adds the unit and the range from the templates of `offre.price`
  (`850 €/j`, `3 500 € à 7 000 €`, `sur devis`). `formatStartingPrice` gives the home
  block its price: the only fixed price as it is, else the lowest one after "dès" / "from", add-ons left out.
- **VAT.** The business is under the VAT franchise (see the legal notice): the rates note
  says that prices are excluding taxes and that VAT does not apply (article 293 B of the CGI).

## Texts

`locales/offer/offer.fr.ts` and `offer.en.ts`, typed by `OfferTexts`
([lib/models/offer.ts](../../lib/models/offer.ts)), reach the dictionaries as `offre`.
Each service has its texts under the same id as in `SERVICES`, with one price label per
option id (`express`, `full`…): a test fails when one is missing. French is the reference;
English mirrors it entry for entry.

## Structured data

`PAGE_GRAPHS.offre`: the `WebPage` (whose `mainEntity` is the catalogue), an `OfferCatalog`
with one `Offer` per option (the express and the full audit are two), each offering a
`Service` provided by the `Person`, with a `UnitPriceSpecification` in EUR,
`valueAddedTaxIncluded: false`, a `price` or a `minPrice` / `maxPrice`, and `unitCode`
`DAY` or `MON`; an offer on quote has no price. Then the `BreadcrumbList`.

## Changing the offer

- **A price:** change it in `lib/constants/offer.ts`, update the expected values in
  `tests/unit/offer.test.ts` and `tests/smoke/site.test.ts`, bump `updatedAt` of `offre`
  (and of `home` if the service is on the home page) in `lib/constants/pages.ts`.
- **A service:** add its id to `ServiceId`, its entry to `SERVICES`, its texts in both
  locale files; add it to `HOME_SERVICES` only if it belongs on the home page (four lines).
- **A text:** edit both locale files; keep French typography (` ` before `:` and
  between a number and its unit).

## Tests

- `tests/unit/offer.test.ts`: the typography of prices, the starting prices, the prices of
  the brief, a label for every option in both languages, French typography.
- `tests/unit/json-ld.test.ts`: the catalogue, its six offers and their prices.
- `tests/smoke/site.test.ts`: the page in both languages, its prices, the home block and
  the sitemap.
- `tests/e2e/offer.spec.ts`: from the home block to the page, the summary on the left, the
  six services, the table, the contact dialog, the English page; the page is also in the
  accessibility pass of every public page.

## Custom websites and apps

The `creation` service sells small, closed scopes at a fixed price, for clients who need a
website or an app rather than a platform: landing page, showcase website (5 pages), extra
page, online shop (from), web app with one user journey (from), monthly maintenance. The
scope stays custom (no bought theme) on a reusable technical base, which is what keeps the
prices below the day rate. A headless shop or a larger app is priced on quote, under
`build`. Prices and option ids: `lib/constants/offer.ts`; labels: `services.creation.prices`.
