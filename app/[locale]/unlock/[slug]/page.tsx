import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostUnlockFormComponent from "@/components/post-unlock-form/post-unlock-form";
import SiteFooterComponent from "@/components/site-footer/site-footer";
import { SITE_URL } from "@/lib/constants/site";
import { getProtectedSlugs } from "@/lib/helpers/posts";
import { getDictionary } from "@/lib/i18n/dictionaries";

// Shown by proxy.ts at the URL of a protected post, in place of the post, until the
// password is given. It holds nothing of the post: not even its title.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProtectedSlugs().map((slug) => ({ slug }));
}

export const generateMetadata = async (): Promise<Metadata> => {
  const { posts } = await getDictionary();

  return {
    metadataBase: new URL(SITE_URL),
    title: posts.unlock.metadata.title,
    description: posts.unlock.metadata.description,
    robots: { index: false, follow: false },
  };
};

export default async function UnlockPage({ params }: PageProps<"/[locale]/unlock/[slug]">) {
  const { slug } = await params;
  const { posts } = await getDictionary();

  if (!getProtectedSlugs().includes(slug)) {
    notFound();
  }

  return (
    <>
      <main
        id="main"
        className="container-page flex flex-col gap-6 pt-[clamp(48px,8vw,112px)] pb-[clamp(56px,7vw,96px)]"
      >
        <p className="font-mono text-[13px] text-muted">~/{posts.breadcrumb}</p>
        <h1 className="text-[clamp(32px,4.4vw,48px)] leading-[1.08] font-semibold tracking-[-0.03em]">
          {posts.unlock.title}
        </h1>
        <p className="max-w-[56ch] text-[18px] leading-[1.5] text-text2">{posts.unlock.text}</p>
        <PostUnlockFormComponent slug={slug} texts={posts.unlock} />
      </main>
      <SiteFooterComponent />
    </>
  );
}
