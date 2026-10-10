import { MailIcon } from "lucide-react";
import { type ComponentType } from "react";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu/navigation-menu";
import { SocialNetworkType } from "@/lib/models/social-network";
import { cn } from "@/lib/utils/cn";
import { type SocialNetworkComponentProps } from "./social-network.model";
import { type IconProps } from "../icons/icon.model";
import BehanceIcon from "../icons/social-networks/behance";
import DribbbleIcon from "../icons/social-networks/dribbble";
import GithubIcon from "../icons/social-networks/github";
import LinkedinIcon from "../icons/social-networks/linkedin";

const SOCIAL_NETWORK_ICONS: Record<SocialNetworkType, ComponentType<IconProps>> = {
  [SocialNetworkType.MAIL]: MailIcon,
  [SocialNetworkType.GITHUB]: GithubIcon,
  [SocialNetworkType.DRIBBBLE]: DribbbleIcon,
  [SocialNetworkType.BEHANCE]: BehanceIcon,
  [SocialNetworkType.LINKEDIN]: LinkedinIcon,
};

const SocialNetworkIconComponent = ({ socialNetwork }: SocialNetworkComponentProps) => {
  const Icon = SOCIAL_NETWORK_ICONS[socialNetwork.type];

  return <Icon width={20} height={20} className="stroke-foreground" />;
};

const SocialNetworkComponent = ({ socialNetwork }: SocialNetworkComponentProps) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        className={cn(navigationMenuTriggerStyle(), "px-2")}
        href={socialNetwork.link}
      >
        <SocialNetworkIconComponent socialNetwork={socialNetwork} />
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

export default SocialNetworkComponent;
