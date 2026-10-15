import { type IsoDate } from "@/lib/models/experience";

type TermsVersion = {
  version: string;
  /** Date from which this version applies, shown on the page. */
  effectiveAt: IsoDate;
  /** The signed PDF of this version, in `public/`. */
  pdf: string;
};

/**
 * The version of the general terms of service shown on `/cgv/`. A signed quote refers to a
 * given version, so the PDF keeps its version in its name and earlier PDFs stay online:
 * a new version adds a file in `public/cgv/`, it never replaces one.
 */
export const TERMS: TermsVersion = {
  version: "1.0",
  effectiveAt: "2026-10-15",
  pdf: "/cgv/cgp-1.0.pdf",
};
