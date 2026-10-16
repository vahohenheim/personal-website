import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLdComponent from "@/components/json-ld/json-ld";
import LogEntryComponent from "@/components/log-entry/log-entry";
import PageHeaderComponent from "@/components/page-header/page-header";
import PostTagsComponent from "@/components/post-tags/post-tags";
import SiteFooterComponent from "@/components/site-footer/site-footer";
import { Badge } from "@/components/ui/badge";
import { getPostsMetadata } from "@/lib/helpers/metadata";
import { formatPostDate, getFeedPath, getPostPath, getPosts } from "@/lib/helpers/posts";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { getPostOutline } from "@/lib/posts/source";

export const generateMetadata = (): Promise<Metadata> => getPostsMetadata();

export default async function PostsPage() {
  const locale = await getLocale();
  const { posts, a11y } = await getDictionary();
  const items = getPosts(locale);

  // No list while nothing is published: the header does not link to it either.
  if (items.length === 0) {
    notFound();
  }

  return (
    <>
      <main id="main" className="container-page">
        <JsonLdComponent page="posts" />
        <PageHeaderComponent
          breadcrumb={{
            label: a11y.breadcrumb,
            homeHref: `/${locale}/`,
            trail: [{ label: posts.breadcrumb }],
          }}
          title={posts.title}
          lead={posts.lead}
          meta={
            <p className="type-label">
              <a href={getFeedPath(locale)} className="text-muted no-underline hover:text-accent">
                {posts.feed}
              </a>
            </p>
          }
        />
        <ol className="list-none pb-[clamp(56px,7vw,96px)]">
          {items.map((post) => (
            <LogEntryComponent
              key={post.slug}
              level={2}
              date={
                <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, locale)}</time>
              }
              detail={posts.readingTime.replace(
                "{minutes}",
                `${getPostOutline(post.slug, locale).minutes}`,
              )}
              title={
                <Link
                  href={getPostPath(post.slug, locale)}
                  className="text-text no-underline hover:text-accent"
                >
                  {post.title}
                </Link>
              }
            >
              {post.draft && (
                <Badge variant="secondary" className="self-start">
                  {posts.draft}
                </Badge>
              )}
              <p className="max-w-[64ch] text-text2">{post.description}</p>
              <PostTagsComponent tags={post.tags} label={posts.tags} />
            </LogEntryComponent>
          ))}
        </ol>
      </main>
      <SiteFooterComponent />
    </>
  );
}
