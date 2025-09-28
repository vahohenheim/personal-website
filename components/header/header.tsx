import Link from 'next/link';
import LanguageToggle from '../language-toggle/language-toggle';
import LogoIcon from '../icons/logo';
import { HEADER_NAVIGATION_MENU_ITEMS } from './header.constants';
import AppearComponent from '../appear/appear';
import { getScopedI18n } from '@/locales/server';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu/navigation-menu';
import { ModeToggle } from '@/components/ui/mode-toggle/mode-toggle';

const HeaderComponent = async ({ lang = 'en' }: { lang?: 'en' | 'fr' }) => {
    const scopedT = await getScopedI18n('header');

    return (
        <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <AppearComponent>
                <div className="container-mobile mx-auto flex h-14 max-w-[900px] items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <LogoIcon className="fill-foreground" />
                        </Link>
                        <NavigationMenu className="hidden md:block">
                            <NavigationMenuList>
                                {HEADER_NAVIGATION_MENU_ITEMS.map((item, index) => (
                                    <NavigationMenuItem key={index}>
                                        <Link href={item.href} passHref>
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                {scopedT(`menu.${item.id}`)}
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className="flex items-center gap-1">
                        <LanguageToggle defaultLanguage={lang} />
                        <ModeToggle />
                    </div>
                </div>
            </AppearComponent>
        </header>
    );
};

export default HeaderComponent;
