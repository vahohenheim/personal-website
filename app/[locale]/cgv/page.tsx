import dayjs from "dayjs";
import type { Metadata } from "next";
import IdentityCardComponent from "@/components/identity-card/identity-card";
import JsonLdComponent from "@/components/json-ld/json-ld";
import LegalLayoutComponent from "@/components/legal-layout/legal-layout";
import RichTextComponent from "@/components/rich-text/rich-text";
import SiteFooterComponent from "@/components/site-footer/site-footer";
import { TERMS } from "@/lib/constants/terms";
import { getPageMetadata } from "@/lib/helpers/metadata";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
// Registers the French month names used below.
import "dayjs/locale/fr";

export const generateMetadata = (): Promise<Metadata> => getPageMetadata("cgv");

/**
 * The general terms of service, in the language of the page. The English page is a
 * translation and says, under the title, that the French version prevails.
 */
export default async function CgvPage() {
  const locale = await getLocale();
  const { cgv, a11y } = await getDictionary();
  const { terms } = cgv;
  const effectiveAt = dayjs(TERMS.effectiveAt).locale(locale).format("D MMMM YYYY");

  return (
    <>
      <main id="main" className="container-page">
        <JsonLdComponent page="cgv" />
        <LegalLayoutComponent
          breadcrumb={{ label: a11y.breadcrumb, homeHref: `/${locale}/`, current: "cgv" }}
          title={cgv.title}
          meta={
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-[13px]">
              <p className="text-muted">
                {cgv.version.replace("{version}", TERMS.version).replace("{date}", effectiveAt)}
              </p>
              <a href={TERMS.pdf[locale]}>{cgv.download}</a>
            </div>
          }
          intro={
            <>
              {cgv.notice !== "" && (
                <p className="max-w-[720px] text-[15px] text-text2">
                  <RichTextComponent text={cgv.notice} />
                </p>
              )}
              <IdentityCardComponent rows={terms.identity} className="mt-2 max-w-[720px]" />
              <p className="text-[15px] text-text2">
                <RichTextComponent text={terms.designation} />
              </p>
            </>
          }
          toc={terms.toc}
          anchor={terms.anchor}
          sections={terms.sections}
        />
      </main>
      <SiteFooterComponent current="cgv" />
    </>
  );
}
