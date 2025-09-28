export type SocialNetwork = {
  type: SocialNetworkType;
  alt: string;
  link: string;
}

export enum SocialNetworkType {
  MAIL = 'MAIL',
  LINKEDIN = 'LINKEDIN',
  GITHUB = 'GITHUB',
  DRIBBBLE = 'DRIBBBLE',
  BEHANCE = 'BEHANCE',
}
