import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu/navigation-menu";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils/cn";
import { HEADER_NAVIGATION_MENU_ITEMS } from "./header.constants";
import LanguageToggle from "../language-toggle/language-toggle";
import WordmarkComponent from "../wordmark/wordmark";

const HeaderComponent = async () => {
  const locale = await getLocale();
  const { header } = await getDictionary();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-mobile mx-auto flex h-14 max-w-[900px] items-center justify-between">
        <div className="flex items-center gap-4 max-sm:gap-2">
          <Link href={`/${locale}/`}>
            <WordmarkComponent />
          </Link>
          {/* Visible at every width: on a phone it is the only way to reach the other pages. */}
          <NavigationMenu>
            <NavigationMenuList>
              {HEADER_NAVIGATION_MENU_ITEMS.map((item) => (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuLink
                    asChild
                    className={cn(navigationMenuTriggerStyle(), "max-sm:px-3")}
                  >
                    <Link href={`/${locale}${item.href}`}>{header.menu[item.id]}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-1">
          <LanguageToggle locale={locale} />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
