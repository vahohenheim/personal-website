export const LOCALES = ["en", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Remembers the language picked in the header, read by `proxy.ts` on the next visit. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
};

export const hasLocale = (value: string | undefined): value is Locale =>
  LOCALES.includes(value as Locale);
