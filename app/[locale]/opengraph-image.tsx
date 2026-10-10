import { ImageResponse } from "next/og";
import { loadGeist, loadGeistMono } from "@/lib/helpers/og-fonts";
import { hasLocale, LOCALES } from "@/lib/i18n/config";
import en from "@/locales/en";
import fr from "@/locales/fr";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Valentin Bourreau";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const DICTIONARIES = { en, fr };

/** Sharing image, in day mode: breadcrumb, title, status line. See the design charter. */
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { home, resume } = DICTIONARIES[hasLocale(locale) ? locale : "en"];

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
        ~/valentin-bourreau
      </div>
      <div
        style={{
          fontFamily: "Geist",
          fontWeight: 600,
          fontSize: 72,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: "#141818",
        }}
      >
        {home.title}
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
        {resume.meta.status} · valentinbourreau.com
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
