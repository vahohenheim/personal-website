import Link from "next/link";
import LegalLinksComponent, { type LegalPage } from "@/components/legal-links/legal-links";
import { Separator } from "@/components/ui/separator";
import { SITE_NAME } from "@/lib/constants/site";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";

/**
 * Closing line of inner pages: copyright and the legal links on the left, a way back home
 * on the right. The home page has its own footer, which is its contact section. `current`
 * marks the legal link of the page being read.
 */
const SiteFooterComponent = async ({ current }: { current?: LegalPage }) => {
  const locale = await getLocale();
  const { resume } = await getDictionary();

  return (
    <footer className="container-page">
      <Separator />
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6 font-mono text-[12px] text-muted">
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
          <LegalLinksComponent current={current} />
        </div>
        <Link href={`/${locale}/`} className="text-muted no-underline hover:text-accent">
          {resume.home}
        </Link>
      </div>
    </footer>
  );
};

export default SiteFooterComponent;
