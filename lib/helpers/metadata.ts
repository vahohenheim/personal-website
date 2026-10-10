import type { Metadata } from "next";
import { PAGES, type PageId } from "@/lib/constants/pages";
import { SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { DEFAULT_LOCALE, type Locale, LOCALES, OPEN_GRAPH_LOCALES } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { type Dictionary } from "@/locales/en";

/** Path of a page in every locale, used for `hreflang` alternates and the sitemap. */
export const getLocalizedPaths = (page: PageId) =>
  Object.fromEntries(LOCALES.map((locale) => [locale, `/${locale}${PAGES[page].path}`])) as Record<
    Locale,
    string
  >;

/** Absolute URL of a page in one locale. */
export const getPageUrl = (page: PageId, locale: Locale) =>
  `${SITE_URL}${getLocalizedPaths(page)[locale]}`;

/** Translated title and description of a page, shared by the meta tags and the structured data. */
export const getPageTexts = (page: PageId, dictionary: Dictionary) =>
  ({
    home: dictionary.metadata,
    resume: dictionary.resume.metadata,
    legal: dictionary.legal.metadata,
  })[page];

/** Translated meta tags of a page, with its canonical URL and language alternates. */
export const getPageMetadata = async (page: PageId): Promise<Metadata> => {
  const locale = await getLocale();
  const { title, description } = getPageTexts(page, await getDictionary());
  const paths = getLocalizedPaths(page);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: paths[locale],
      languages: { ...paths, "x-default": paths[DEFAULT_LOCALE] },
    },
    twitter: { card: "summary_large_image" },
    openGraph: {
      type: "website",
      url: paths[locale],
      siteName: SITE_NAME,
      locale: OPEN_GRAPH_LOCALES[locale],
    },
  };
};
