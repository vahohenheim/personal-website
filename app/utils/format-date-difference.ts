import dayjs, { Dayjs } from "dayjs";
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr'; // Import de la locale française (ou une autre locale)

dayjs.extend(duration);
dayjs.extend(relativeTime);

// Fonction pour formater la différence avec la gestion de la locale
export const formatDateDifference = (date1: Dayjs, date2: Dayjs, locale = 'en') => {
  // Définir la locale
  dayjs.locale(locale);

  // Calcul de la différence en mois totaux
  const diffInMonths = date2.diff(date1, 'month');

  // Convertir cette différence en années et mois
  const years = Math.floor(diffInMonths / 12);
  const months = diffInMonths % 12;

  // Traduire le résultat en fonction de la locale
  const yearsText = dayjs.duration({ years }).humanize();
  const monthsText = dayjs.duration({ months }).humanize();

  if(yearsText.includes("seconds") || yearsText.includes("secondes")) {
    return monthsText;
  }

  if(monthsText.includes("seconds") || monthsText.includes("secondes")) {
    return yearsText;
  }

  // Combiner les années et les mois
  return `${yearsText} ${locale === 'fr' ? 'et' : 'and'} ${monthsText}`;
}
