import type { Metadata } from 'next';
import { AVATAR_PATH, AVATAR_SIZE, SITE_NAME, SITE_URL } from '@/lib/constants/site';
import { DEFAULT_LOCALE, LOCALES, OPEN_GRAPH_LOCALES } from '@/lib/i18n/config';
import { getDictionary, getLocale } from '@/lib/i18n/dictionaries';

const PAGES = {
    home: '/',
    resume: '/resume/'
} as const;

export type PageId = keyof typeof PAGES;

/** Path of a page in every locale, used for `hreflang` alternates and the sitemap. */
export const getLocalizedPaths = (page: PageId) =>
    Object.fromEntries(LOCALES.map(locale => [locale, `/${locale}${PAGES[page]}`]));

/** Translated meta tags of a page, with its canonical URL and language alternates. */
export const getPageMetadata = async (page: PageId): Promise<Metadata> => {
    const locale = await getLocale();
    const dictionary = await getDictionary();
    const { title, description } = page === 'home' ? dictionary.metadata : dictionary.resume.metadata;
    const paths = getLocalizedPaths(page);

    return {
        metadataBase: new URL(SITE_URL),
        title,
        description,
        alternates: {
            canonical: paths[locale],
            languages: { ...paths, 'x-default': paths[DEFAULT_LOCALE] }
        },
        openGraph: {
            type: 'website',
            url: paths[locale],
            siteName: SITE_NAME,
            locale: OPEN_GRAPH_LOCALES[locale],
            images: [{ url: AVATAR_PATH, width: AVATAR_SIZE, height: AVATAR_SIZE, alt: `${SITE_NAME} profile picture` }]
        }
    };
};

export const PAGE_IDS = Object.keys(PAGES) as Array<PageId>;
