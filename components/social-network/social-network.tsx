import { IconProps } from '../icons/icon.model';
import GithubIcon from '../icons/social-networks/github';
import DribbbleIcon from '../icons/social-networks/dribbble';
import BehanceIcon from '../icons/social-networks/behance';
import LinkedinIcon from '../icons/social-networks/linkedin';
import { SocialNetworkComponentProps } from './social-network.model';
import { MailIcon } from 'lucide-react';
import {
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu/navigation-menu';
import { cn } from '@/lib/utils/cn';
import { SocialNetworkType } from '@/app/models/social-network';

const SocialNetworkIconComponent = ({ socialNetwork }: SocialNetworkComponentProps) => {
    const defaultProps: IconProps = {
        width: 20,
        height: 20,
        className: "stroke-foreground"
    };

    if (socialNetwork.type === SocialNetworkType.MAIL) {
        return <MailIcon {...defaultProps} />;
    }

    if (socialNetwork.type === SocialNetworkType.GITHUB) {
        return <GithubIcon {...defaultProps} />;
    }

    if (socialNetwork.type === SocialNetworkType.DRIBBBLE) {
        return <DribbbleIcon {...defaultProps} />;
    }

    if (socialNetwork.type === SocialNetworkType.BEHANCE) {
        return <BehanceIcon {...defaultProps} />;
    }

    if (socialNetwork.type === SocialNetworkType.LINKEDIN) {
        return <LinkedinIcon {...defaultProps} />;
    }
};

const SocialNetworkComponent = ({ socialNetwork }: SocialNetworkComponentProps) => {
    return (
        <NavigationMenuItem>
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "px-2")} href={socialNetwork.link}>
                <SocialNetworkIconComponent socialNetwork={socialNetwork} />
            </NavigationMenuLink>
        </NavigationMenuItem>
    );
};

export default SocialNetworkComponent;
