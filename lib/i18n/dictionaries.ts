import { locale } from 'next/root-params';
import { notFound } from 'next/navigation';
import type { Dictionary } from '@/locales/en';
import { hasLocale, type Locale } from './config';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
    en: () => import('@/locales/en').then(module => module.default),
    fr: () => import('@/locales/fr').then(module => module.default)
};

/** Locale of the current request, read from the `[locale]` root segment. Server Components only. */
export const getLocale = async (): Promise<Locale> => {
    const value = await locale();

    if (!hasLocale(value)) {
        notFound();
    }

    return value;
};

/** Translations for the current request. Server Components only. */
export const getDictionary = async (): Promise<Dictionary> => dictionaries[await getLocale()]();
