import dayjs from "dayjs";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLdComponent from "@/components/json-ld/json-ld";
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
import { POSTS } from "@/lib/constants/posts";
import { getPostMetadata } from "@/lib/helpers/metadata";
import { getPost, getPostsPath } from "@/lib/helpers/posts";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
// Registers the French month names used below.
import "dayjs/locale/fr";

// Only the posts of the registry exist: any other slug is a 404, never rendered on demand.
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

  // A draft in production, or a post that is not written in this language.
  if (!post) {
    notFound();
  }

  const { default: Content } = await post.load();
  const format = (date: string) => dayjs(date).locale(locale).format("D MMMM YYYY");

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
                <Link href={`/${locale}/`}>~/valentin-bourreau</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={getPostsPath(locale)}>{posts.breadcrumb}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.slug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="max-w-[22ch] text-[clamp(32px,4.4vw,48px)] leading-[1.05] font-semibold tracking-[-0.03em]">
          {post.title}
        </h1>
        <ul className="flex list-none flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[13px] text-muted">
          <li>
            <time dateTime={post.publishedAt}>
              {posts.published.replace("{date}", format(post.publishedAt))}
            </time>
          </li>
          {post.updatedAt !== post.publishedAt && (
            <li>
              <time dateTime={post.updatedAt}>
                {posts.updated.replace("{date}", format(post.updatedAt))}
              </time>
            </li>
          )}
          {post.draft && (
            <li>
              <Badge variant="secondary">{posts.draft}</Badge>
            </li>
          )}
        </ul>
        <article className="mt-4 flex max-w-[68ch] flex-col gap-5 border-t border-line pt-8">
          <Content />
        </article>
        <p className="mt-4 font-mono text-[13px]">
          <Link href={getPostsPath(locale)} className="text-muted no-underline hover:text-accent">
            {posts.back}
          </Link>
        </p>
      </main>
      <SiteFooterComponent />
    </>
  );
}
