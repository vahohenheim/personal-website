import { POSTS } from "@/lib/constants/posts";
import { SITE_URL } from "@/lib/constants/site";
import { type Locale, LOCALES } from "@/lib/i18n/config";
import { type LocalizedPost } from "@/lib/models/post";

/** Drafts are shown while writing, never on the deployed site. */
const areDraftsVisible = () => process.env.NODE_ENV === "development";

/** Posts available in a language, most recent first. */
export const getPosts = (locale: Locale): LocalizedPost[] =>
  POSTS.flatMap(({ versions, ...post }) => {
    const version = versions[locale];

    return version && (!post.draft || areDraftsVisible()) ? [{ ...post, ...version, locale }] : [];
  }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const getPost = (slug: string, locale: Locale) =>
  getPosts(locale).find((post) => post.slug === slug);

/** Languages in which the list of posts has something to show. */
export const getPostsLocales = () => LOCALES.filter((locale) => getPosts(locale).length > 0);

/** Languages in which a post can be read. */
export const getPostLocales = (slug: string) =>
  LOCALES.filter((locale) => getPost(slug, locale) !== undefined);

export const getPostsPath = (locale: Locale) => `/${locale}/posts/`;

export const getPostPath = (slug: string, locale: Locale) => `/${locale}/posts/${slug}/`;

export const getPostUrl = (slug: string, locale: Locale) =>
  `${SITE_URL}${getPostPath(slug, locale)}`;

export const getFeedPath = (locale: Locale) => `/${locale}/posts/feed.xml`;

/**
 * Where the language link of the header must go when the current page has no version in
 * the other language: the list of posts when there is one, the home page otherwise.
 * Keyed by the path of the current page.
 */
export const getLanguageFallbacks = (locale: Locale, otherLocale: Locale) => {
  const fallback =
    getPosts(otherLocale).length > 0 ? getPostsPath(otherLocale) : `/${otherLocale}/`;
  const paths = [
    ...(getPosts(otherLocale).length > 0 ? [] : [getPostsPath(locale)]),
    ...getPosts(locale)
      .filter((post) => !getPost(post.slug, otherLocale))
      .map((post) => getPostPath(post.slug, locale)),
  ];

  return Object.fromEntries(paths.map((path) => [path, fallback]));
};
