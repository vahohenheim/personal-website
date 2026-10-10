import dayjs from "dayjs";
import type { Metadata } from "next";
import JsonLdComponent from "@/components/json-ld/json-ld";
import SectionComponent from "@/components/section/section";
import { PAGES } from "@/lib/constants/pages";
import { getPageMetadata } from "@/lib/helpers/metadata";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
// Registers the French month names used below.
import "dayjs/locale/fr";

export const generateMetadata = (): Promise<Metadata> => getPageMetadata("legal");

export default async function LegalPage() {
  const locale = await getLocale();
  const { legal } = await getDictionary();
  const updatedAt = dayjs(PAGES.legal.updatedAt).locale(locale).format("D MMMM YYYY");

  return (
    <main id="main">
      <JsonLdComponent page="legal" />
      <SectionComponent>
        <h1 className="mb-2 font-bold">{legal.title}</h1>
        <p className="text-muted-foreground text-sm">
          {legal.updated.replace("{date}", updatedAt)}
        </p>
        <div className="mt-10 flex flex-col gap-10">
          {legal.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-3">
              <h2 className="text-2xl font-bold">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-secondary-foreground">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </SectionComponent>
    </main>
  );
}
