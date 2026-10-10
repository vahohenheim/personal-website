import { Dayjs } from 'dayjs';
// Registers French month names for every `dayjs(...).locale('fr')` call in the app.
import 'dayjs/locale/fr';
import type { Locale } from '@/lib/i18n/config';

const WORDS: Record<Locale, { year: [string, string]; month: [string, string]; and: string }> = {
    en: { year: ['a year', 'years'], month: ['a month', 'months'], and: 'and' },
    fr: { year: ['un an', 'ans'], month: ['un mois', 'mois'], and: 'et' }
};

const formatUnit = (count: number, [one, many]: [string, string]) => (count === 1 ? one : `${count} ${many}`);

/**
 * Time between two dates in years and months, rounded to the nearest month:
 * "2 years", "8 months", "a year and 6 months".
 */
export const formatDateDifference = (start: Dayjs, end: Dayjs, locale: Locale = 'en') => {
    const totalMonths = Math.max(1, Math.round(end.diff(start, 'month', true)));
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const { year, month, and } = WORDS[locale];

    return [years > 0 && formatUnit(years, year), months > 0 && formatUnit(months, month)]
        .filter(Boolean)
        .join(` ${and} `);
};
