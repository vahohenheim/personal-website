import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle/mode-toggle";
import { navLinkStyle } from "@/components/ui/nav-link/nav-link";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils/cn";
import { HEADER_NAVIGATION_MENU_ITEMS } from "./header.constants";
import LanguageToggle from "../language-toggle/language-toggle";
import WordmarkComponent from "../wordmark/wordmark";

const HeaderComponent = async () => {
  const locale = await getLocale();
  const { header, a11y } = await getDictionary();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-mobile mx-auto flex h-14 max-w-[900px] items-center justify-between">
        <div className="flex items-center gap-4 max-sm:gap-2">
          <Link href={`/${locale}/`}>
            <WordmarkComponent />
          </Link>
          {/* Visible at every width: on a phone it is the only way to reach the other pages. */}
          <nav aria-label={a11y.mainMenu}>
            <ul className="flex list-none items-center space-x-1">
              {HEADER_NAVIGATION_MENU_ITEMS.map((item) => (
                <li key={item.id}>
                  <Link className={cn(navLinkStyle, "max-sm:px-3")} href={`/${locale}${item.href}`}>
                    {header.menu[item.id]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <LanguageToggle locale={locale} label={a11y.toggleLanguage} />
          <ModeToggle
            labels={{
              toggle: a11y.toggleTheme,
              light: a11y.themeLight,
              dark: a11y.themeDark,
              system: a11y.themeSystem,
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
