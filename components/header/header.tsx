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
import { HEADER_NAVIGATION_MENU_ITEMS } from "./header.constants";
import AppearComponent from "../appear/appear";
import LogoIcon from "../icons/logo";
import LanguageToggle from "../language-toggle/language-toggle";

const HeaderComponent = async () => {
  const locale = await getLocale();
  const { header } = await getDictionary();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <AppearComponent>
        <div className="container-mobile mx-auto flex h-14 max-w-[900px] items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/`}>
              <LogoIcon className="fill-foreground" />
            </Link>
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList>
                {HEADER_NAVIGATION_MENU_ITEMS.map((item) => (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
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
      </AppearComponent>
    </header>
  );
};

export default HeaderComponent;
