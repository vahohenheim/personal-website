import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocumentLayoutComponent from "@/components/document-layout/document-layout";
import JsonLdComponent from "@/components/json-ld/json-ld";
import PageHeaderComponent from "@/components/page-header/page-header";
import PageNavComponent from "@/components/page-nav/page-nav";
import PostTagsComponent from "@/components/post-tags/post-tags";
import SiteFooterComponent from "@/components/site-footer/site-footer";
import { Badge } from "@/components/ui/badge";
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
      <main id="main" className="container-page">
        <JsonLdComponent post={post} />
        <PageHeaderComponent
          breadcrumb={{
            label: a11y.breadcrumb,
            homeHref: `/${locale}/`,
            trail: [{ label: posts.breadcrumb, href: getPostsPath(locale) }, { label: post.slug }],
          }}
          title={post.title}
          compact
          lead={post.lead}
          meta={
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 type-label text-muted">
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
          }
        >
          <PostTagsComponent tags={post.tags} label={posts.tags} />
        </PageHeaderComponent>

        <DocumentLayoutComponent
          entries={toc.map(({ id, n, title }) => ({ id, number: n, title }))}
          toc={{
            label: posts.toc,
            summary: posts.tocSummary.replace("{count}", `${toc.length}`),
            navLabel: posts.toc,
          }}
          className="gap-5"
        >
          <Content />
        </DocumentLayoutComponent>

        <PageNavComponent
          label={a11y.pageNav}
          next={
            next && { eyebrow: posts.next, title: next.title, href: getPostPath(next.slug, locale) }
          }
          back={{ label: posts.back, href: getPostsPath(locale) }}
        />
      </main>
      <SiteFooterComponent />
    </>
  );
}
