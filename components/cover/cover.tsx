import Image from 'next/image';
import Link from 'next/link';
import { CoverAlignment, CoverComponentProps } from './cover.model';
import AppearComponent from '../appear/appear';
import SectionComponent from '../section/section';
import SocialNetworkComponent from '../social-network/social-network';
import { HeadingComponent } from '@/components/ui/heading/heading';
import { Button } from '@/components/ui/button/button';
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu/navigation-menu';
import { HeadingTags } from '@/components/ui/heading/heading.model';
import { cn } from '@/lib/utils/cn';

const CoverComponent = ({
    ontitle,
    title,
    description,
    alignment = CoverAlignment.LEFT,
    action,
    socialNetworks = [],
    avatar
}: CoverComponentProps) => {
    return (
        <SectionComponent>
            <div
                className={cn(
                    "flex items-center justify-center flex-col text-center max-md:items-start max-md:text-left",
                    {
                        "items-start text-left": alignment === CoverAlignment.LEFT
                    }
                )}
            >
                <AppearComponent>
                    <Image
                        className="mb-4 rounded-[10px]"
                        src={avatar}
                        alt="valentin bourreau picture"
                        width={120}
                        height={120}
                    />
                </AppearComponent>
                {ontitle && (
                    <AppearComponent delay={0.1}>
                        <p
                            className="mb-0 text-xl text-slate-800 dark:text-slate-200"
                            dangerouslySetInnerHTML={{ __html: ontitle }}
                        />
                    </AppearComponent>
                )}
                <AppearComponent delay={0.2}>
                    <HeadingComponent tag={HeadingTags.H1} className="my-0">
                        {title}
                    </HeadingComponent>
                </AppearComponent>
                {description && (
                    <AppearComponent delay={0.3}>
                        <p
                            className="text-slate-600 dark:text-slate-300"
                            dangerouslySetInnerHTML={{ __html: description as string }}
                        />
                    </AppearComponent>
                )}
                <AppearComponent delay={0.4}>
                    <div className="flex flex-row items-center gap-8 mt-4 max-md:flex-col-reverse max-md:items-start max-md:gap-6">
                        <div className="flex items-center gap-4">
                            <Link href={action.link} scroll={true}>
                                <Button variant={action.variant || 'default'}>
                                    {action.label}
                                </Button>
                            </Link>
                        </div>
                        <NavigationMenu>
                            <NavigationMenuList>
                                {socialNetworks.map((socialNetwork, index) => (
                                    <SocialNetworkComponent key={index} socialNetwork={socialNetwork} />
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </AppearComponent>
            </div>
        </SectionComponent>
    );
};

export default CoverComponent;
