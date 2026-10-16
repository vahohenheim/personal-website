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
  /**
   * Where the language link goes from a page without a version in the other language:
   * `paths` lists such pages, and any post whose path is not in `otherPosts` (the posts
   * listed in the other language) goes to `post`. Protected posts are never named here.
   */
  languageFallbacks: { paths: Record<string, string>; post: string; otherPosts: string[] };
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
  languageFallbacks,
}: HeaderNavProps) => {
  const pathname = usePathname();
  const translated = pathname.replace(`/${locale}`, `/${otherLocale}`);
  const isPost = new RegExp(`^/${locale}/posts/[^/]+/$`).test(pathname);
  const otherLocalePath =
    languageFallbacks.paths[pathname] ??
    (isPost && !languageFallbacks.otherPosts.includes(translated)
      ? languageFallbacks.post
      : translated);

  return (
    <nav aria-label={menuLabel}>
      <ul className="flex list-none flex-wrap items-center gap-x-5 gap-y-2 type-label">
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
