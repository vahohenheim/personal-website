import { FooterComponentProps } from './footer.model';
import SocialNetworkComponent from '../social-network/social-network';
import AppearComponent from '../appear/appear';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu/navigation-menu';

const FooterComponent = async ({ socialNetworks }: FooterComponentProps) => {
    const { footer } = await getDictionary();
    const hasSocialNetwork = socialNetworks && socialNetworks.length > 0;

    return (
        <footer className="container-mobile">
            <AppearComponent>
                <div className="mx-auto flex max-w-[900px] flex-col justify-between gap-2 py-2 sm:flex-row-reverse sm:items-center">
                    {hasSocialNetwork && (
                        <NavigationMenu>
                            <NavigationMenuList>
                                {socialNetworks.map((socialNetwork, index) => (
                                    <SocialNetworkComponent key={index} socialNetwork={socialNetwork} />
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    )}
                    <div className="text-sm">
                        {footer.copyright.replace('{year}', String(new Date().getFullYear()))}
                    </div>
                </div>
            </AppearComponent>
        </footer>
    );
};

export default FooterComponent;
