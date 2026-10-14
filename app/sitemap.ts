import type { MetadataRoute } from "next";
import { PAGE_IDS, PAGES } from "@/lib/constants/pages";
import { POSTS } from "@/lib/constants/posts";
import { SITE_URL } from "@/lib/constants/site";
import { getPageUrl } from "@/lib/helpers/metadata";
import { getIndexablePosts, getIndexablePostsLocales, getPostUrl } from "@/lib/helpers/posts";
import { DEFAULT_LOCALE, type Locale, LOCALES } from "@/lib/i18n/config";

/** Every language version of a page, itself included, plus `x-default` when it exists. */
const getLanguages = (locales: readonly Locale[], getUrl: (locale: Locale) => string) => ({
  ...Object.fromEntries(locales.map((locale) => [locale, getUrl(locale)])),
  ...(locales.includes(DEFAULT_LOCALE) && { "x-default": getUrl(DEFAULT_LOCALE) }),
});

/**
 * One entry per page and per locale, then one per post and per language it is written in.
 * Each entry lists every language version of the page: this is what search engines expect
 * for `hreflang` declared in a sitemap. Drafts and protected posts are left out; a post
 * lists its cover image, then the images of its body named in the registry.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = PAGE_IDS.flatMap((page) => {
    const { updatedAt, priority, changeFrequency } = PAGES[page];
    // The list of posts only exists in the languages that have a published post.
    const locales = page === "posts" ? getIndexablePostsLocales() : LOCALES;
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
    const versions = LOCALES.flatMap(
      (locale) => getIndexablePosts(locale).find(({ slug }) => slug === post.slug) ?? [],
    );
    const languages = getLanguages(
      versions.map(({ locale }) => locale),
      (locale) => getPostUrl(post.slug, locale),
    );

    return versions.map((version) => {
      const images = [version.cover, ...(version.images ?? [])].flatMap((image) =>
        image ? [`${SITE_URL}${image.src}`] : [],
      );

      return {
        url: getPostUrl(version.slug, version.locale),
        lastModified: version.updatedAt,
        changeFrequency: "yearly" as const,
        priority: 0.5,
        alternates: { languages },
        ...(images.length > 0 && { images }),
      };
    });
  });

  return [...pages, ...posts];
}
