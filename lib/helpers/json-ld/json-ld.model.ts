export type JsonLdAuthor = {
    avatar: string;
    firstname: string;
    lastname: string;
    job: string;
    description: string;
    link?: string;
    type?: JsonLdAuthorType;
};

export type JsonLdService = {
    '@context'?: 'https://schema.org';
    '@type'?: 'Service';
    name: string;
    description: string;
    provider: JsonLdPerson | JsonLdOrganization;
    areaServed: JsonLdPlace;
    offers: JsonLdOffer;
};

export type JsonLdPlace = {
    '@context'?: 'https://schema.org';
    '@type'?: 'Place';
    name: string;
};

export type JsonLdOffer = {
    '@context'?: 'https://schema.org';
    '@type'?: 'Offer';
    price: string;
    priceCurrency: string;
    url: string;
    priceValidUntil: string;
};

export enum JsonLdAuthorType {
    PERSON = 'Person',
    ORGANIZATION = 'Organization'
}

export type JsonLdBreadcrumbItem = {
    label: string;
    link: string;
};

export type JsonLdBreadcrumbList = {
    '@context': 'https://schema.org';
    '@type': 'BreadcrumbList';
    itemListElement: Array<JsonLdListItem>;
};

export type JsonLdListItem = {
    '@context': 'https://schema.org';
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
};

export type JsonLdNewsArticle = {
    '@context': 'https://schema.org';
    '@type': 'NewsArticle';
    headline: string;
    image: Array<string>;
    datePublished: string;
    dateModified: string;
    author?: Array<JsonLdPerson | JsonLdOrganization>;
};

export type JsonLdOrganization = {
    '@context': 'https://schema.org';
    '@type': 'Organization';
    name: string;
    image?: string;
    description?: string;
    url?: string;
    member?: Array<JsonLdPerson | JsonLdOrganization>;
};

export type JsonLdPerson = {
    '@context': 'https://schema.org';
    '@type': 'Person';
    name: string;
    jobTitle?: string;
    url?: string;
    alternateName?: string;
    identifier?: string;
    description?: string;
    image?: string;
    sameAs?: Array<string>;
    interactionStatistic?: Array<JsonLdInteractionCounter>;
    agentInteractionStatistic?: JsonLdInteractionCounter;
};

export type JsonLdProfilePage = {
    '@context': 'https://schema.org';
    '@type': 'ProfilePage';
    dateCreated: string;
    dateModified: string;
    mainEntity?: JsonLdPerson | JsonLdOrganization;
};

export type JsonLdInteractionCounter = {
    '@context': 'https://schema.org';
    '@type': 'InteractionCounter';
    interactionType:
        'https://schema.org/FollowAction' | 'https://schema.org/WriteAction' | 'https://schema.org/LikeAction';
    userInteractionCount: number;
};

export type JsonLdPortfolio = {
    '@context'?: 'https://schema.org';
    '@type'?: 'CreativeWork';
    name: string;
    creator: JsonLdPerson | JsonLdOrganization;
    workExample: Array<JsonLdCreativeWork>;
};

export type JsonLdCreativeWork = {
    '@type'?: 'CreativeWork';
    name: string;
    url: string;
    datePublished: string;
    description: string;
};

export type JsonLdBlogPosting = {
    '@context'?: 'https://schema.org';
    '@type'?: 'BlogPosting';
    headline: string;
    image: Array<string>;
    datePublished: string;
    dateModified: string;
    author: Array<JsonLdPerson | JsonLdOrganization>;
    articleBody: string;
};
