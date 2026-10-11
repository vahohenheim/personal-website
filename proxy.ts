import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_REALM, isAdminAuthorized, isAdminConfigured } from "@/lib/admin/auth";
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

/**
 * HTTP Basic gate of the admin area. Every admin page, route and action checks access
 * again by itself (lib/admin/guard.ts): never rely on this gate alone.
 */
const guardAdmin = (request: NextRequest) => {
  if (!isAdminAuthorized(request.headers.get("authorization"))) {
    if (!isAdminConfigured()) {
      console.error("[admin] ADMIN_USER or ADMIN_PASSWORD is missing: access refused.");
    }

    return new NextResponse("Authentication required.", {
      status: 401,
      headers: {
        "WWW-Authenticate": `Basic realm="${ADMIN_REALM}", charset="UTF-8"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  return response;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return guardAdmin(request);
  }

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
  matcher: [
    // The admin area, whatever the path looks like: a file extension must not bypass the gate.
    "/admin/:path*",
    // Everything else, except Next.js internals, API routes, the generated Apple icon, the
    // BotID proxy, every file with an extension, and URLs that already start with a
    // locale (those pages are served by the CDN without running this function). The
    // matcher must be a literal: keep the locales in line with LOCALES.
    "/((?!api|_next|admin|apple-icon(?:/|$)|149e9513-01fa-4fb0-aad4-566afd725d1b|en(?:/|$)|fr(?:/|$)|.*\\..*).*)",
  ],
};
