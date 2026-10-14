import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLdComponent from "@/components/json-ld/json-ld";
import PostTagsComponent from "@/components/post-tags/post-tags";
import PostTocComponent from "@/components/post-toc/post-toc";
import SiteFooterComponent from "@/components/site-footer/site-footer";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { POST_BODIES } from "@/lib/constants/post-bodies";
import { POSTS } from "@/lib/constants/posts";
import { getPostMetadata } from "@/lib/helpers/metadata";
import {
  formatPostDate,
  getNextPost,
  getPost,
  getPostPath,
  getPostsPath,
} from "@/lib/helpers/posts";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { getPostOutline } from "@/lib/posts/source";

// Only the posts of the registry exist: any other slug is a 404, never rendered on demand.
// Every post is built ahead of time, protected ones included: proxy.ts guards those.
export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/posts/[slug]">): Promise<Metadata> => {
  const post = getPost((await params).slug, await getLocale());

  return post ? getPostMetadata(post) : {};
};

export default async function PostPage({ params }: PageProps<"/[locale]/posts/[slug]">) {
  const locale = await getLocale();
  const { posts, a11y } = await getDictionary();
  const post = getPost((await params).slug, locale);
  const load = post && POST_BODIES[post.slug]?.[locale];

  // A draft in production, or a post that is not written in this language.
  if (!post || !load) {
    notFound();
  }

  const { default: Content } = await load();
  const { minutes, toc } = getPostOutline(post.slug, locale);
  const next = getNextPost(post.slug, locale);

  return (
    <>
      <main
        id="main"
        className="container-page flex flex-col gap-6 pt-[clamp(48px,8vw,112px)] pb-[clamp(56px,7vw,96px)]"
      >
        <JsonLdComponent post={post} />
        <Breadcrumb aria-label={a11y.breadcrumb}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={getPostsPath(locale)}>~/{posts.breadcrumb}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.slug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="max-w-[24ch] text-[clamp(32px,4.4vw,48px)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance">
          {post.title}
        </h1>
        <p className="max-w-[64ch] text-[clamp(18px,1.6vw,20px)] leading-[1.5] text-text2">
          {post.lead}
        </p>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[13px] text-muted">
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, locale)}</time>
          <span aria-hidden>·</span>
          <span>{posts.readingTime.replace("{minutes}", `${minutes}`)}</span>
          {post.updatedAt !== post.publishedAt && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.updatedAt}>
                {posts.updated.replace("{date}", formatPostDate(post.updatedAt, locale))}
              </time>
            </>
          )}
          {post.draft && (
            <Badge variant="secondary" className="ml-2">
              {posts.draft}
            </Badge>
          )}
        </p>
        <PostTagsComponent tags={post.tags} label={posts.tags} />

        <div className="mt-6 flex flex-col gap-10 border-t border-line pt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-14">
          {toc.length > 0 && (
            <aside className="lg:sticky lg:top-8 lg:order-2 lg:self-start">
              <PostTocComponent title={posts.toc} entries={toc} />
            </aside>
          )}
          <article className="flex min-w-0 flex-col gap-5 lg:order-1">
            <Content />
          </article>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 font-mono text-[13px]">
          {next && (
            <Link
              href={getPostPath(next.slug, locale)}
              className="flex flex-col gap-1 no-underline hover:text-accent"
            >
              <span className="text-muted">{posts.next}</span>
              <span className="font-sans text-[19px] leading-[1.3] font-semibold tracking-[-0.01em]">
                {next.title}
              </span>
            </Link>
          )}
          <Link href={getPostsPath(locale)} className="text-muted no-underline hover:text-accent">
            {posts.back}
          </Link>
        </div>
      </main>
      <SiteFooterComponent />
    </>
  );
}
