export type SocialNetwork = {
  type: SocialNetworkType;
  /** Name read by screen readers: the link only shows an icon. */
  label: string;
  link: string;
};

export enum SocialNetworkType {
  MAIL = "MAIL",
  LINKEDIN = "LINKEDIN",
  GITHUB = "GITHUB",
  DRIBBBLE = "DRIBBBLE",
  BEHANCE = "BEHANCE",
}
