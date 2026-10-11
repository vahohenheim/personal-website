import type { MetadataRoute } from "next";
import { PAGE_IDS, PAGES } from "@/lib/constants/pages";
import { POSTS } from "@/lib/constants/posts";
import { getPageUrl } from "@/lib/helpers/metadata";
import { getPost, getPostLocales, getPostsLocales, getPostUrl } from "@/lib/helpers/posts";
import { DEFAULT_LOCALE, type Locale, LOCALES } from "@/lib/i18n/config";

/** Every language version of a page, itself included, plus `x-default` when it exists. */
const getLanguages = (locales: readonly Locale[], getUrl: (locale: Locale) => string) => ({
  ...Object.fromEntries(locales.map((locale) => [locale, getUrl(locale)])),
  ...(locales.includes(DEFAULT_LOCALE) && { "x-default": getUrl(DEFAULT_LOCALE) }),
});

/**
 * One entry per page and per locale, then one per post and per language it is written in.
 * Each entry lists every language version of the page: this is what search engines expect
 * for `hreflang` declared in a sitemap. Drafts are left out.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = PAGE_IDS.flatMap((page) => {
    const { updatedAt, priority, changeFrequency } = PAGES[page];
    // The list of posts only exists in the languages that have a published post.
    const locales = page === "posts" ? getPostsLocales() : LOCALES;
    const languages = getLanguages(locales, (locale) => getPageUrl(page, locale));

    return locales.map((locale) => ({
      url: getPageUrl(page, locale),
      lastModified: updatedAt,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });

  const posts = POSTS.flatMap((post) => {
    const locales = getPostLocales(post.slug);
    const languages = getLanguages(locales, (locale) => getPostUrl(post.slug, locale));

    return locales.map((locale) => ({
      url: getPostUrl(post.slug, locale),
      lastModified: getPost(post.slug, locale)?.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.5,
      alternates: { languages },
    }));
  });

  return [...pages, ...posts];
}
