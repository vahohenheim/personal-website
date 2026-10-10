import dayjs from "dayjs";
import type { Metadata } from "next";
import BreadcrumbComponent from "@/components/breadcrumb/breadcrumb";
import JsonLdComponent from "@/components/json-ld/json-ld";
import SiteFooterComponent from "@/components/site-footer/site-footer";
import { PAGES } from "@/lib/constants/pages";
import { getPageMetadata } from "@/lib/helpers/metadata";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
// Registers the French month names used below.
import "dayjs/locale/fr";

export const generateMetadata = (): Promise<Metadata> => getPageMetadata("legal");

export default async function LegalPage() {
  const locale = await getLocale();
  const { legal, a11y } = await getDictionary();
  const updatedAt = dayjs(PAGES.legal.updatedAt).locale(locale).format("D MMMM YYYY");

  return (
    <>
      <main
        id="main"
        className="container-page flex flex-col gap-6 pt-[clamp(48px,8vw,112px)] pb-[clamp(56px,7vw,96px)]"
      >
        <JsonLdComponent page="legal" />
        <BreadcrumbComponent label={a11y.breadcrumb} homeHref={`/${locale}/`} current="legal" />
        <h1 className="text-[clamp(32px,4.4vw,48px)] leading-[1.05] font-semibold tracking-[-0.03em]">
          {legal.title}
        </h1>
        <p className="font-mono text-[13px] text-muted">
          {legal.updated.replace("{date}", updatedAt)}
        </p>
        <div className="mt-4 flex max-w-[64ch] flex-col">
          {legal.sections.map((section) => (
            <section
              key={section.heading}
              className="flex flex-col gap-3 border-t border-line py-8"
            >
              <h2 className="text-[20px] leading-[1.3] font-semibold tracking-[-0.01em]">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-text2">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <SiteFooterComponent />
    </>
  );
}
