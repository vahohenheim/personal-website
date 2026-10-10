import Link from "next/link";
import { SITE_NAME } from "@/lib/constants/site";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";

/**
 * Closing line of inner pages: copyright on the left, a way back home on the right.
 * The home page has its own footer, which is its contact section.
 */
const SiteFooterComponent = async () => {
  const locale = await getLocale();
  const { resume, footer } = await getDictionary();

  return (
    <footer className="container-page">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line py-6 font-mono text-[12px] text-muted">
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <span>
            © {new Date().getFullYear()} {SITE_NAME}
          </span>
          <Link href={`/${locale}/legal/`} className="text-muted no-underline hover:text-accent">
            {footer.legal}
          </Link>
        </p>
        <Link href={`/${locale}/`} className="text-muted no-underline hover:text-accent">
          {resume.home}
        </Link>
      </div>
    </footer>
  );
};

export default SiteFooterComponent;
