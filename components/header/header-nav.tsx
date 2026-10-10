"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";

export type HeaderNavItem = { label: string; href: string };

type HeaderNavProps = {
  locale: Locale;
  otherLocale: Locale;
  items: HeaderNavItem[];
  /** Name of the language link, written in the other language. */
  otherLocaleLabel: string;
  menuLabel: string;
};

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/** Read by proxy.ts, so that the next visit to "/" lands on the chosen language. */
const saveLocale = (locale: Locale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
};

const linkClass = "no-underline hover:text-accent";

/** Header links. A client component only to know the current path. */
const HeaderNavComponent = ({
  locale,
  otherLocale,
  items,
  otherLocaleLabel,
  menuLabel,
}: HeaderNavProps) => {
  const pathname = usePathname();
  const otherLocalePath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <nav aria-label={menuLabel}>
      <ul className="flex list-none flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[13px]">
        {items.map((item) => {
          const isCurrent = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(linkClass, isCurrent ? "text-accent" : "text-text")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href={otherLocalePath}
            hrefLang={otherLocale}
            lang={otherLocale}
            // The accessible name keeps the visible text, then says where the link goes.
            aria-label={`fr · en, ${otherLocaleLabel}`}
            className={cn(linkClass, "text-muted")}
            onClick={() => {
              saveLocale(otherLocale);
            }}
          >
            fr · en
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderNavComponent;
