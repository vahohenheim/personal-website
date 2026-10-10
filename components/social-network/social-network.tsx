import { MailIcon } from "lucide-react";
import { type ComponentType } from "react";
import { navLinkStyle } from "@/components/ui/nav-link/nav-link";
import { getDictionary } from "@/lib/i18n/dictionaries";
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

/** One icon link, as a list item: render it inside a `<ul>`. */
const SocialNetworkComponent = async ({ socialNetwork }: SocialNetworkComponentProps) => {
  const { a11y } = await getDictionary();
  const Icon = SOCIAL_NETWORK_ICONS[socialNetwork.type];
  const isMail = socialNetwork.type === SocialNetworkType.MAIL;

  return (
    <li>
      <a
        className={cn(navLinkStyle, "px-2")}
        href={socialNetwork.link}
        aria-label={isMail ? a11y.email : socialNetwork.label}
      >
        <Icon width={20} height={20} className="stroke-foreground" />
      </a>
    </li>
  );
};

export default SocialNetworkComponent;
