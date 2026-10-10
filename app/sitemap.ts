import type { MetadataRoute } from "next";
import { PAGE_IDS, PAGES } from "@/lib/constants/pages";
import { getPageUrl } from "@/lib/helpers/metadata";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";

/**
 * One entry per page and per locale. Each entry lists every language version of the page,
 * itself included, plus `x-default`: this is what search engines expect for `hreflang`
 * declared in a sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGE_IDS.flatMap((page) => {
    const { updatedAt, priority, changeFrequency } = PAGES[page];
    const languages = {
      ...Object.fromEntries(LOCALES.map((locale) => [locale, getPageUrl(page, locale)])),
      "x-default": getPageUrl(page, DEFAULT_LOCALE),
    };

    return LOCALES.map((locale) => ({
      url: getPageUrl(page, locale),
      lastModified: updatedAt,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
