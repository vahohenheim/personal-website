import { RESUME_METADATA } from '../[locale]/resume/metadata';
import { getScopedI18n } from '@/locales/server';

export class MetadataHelpers {
    static async translateHomepage(locale: 'en' | 'fr' = 'en') {
        const t = await getScopedI18n('metadata');
        return {
            ...RESUME_METADATA,
            title: t('title'),
            description: t('description'),
            openGraph: { ...RESUME_METADATA.openGraph, locale: locale === 'en' ? 'en_US' : 'fr_FR' }
        };
    }

    static async translateResume(locale: 'en' | 'fr' = 'en') {
        const t = await getScopedI18n('resume.metadata');
        return {
            ...RESUME_METADATA,
            title: t('title'),
            description: t('description'),
            openGraph: { ...RESUME_METADATA.openGraph, locale: locale === 'en' ? 'en_US' : 'fr_FR' }
        };
    }
}
