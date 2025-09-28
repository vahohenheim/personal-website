import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://valentinbourreau.com/en/',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
            alternates: {
                languages: {
                    fr: 'https://valentinbourreau.com/fr/'
                }
            }
        },
        {
            url: 'https://valentinbourreau.com/en/resume/',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
            alternates: {
                languages: {
                    fr: 'https://valentinbourreau.com/fr/resume/'
                }
            }
        }
    ];
}
