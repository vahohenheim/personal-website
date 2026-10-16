import Link from "next/link";
import LegalLinksComponent, { type LegalPage } from "@/components/legal-links/legal-links";
import { Separator } from "@/components/ui/separator";
import { SITE_NAME } from "@/lib/constants/site";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";

type SiteFooterComponentProps = {
  /** Marks the legal link of the page being read. */
  current?: LegalPage;
  /** On the home page, the way back home is left out. */
  home?: boolean;
};

/**
 * Closing line of every page: copyright and the legal links on the left, a way back home
 * on the right.
 */
const SiteFooterComponent = async ({ current, home = false }: SiteFooterComponentProps) => {
  const locale = await getLocale();
  const { resume } = await getDictionary();

  return (
    <footer className="container-page">
      <Separator />
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6 type-meta text-muted">
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
          <LegalLinksComponent current={current} />
        </div>
        {!home && (
          <Link href={`/${locale}/`} className="text-muted no-underline hover:text-accent">
            {resume.home}
          </Link>
        )}
      </div>
    </footer>
  );
};

export default SiteFooterComponent;
