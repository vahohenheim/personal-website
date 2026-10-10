import {
  type JsonLdAuthor,
  JsonLdAuthorType,
  type JsonLdBlogPosting,
  type JsonLdBreadcrumbItem,
  type JsonLdBreadcrumbList,
  type JsonLdCreativeWork,
  type JsonLdListItem,
  type JsonLdNewsArticle,
  type JsonLdOffer,
  type JsonLdOrganization,
  type JsonLdPerson,
  type JsonLdPlace,
  type JsonLdPortfolio,
  type JsonLdProfilePage,
  type JsonLdService,
} from "./json-ld.model";

export function generateNewsArticle(
  title: string,
  image: string[],
  datePublished: string,
  dateModified: string,
  author: JsonLdAuthor[],
): JsonLdNewsArticle {
  const newsArticle: JsonLdNewsArticle = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title || "",
    image: image,
    datePublished: datePublished,
    dateModified: dateModified,
  };

  if (author.length > 0) {
    return { ...newsArticle, author: author.map(generateAuthor) };
  }

  return newsArticle;
}

export function generateAuthor(author: JsonLdAuthor): JsonLdOrganization | JsonLdPerson {
  switch (author.type) {
    case JsonLdAuthorType.ORGANIZATION:
      return generateOrganization(author);
    case JsonLdAuthorType.PERSON:
    default:
      return generatePerson(author);
  }
}

export function generateProfilePage(
  author: JsonLdAuthor[],
  dateCreated: string,
  dateModified: string,
): JsonLdProfilePage {
  const profilePage: JsonLdProfilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated,
    dateModified,
  };

  if (author[0]) {
    return { ...profilePage, mainEntity: generateAuthor(author[0]) };
  }

  return profilePage;
}

export function generateBreadcrumbList(items: JsonLdBreadcrumbItem[]): JsonLdBreadcrumbList {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(generateListItem),
  };
}

export function generateService(
  name: string,
  description: string,
  provider: JsonLdPerson | JsonLdOrganization,
  areaServed: JsonLdPlace,
  offers: JsonLdOffer,
): JsonLdService {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: name,
    description: description,
    provider: provider,
    areaServed: areaServed,
    offers: offers,
  };
}

export function generateCreativeWork(
  name: string,
  url: string,
  datePublished: string,
  description: string,
): JsonLdCreativeWork {
  return {
    "@type": "CreativeWork",
    name: name,
    url: url,
    datePublished: datePublished,
    description: description,
  };
}

export function generateBlogPosting(
  headline: string,
  image: string[],
  datePublished: string,
  dateModified: string,
  author: (JsonLdPerson | JsonLdOrganization)[],
  articleBody: string,
): JsonLdBlogPosting {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: headline,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified,
    author: author,
    articleBody: articleBody,
  };
}

export function generatePortfolio(portfolio: JsonLdPortfolio): JsonLdPortfolio {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: portfolio.name,
    creator: portfolio.creator,
    workExample: portfolio.workExample,
  };
}

function generateOrganization(author: JsonLdAuthor): JsonLdOrganization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `${author.firstname} ${author.lastname}`,
    image: author.avatar || "",
    description: author.description || "",
    url: author.link ?? "",
  };
}

function generatePerson(author: JsonLdAuthor): JsonLdPerson {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${author.firstname} ${author.lastname}`,
    image: author.avatar || "",
    jobTitle: author.job || "",
    description: author.description || "",
    url: author.link ?? "",
  };
}

function generateListItem(item: JsonLdBreadcrumbItem, index: number): JsonLdListItem {
  return {
    "@context": "https://schema.org",
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: item.link,
  };
}
