import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeaderComponent from "@/components/page-header/page-header";
import PostUnlockFormComponent from "@/components/post-unlock-form/post-unlock-form";
import SiteFooterComponent from "@/components/site-footer/site-footer";
import { SITE_URL } from "@/lib/constants/site";
import { getProtectedSlugs } from "@/lib/helpers/posts";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";

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
  const locale = await getLocale();
  const { posts, a11y } = await getDictionary();

  if (!getProtectedSlugs().includes(slug)) {
    notFound();
  }

  return (
    <>
      <main id="main" className="container-page pb-[clamp(56px,7vw,96px)]">
        <PageHeaderComponent
          breadcrumb={{
            label: a11y.breadcrumb,
            homeHref: `/${locale}/`,
            // The posts only: the trail names nothing of the protected post.
            trail: [{ label: posts.breadcrumb }],
          }}
          title={posts.unlock.title}
          lead={posts.unlock.text}
        >
          <PostUnlockFormComponent slug={slug} texts={posts.unlock} />
        </PageHeaderComponent>
      </main>
      <SiteFooterComponent />
    </>
  );
}
