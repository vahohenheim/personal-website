import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BreadcrumbComponent from "@/components/breadcrumb/breadcrumb";
import JsonLdComponent from "@/components/json-ld/json-ld";
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
      <main
        id="main"
        className="container-page flex flex-col gap-6 pt-[clamp(48px,8vw,112px)] pb-[clamp(56px,7vw,96px)]"
      >
        <JsonLdComponent page="posts" />
        <BreadcrumbComponent
          label={a11y.breadcrumb}
          homeHref={`/${locale}/`}
          current={posts.breadcrumb}
        />
        <h1 className="text-[clamp(38px,5.6vw,64px)] leading-none font-semibold tracking-[-0.04em]">
          {posts.title}
        </h1>
        <p className="max-w-[64ch] text-[18px] leading-[1.5] text-text2">{posts.lead}</p>
        <p className="font-mono text-[13px]">
          <a href={getFeedPath(locale)} className="text-muted no-underline hover:text-accent">
            {posts.feed}
          </a>
        </p>
        <ol className="mt-4 list-none">
          {items.map((post) => (
            <li
              key={post.slug}
              className="flex flex-wrap gap-x-8 gap-y-2 border-t border-line py-6"
            >
              <div className="flex flex-[0_0_160px] flex-col gap-1 font-mono text-[13px] leading-[1.9] text-muted">
                <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, locale)}</time>
                <span className="text-[12px]">
                  {posts.readingTime.replace(
                    "{minutes}",
                    `${getPostOutline(post.slug, locale).minutes}`,
                  )}
                </span>
              </div>
              <div className="flex min-w-[min(100%,280px)] flex-1 flex-col gap-3">
                <h2 className="text-[21px] leading-[1.3] font-semibold tracking-[-0.01em]">
                  <Link
                    href={getPostPath(post.slug, locale)}
                    className="text-text no-underline hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </h2>
                {post.draft && (
                  <Badge variant="secondary" className="self-start">
                    {posts.draft}
                  </Badge>
                )}
                <p className="max-w-[64ch] text-text2">{post.description}</p>
                <PostTagsComponent tags={post.tags} label={posts.tags} />
              </div>
            </li>
          ))}
        </ol>
      </main>
      <SiteFooterComponent />
    </>
  );
}
