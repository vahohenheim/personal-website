import { ImageResponse } from "next/og";
import { POSTS } from "@/lib/constants/posts";
import { loadGeist, loadGeistMono } from "@/lib/helpers/og-fonts";
import { getPost, isProtected } from "@/lib/helpers/posts";
import { hasLocale } from "@/lib/i18n/config";
import en from "@/locales/en";
import fr from "@/locales/fr";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Valentin Bourreau";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

const DICTIONARIES = { en, fr };

/**
 * Sharing image of a post, in day mode: breadcrumb, title, project. A protected post
 * shows neither its title nor its project: its link may travel further than its password.
 */
export default async function PostOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const language = hasLocale(locale) ? locale : "en";
  const { posts } = DICTIONARIES[language];
  const post = getPost(slug, language);
  const isHidden = !post || isProtected(post);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "#EEF1F0",
      }}
    >
      <div style={{ fontFamily: "Geist Mono", fontSize: 22, color: "#646C6A" }}>
        {isHidden ? `~/${posts.breadcrumb}` : `~/${posts.breadcrumb}/${slug}`}
      </div>
      <div
        style={{
          fontFamily: "Geist",
          fontWeight: 600,
          fontSize: 64,
          letterSpacing: "-0.03em",
          lineHeight: 1.08,
          color: "#141818",
          maxWidth: 1000,
        }}
      >
        {isHidden ? posts.unlock.title : post.title}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: "Geist Mono",
          fontSize: 22,
          color: "#3D6A60",
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 12, background: "#3D6A60" }} />
        {!isHidden && post.project ? `${post.project.name} · ` : ""}valentinbourreau.com
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: await loadGeist("Geist-SemiBold"), weight: 600, style: "normal" },
        { name: "Geist Mono", data: await loadGeistMono(), weight: 400, style: "normal" },
      ],
    },
  );
}
