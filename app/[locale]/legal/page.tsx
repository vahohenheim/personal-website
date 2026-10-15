import dayjs from "dayjs";
import type { Metadata } from "next";
import JsonLdComponent from "@/components/json-ld/json-ld";
import LegalLayoutComponent from "@/components/legal-layout/legal-layout";
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
      <main id="main" className="container-page">
        <JsonLdComponent page="legal" />
        <LegalLayoutComponent
          breadcrumb={{ label: a11y.breadcrumb, homeHref: `/${locale}/`, current: "legal" }}
          title={legal.title}
          meta={
            <p className="font-mono text-[13px] text-muted">
              {legal.updated.replace("{date}", updatedAt)}
            </p>
          }
          toc={legal.toc}
          anchor={legal.anchor}
          sections={legal.sections}
        />
      </main>
      <SiteFooterComponent current="legal" />
    </>
  );
}
