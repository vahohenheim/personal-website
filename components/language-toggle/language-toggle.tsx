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

const LANGUAGES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/** Read by proxy.ts, so that the next visit to "/" lands on the chosen language. */
const saveLocale = (locale: Locale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
};

const LanguageToggle = ({ locale, label }: { locale: Locale; label: string }) => {
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
        <Button variant="ghost" size="icon" className="text-xs font-semibold uppercase">
          <span aria-hidden>{locale}</span>
          <span className="sr-only">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            lang={code}
            onClick={() => {
              navigateToLanguage(code as Locale);
            }}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
