import type { MetadataRoute } from "next";
import { PAGE_IDS, PAGES } from "@/lib/constants/pages";
import { getPageUrl } from "@/lib/helpers/metadata";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGE_IDS.map((page) => ({
    url: getPageUrl(page, DEFAULT_LOCALE),
    lastModified: PAGES[page].updatedAt,
    changeFrequency: "monthly",
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map((locale) => [
          locale,
          getPageUrl(page, locale),
        ]),
      ),
    },
  }));
}
