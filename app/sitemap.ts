import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants/site';
import { DEFAULT_LOCALE } from '@/lib/i18n/config';
import { getLocalizedPaths, PAGE_IDS } from '@/lib/helpers/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
    return PAGE_IDS.map(page => {
        const { [DEFAULT_LOCALE]: defaultPath, ...otherPaths } = getLocalizedPaths(page);

        return {
            url: `${SITE_URL}${defaultPath}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
            alternates: {
                languages: Object.fromEntries(
                    Object.entries(otherPaths).map(([locale, path]) => [locale, `${SITE_URL}${path}`])
                )
            }
        };
    });
}
