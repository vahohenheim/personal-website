import { SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { getFeedPath, getPosts, getPostsPath, getPostUrl } from "@/lib/helpers/posts";
import { hasLocale, LOCALES } from "@/lib/i18n/config";
import en from "@/locales/en";
import fr from "@/locales/fr";

// Built once with the site, like the pages it lists.
export const dynamic = "force-static";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const DICTIONARIES = { en, fr };

const escape = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** RSS feed of the posts of one language. */
export async function GET(_request: Request, { params }: RouteContext<"/[locale]/posts/feed.xml">) {
  const { locale } = await params;
  const posts = hasLocale(locale) ? getPosts(locale) : [];

  if (!hasLocale(locale) || posts.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  const texts = DICTIONARIES[locale].posts;
  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escape(post.title)}</title>
      <link>${getPostUrl(post.slug, locale)}</link>
      <guid isPermaLink="true">${getPostUrl(post.slug, locale)}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escape(post.description)}</description>
    </item>`,
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${SITE_NAME} · ${texts.title}`)}</title>
    <link>${SITE_URL}${getPostsPath(locale)}</link>
    <description>${escape(texts.metadata.description)}</description>
    <language>${locale}</language>
    <atom:link href="${SITE_URL}${getFeedPath(locale)}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>
`;

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
