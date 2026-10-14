import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getReadingStats, getTableOfContents } from "@/lib/helpers/posts";
import { type Locale } from "@/lib/i18n/config";

// The MDX source of a post, read from content/posts/. Pages of posts are built ahead of
// time, so this runs at build time (and in development): the figures it gives are
// computed, never written by hand.

const getSourcePath = (slug: string, locale: Locale) =>
  join(process.cwd(), "content", "posts", slug, `${locale}.mdx`);

export const readPostSource = (slug: string, locale: Locale) =>
  readFileSync(getSourcePath(slug, locale), "utf8");

/** Word count, reading time and summary of one language version of a post. */
export const getPostOutline = (slug: string, locale: Locale) => {
  const source = readPostSource(slug, locale);

  return { ...getReadingStats(source), toc: getTableOfContents(source) };
};
