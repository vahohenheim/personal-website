import { SERVICES } from "@/lib/constants/offer";
import { type Locale } from "@/lib/i18n/config";
import { type OfferTexts, type Price, type Service, type ServiceId } from "@/lib/models/offer";

// The number formats of each language: `1 900 €` (narrow non-breaking spaces) and `€1,900`.
const NUMBER_LOCALES: Record<Locale, string> = { fr: "fr-FR", en: "en-US" };

/** An amount in euros, without cents, in the typography of the language. */
export const formatEuros = (amount: number, locale: Locale) =>
  new Intl.NumberFormat(NUMBER_LOCALES[locale], {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);

const withUnit = (text: string, price: Price, templates: OfferTexts["price"]) =>
  price.type !== "quote" && price.unit ? templates[price.unit].replace("{price}", text) : text;

/**
 * A price as written on the page: `1 900 €`, `850 €/j`, `3 500 € à 7 000 €`, `dès 5 500 €`,
 * `sur devis`.
 */
export const formatPrice = (price: Price, locale: Locale, templates: OfferTexts["price"]) => {
  if (price.type === "quote") {
    return templates.quote;
  }

  if (price.type === "from") {
    return templates.from.replace(
      "{price}",
      withUnit(formatEuros(price.amount, locale), price, templates),
    );
  }

  const text =
    price.type === "fixed"
      ? formatEuros(price.amount, locale)
      : templates.range
          .replace("{min}", formatEuros(price.min, locale))
          .replace("{max}", formatEuros(price.max, locale));

  return withUnit(text, price, templates);
};

/**
 * The price shown for a service on the home page: the price itself when there is only one
 * fixed price, else the lowest one after `dès`.
 */
export const formatStartingPrice = (
  service: Service,
  locale: Locale,
  templates: OfferTexts["price"],
) => {
  // An add-on (an extra page, the maintenance) is bought with another option: it does not
  // start the service.
  const prices = service.options.filter((option) => !option.addOn).map((option) => option.price);
  const [only] = prices;

  if (prices.length === 1 && only.type !== "range") {
    // A single starting price already reads `dès …`.
    return formatPrice(only, locale, templates);
  }

  // Where each price starts, with the price it belongs to for its unit.
  const starts = prices.flatMap((price): { amount: number; price: Price }[] =>
    price.type === "fixed" || price.type === "from"
      ? [{ amount: price.amount, price }]
      : price.type === "range"
        ? [{ amount: price.min, price }]
        : [],
  );

  if (starts.length === 0) {
    return templates.quote;
  }

  const lowest = starts.reduce((best, start) => (start.amount < best.amount ? start : best));

  return templates.from.replace(
    "{price}",
    withUnit(formatEuros(lowest.amount, locale), lowest.price, templates),
  );
};

/** A service of the registry, by id. */
export const getService = (id: ServiceId): Service => {
  const service = SERVICES.find((candidate) => candidate.id === id);

  if (!service) {
    throw new Error(`Unknown service: ${id}`);
  }

  return service;
};
