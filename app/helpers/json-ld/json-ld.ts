import {
    JsonLdAuthor,
    JsonLdAuthorType,
    JsonLdBlogPosting,
    JsonLdBreadcrumbItem,
    JsonLdBreadcrumbList,
    JsonLdCreativeWork,
    JsonLdListItem,
    JsonLdNewsArticle,
    JsonLdOffer,
    JsonLdOrganization,
    JsonLdPerson,
    JsonLdPlace,
    JsonLdPortfolio,
    JsonLdProfilePage,
    JsonLdService
} from './json-ld.model';

export class JsonLd {
    public static generateNewsArticle(
        title: string,
        image: Array<string>,
        datePublished: string,
        dateModified: string,
        author: Array<JsonLdAuthor>
    ): JsonLdNewsArticle {
        const newsArticle: JsonLdNewsArticle = {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: title || '',
            image: image,
            datePublished: datePublished,
            dateModified: dateModified
        };

        if (author && author.length > 0) {
            return { ...newsArticle, author: author.map(JsonLd.generateAuthor) };
        }

        return newsArticle;
    }

    public static generateAuthor(author: JsonLdAuthor): JsonLdOrganization | JsonLdPerson {
        switch (author.type) {
            case JsonLdAuthorType.ORGANIZATION:
                return JsonLd.generateOrganization(author);
            case JsonLdAuthorType.PERSON:
            default:
                return JsonLd.generatePerson(author);
        }
    }

    public static generateProfilePage(
        author: Array<JsonLdAuthor>,
        dateCreated: string,
        dateModified: string
    ): JsonLdProfilePage {
        const profilePage: JsonLdProfilePage = {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            dateCreated,
            dateModified
        };

        if (author[0]) {
            return { ...profilePage, mainEntity: JsonLd.generateAuthor(author[0]) };
        }

        return profilePage;
    }

    public static generateBreadcrumbList(items: Array<JsonLdBreadcrumbItem>): JsonLdBreadcrumbList {
        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map(JsonLd.generateListItem)
        };
    }

    public static generateService(
        name: string,
        description: string,
        provider: JsonLdPerson | JsonLdOrganization,
        areaServed: JsonLdPlace,
        offers: JsonLdOffer
    ): JsonLdService {
        return {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: name,
            description: description,
            provider: provider,
            areaServed: areaServed,
            offers: offers
        };
    }

    public static generatePorfolio(creator: JsonLdAuthor, workExample: Array<JsonLdCreativeWork>): JsonLdPortfolio {
        return {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: 'Portfolio',
            creator: JsonLd.generatePerson(creator),
            workExample: workExample
        };
    }

    public static generateCreativeWork(
        name: string,
        url: string,
        datePublished: string,
        description: string
    ): JsonLdCreativeWork {
        return {
            '@type': 'CreativeWork',
            name: name,
            url: url,
            datePublished: datePublished,
            description: description
        };
    }

    public static generateBlogPosting(
        headline: string,
        image: Array<string>,
        datePublished: string,
        dateModified: string,
        author: Array<JsonLdPerson | JsonLdOrganization>,
        articleBody: string
    ): JsonLdBlogPosting {
        return {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: headline,
            image: image,
            datePublished: datePublished,
            dateModified: dateModified,
            author: author,
            articleBody: articleBody
        };
    }

    public static generatePortfolio(portfolio: JsonLdPortfolio): JsonLdPortfolio {
        return {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: portfolio.name,
            creator: portfolio.creator,
            workExample: portfolio.workExample
        };
    }

    private static generateOrganization(author: JsonLdAuthor): JsonLdOrganization {
        return {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: `${author.firstname + ' ' + author.lastname || ''}`,
            image: author.avatar || '',
            description: author.description || '',
            url: author.link || ''
        };
    }

    private static generatePerson(author: JsonLdAuthor): JsonLdPerson {
        return {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: `${author.firstname + ' ' + author.lastname || ''}`,
            image: author.avatar || '',
            jobTitle: author.job || '',
            description: author.description || '',
            url: author.link || ''
        };
    }

    private static generateListItem(item: JsonLdBreadcrumbItem, index: number): JsonLdListItem {
        return {
            '@context': 'https://schema.org',
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: item.link
        };
    }
}
