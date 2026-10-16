import { type Locale } from "@/lib/i18n/config";
import { type IsoDate } from "@/lib/models/experience";

type TermsVersion = {
  version: string;
  /** Date from which this version applies, shown on the page. */
  effectiveAt: IsoDate;
  /** The PDF of this version in each language, in `public/`. The French one prevails. */
  pdf: Record<Locale, string>;
};

/**
 * The version of the general terms of service shown on `/cgv/`. A signed quote refers to a
 * given version, so each PDF keeps its version in its name and earlier PDFs stay online:
 * a new version adds files in `public/cgv/`, it never replaces one.
 */
export const TERMS: TermsVersion = {
  version: "1.1",
  effectiveAt: "2026-10-16",
  pdf: { fr: "/cgv/cgp-1.1.pdf", en: "/cgv/cgp-1.1-en.pdf" },
};
