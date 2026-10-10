import { SocialNetworkType } from "@/lib/models/social-network";

export const SOCIAL_NETWORK_LINKS = {
  [SocialNetworkType.MAIL]: "mailto:contact@valentinbourreau.com",
  [SocialNetworkType.LINKEDIN]: "https://www.linkedin.com/in/valentin-bourreau/",
  [SocialNetworkType.GITHUB]: "https://github.com/vahohenheim",
  [SocialNetworkType.DRIBBBLE]: "https://dribbble.com/valentinbourreau",
  [SocialNetworkType.BEHANCE]: "https://www.behance.net/valentinbourreau",
};

export const MAIL_LINK = {
  type: SocialNetworkType.MAIL,
  label: "Email",
  link: SOCIAL_NETWORK_LINKS[SocialNetworkType.MAIL],
};

export const SOCIAL_NETWORKS = [
  {
    type: SocialNetworkType.GITHUB,
    label: "GitHub",
    link: SOCIAL_NETWORK_LINKS[SocialNetworkType.GITHUB],
  },
  {
    type: SocialNetworkType.DRIBBBLE,
    label: "Dribbble",
    link: SOCIAL_NETWORK_LINKS[SocialNetworkType.DRIBBBLE],
  },
  {
    type: SocialNetworkType.BEHANCE,
    label: "Behance",
    link: SOCIAL_NETWORK_LINKS[SocialNetworkType.BEHANCE],
  },
  {
    type: SocialNetworkType.LINKEDIN,
    label: "LinkedIn",
    link: SOCIAL_NETWORK_LINKS[SocialNetworkType.LINKEDIN],
  },
];
