import { POSTS } from "@/lib/constants/posts";
import { SITE_URL } from "@/lib/constants/site";
import { type Locale, LOCALES } from "@/lib/i18n/config";
import { type LocalizedPost, type Post } from "@/lib/models/post";

// Reading the registry. Pure functions only: no file access, so that proxy.ts and the
// tests can import this module. See docs/features/posts.md.

/** Average reading speed used for the reading time. */
export const WORDS_PER_MINUTE = 220;

/**
 * Drafts are shown while writing (`npm run dev`) and on Vercel preview deployments, so
 * that a post can be read from a phone before it is published. Never in production.
 */
export const areDraftsVisible = () =>
  process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";

export const isProtected = (post: Pick<Post, "visibility">) => post.visibility === "protected";

const localize = (post: Post, locale: Locale): LocalizedPost[] => {
  const { versions, ...rest } = post;
  const version = versions[locale];

  return version ? [{ ...rest, ...version, locale }] : [];
};

const isVisible = (post: Post) => !post.draft || areDraftsVisible();

/** Most recent first. Posts of the same day keep the order of the registry (stable sort). */
const byDate = (a: LocalizedPost, b: LocalizedPost) => b.publishedAt.localeCompare(a.publishedAt);

/**
 * Posts listed in a language: the list, the home page, the header, the "next post" link.
 * Protected posts are never listed; drafts only where drafts are visible.
 */
export const getPosts = (locale: Locale): LocalizedPost[] =>
  POSTS.filter((post) => !isProtected(post) && isVisible(post))
    .flatMap((post) => localize(post, locale))
    .sort(byDate);

/** Posts search engines may know about: the sitemap and the feed. Never a draft. */
export const getIndexablePosts = (locale: Locale): LocalizedPost[] =>
  getPosts(locale).filter((post) => !post.draft);

/** A post that can be read at its URL, protected ones included (behind the password). */
export const getPost = (slug: string, locale: Locale): LocalizedPost | undefined =>
  POSTS.filter((post) => post.slug === slug && isVisible(post)).flatMap((post) =>
    localize(post, locale),
  )[0];

/** Slugs of the posts served behind the password. Read by proxy.ts. */
export const getProtectedSlugs = () => POSTS.filter(isProtected).map((post) => post.slug);

/** Languages in which the list of posts has something to show. */
export const getPostsLocales = () => LOCALES.filter((locale) => getPosts(locale).length > 0);

/** Languages in which the list of posts has something to index. */
export const getIndexablePostsLocales = () =>
  LOCALES.filter((locale) => getIndexablePosts(locale).length > 0);

/** Languages in which a post can be read. */
export const getPostLocales = (slug: string) =>
  LOCALES.filter((locale) => getPost(slug, locale) !== undefined);

/**
 * The post after this one in the list, looping back to the most recent. None when the
 * list has nothing else to offer. A protected post is never the next one.
 */
export const getNextPost = (slug: string, locale: Locale): LocalizedPost | undefined => {
  const posts = getPosts(locale);
  const index = posts.findIndex((post) => post.slug === slug);
  const next = posts[(index + 1) % posts.length] as LocalizedPost | undefined;

  return next && next.slug !== slug ? next : undefined;
};

/** How many posts the home page shows; the list has the others. */
export const HOME_POSTS_COUNT = 3;

/** The posts of the home page block: none means no block. */
export const getHomePosts = (locale: Locale) => getPosts(locale).slice(0, HOME_POSTS_COUNT);

/** The listed post about a project of the home page, if there is one. */
export const getPostForProject = (id: string, locale: Locale) =>
  getPosts(locale).find((post) => (post.project?.personalProjectId as string | undefined) === id);

export const getPostsPath = (locale: Locale) => `/${locale}/posts/`;

export const getPostPath = (slug: string, locale: Locale) => `/${locale}/posts/${slug}/`;

export const getPostUrl = (slug: string, locale: Locale) =>
  `${SITE_URL}${getPostPath(slug, locale)}`;

/** The generated sharing image of a post (app/[locale]/posts/[slug]/opengraph-image.tsx). */
export const getPostImageUrl = (slug: string, locale: Locale) =>
  `${getPostUrl(slug, locale)}opengraph-image/`;

export const getFeedPath = (locale: Locale) => `/${locale}/posts/feed.xml`;

/**
 * Where the language link of the header must go when the current page has no version in
 * the other language: the list of posts when there is one, the home page otherwise.
 * Posts are matched by the header itself against the posts listed in the other
 * language, so that a protected post is never named in what the header sends to the
 * browser, nor ever becomes the target of the link.
 */
export const getLanguageFallbacks = (locale: Locale, otherLocale: Locale) => {
  const hasOtherList = getPosts(otherLocale).length > 0;
  const fallback = hasOtherList ? getPostsPath(otherLocale) : `/${otherLocale}/`;

  return {
    paths: hasOtherList ? {} : { [getPostsPath(locale)]: fallback },
    post: fallback,
    otherPosts: getPosts(otherLocale).map((post) => getPostPath(post.slug, otherLocale)),
  };
};

/* --------------------------------------------------------------------------------------
 * Reading the MDX source. The source is read by lib/posts/source.ts; what follows only
 * parses a string, so it is pure and tested on its own.
 * ----------------------------------------------------------------------------------- */

export type JsxTag = {
  name: string;
  /** String attributes as written; `true` for a boolean one; expressions as raw text. */
  attributes: Record<string, string | true>;
  closing: boolean;
  start: number;
  end: number;
};

/** Index right after the `{…}` expression opened at `start`, strings and nesting included. */
const skipExpression = (source: string, start: number) => {
  let depth = 0;
  let quote: string | null = null;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (char === "\\") {
        index += 1;
      } else if (char === quote) {
        quote = null;
      }
    } else if (char === '"' || char === "'" || char === "`") {
      quote = char;
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return index + 1;
      }
    }
  }

  return source.length;
};

/** Reads the JSX tag that starts at `start` (a `<`), or returns null if there is none. */
const readTag = (source: string, start: number): JsxTag | null => {
  let index = start + 1;
  const closing = source[index] === "/";

  if (closing) {
    index += 1;
  }

  const name = /^[A-Za-z][\w.]*/.exec(source.slice(index))?.[0];

  if (!name) {
    return null;
  }

  index += name.length;
  const attributes: Record<string, string | true> = {};

  while (index < source.length) {
    while (/\s/.test(source[index])) {
      index += 1;
    }

    if (source[index] === ">") {
      return { name, attributes, closing, start, end: index + 1 };
    }

    if (source.startsWith("/>", index)) {
      return { name, attributes, closing, start, end: index + 2 };
    }

    const attribute = /^[^\s=/>]+/.exec(source.slice(index))?.[0];

    if (!attribute) {
      return null;
    }

    index += attribute.length;

    if (source[index] !== "=") {
      attributes[attribute] = true;
      continue;
    }

    index += 1;
    const quote = source[index];

    if (quote === '"' || quote === "'") {
      const close = source.indexOf(quote, index + 1);

      if (close < 0) {
        return null;
      }

      attributes[attribute] = source.slice(index + 1, close);
      index = close + 1;
    } else if (quote === "{") {
      const end = skipExpression(source, index);

      attributes[attribute] = source.slice(index, end);
      index = end;
    } else {
      return null;
    }
  }

  return null;
};

/** Fenced code blocks (```), which hold no JSX and no prose. */
const CODE_FENCE = /^```[^\n]*\n[\s\S]*?^```[^\n]*$/gm;

/** The source with fenced code blocks blanked out, offsets kept. */
const blankCode = (source: string) =>
  source.replace(CODE_FENCE, (block) => block.replace(/[^\n]/g, " "));

/** Every JSX tag of an MDX source, in order, outside code blocks. */
export const readJsxTags = (source: string): JsxTag[] => {
  const text = blankCode(source);
  const tags: JsxTag[] = [];

  for (let index = text.indexOf("<"); index >= 0; index = text.indexOf("<", index + 1)) {
    const tag = readTag(text, index);

    if (tag) {
      tags.push(tag);
      index = tag.end - 1;
    }
  }

  return tags;
};

/** Anchor of a section, derived from its title: `L’architecture` → `l-architecture`. */
export const getSectionId = (title: string) =>
  title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export type TableOfContentsEntry = { n: string; label?: string; title: string; id: string };

/** The summary of a post: one entry per numbered `<Section n title>`, in order. */
export const getTableOfContents = (source: string): TableOfContentsEntry[] =>
  readJsxTags(source).flatMap(({ name, closing, attributes: { n, label, title } }) =>
    name === "Section" && !closing && typeof n === "string" && typeof title === "string"
      ? [{ n, title, id: getSectionId(title), ...(typeof label === "string" && { label }) }]
      : [],
  );

/**
 * The prose of a post: the text outside JSX tags, attributes and code blocks, without
 * Markdown syntax. Text between an opening and a closing tag (a `<Plus>` item) is prose.
 */
export const getProse = (source: string) => {
  let text = blankCode(source);

  for (const tag of readJsxTags(source).reverse()) {
    text = `${text.slice(0, tag.start)} ${text.slice(tag.end)}`;
  }

  return (
    text
      // MDX comments and other expressions: `{/* … */}`.
      .replace(/\{[^{}]*\}/g, " ")
      // Links and images keep their text only.
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[#*_`>|]/g, " ")
  );
};

/** Word count and reading time of a post, from its MDX source. */
export const getReadingStats = (source: string) => {
  const words = getProse(source)
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;

  return { words, minutes: Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)) };
};

/** ISO 8601 duration of a reading time, for `timeRequired`: `PT12M`. */
export const toIsoDuration = (minutes: number) => `PT${minutes}M`;

export type PostImage =
  { kind: "pair"; light: string; dark: string } | { kind: "single"; src: string };

/**
 * A `src` without extension names a pair of images, one per theme:
 * `/posts/pensee/ecran-notes` → `ecran-notes-jour.webp` and `ecran-notes-nuit.webp`.
 * A `src` with an extension is one image, shown in both themes.
 */
export const resolvePostImage = (src: string): PostImage =>
  /\.[a-z0-9]+$/i.test(src)
    ? { kind: "single", src }
    : { kind: "pair", light: `${src}-jour.webp`, dark: `${src}-nuit.webp` };

/** Short date of a post, `13 oct. 2026` or `Oct 13, 2026`. Dates are days, read in UTC. */
export const formatPostDate = (date: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
