import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, hasLocale, LOCALE_COOKIE, LOCALES, type Locale } from "@/lib/i18n/config";

/** Picks the locale from the saved choice, then from the browser languages. */
const resolveLocale = (request: NextRequest): Locale => {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;

  if (hasLocale(saved)) {
    return saved;
  }

  const preferred = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((entry) => {
      const [tag, quality] = entry.trim().split(";q=");
      return { language: tag.split("-")[0].toLowerCase(), quality: quality ? Number(quality) : 1 };
    })
    .sort((a, b) => b.quality - a.quality)
    .find(({ language }) => hasLocale(language));

  return preferred && hasLocale(preferred.language) ? preferred.language : DEFAULT_LOCALE;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocalePrefix) {
    return;
  }

  request.nextUrl.pathname = `/${resolveLocale(request)}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next.js internals, API routes, the generated Apple icon, every file with an extension, and URLs that
  // already start with a locale, so that pages are served by the CDN without running
  // this function. The matcher must be a literal: keep the locales in line with LOCALES.
  matcher: ["/((?!api|_next|apple-icon(?:/|$)|en(?:/|$)|fr(?:/|$)|.*\\..*).*)"],
};
