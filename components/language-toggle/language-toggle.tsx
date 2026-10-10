"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";

const LANGUAGES: Record<Locale, { flag: string; label: string }> = {
  en: { flag: "🇺🇸", label: "English" },
  fr: { flag: "🇫🇷", label: "Français" },
};

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/** Read by proxy.ts, so that the next visit to "/" lands on the chosen language. */
const saveLocale = (locale: Locale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
};

const LanguageToggle = ({ locale }: { locale: Locale }) => {
  const router = useRouter();
  const pathname = usePathname();

  const navigateToLanguage = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

    saveLocale(nextLocale);
    router.push(pathname.replace(`/${locale}`, `/${nextLocale}`));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {Object.entries(LANGUAGES).map(([code, { flag }], index) => (
            <p
              key={code}
              className={cn(
                "size-[1.2rem] scale-0 transition-all",
                index > 0 && "absolute",
                code === locale && "scale-100",
              )}
            >
              {flag}
            </p>
          ))}
          <span className="sr-only">Toggle Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(LANGUAGES).map(([code, { flag, label }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => {
              navigateToLanguage(code as Locale);
            }}
          >
            {flag} {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
