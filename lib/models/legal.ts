/**
 * Shapes of the legal documents written in `locales/legal/`: the general terms of service
 * (`/cgv/`) and the legal notice (`/legal/`).
 *
 * Every text is a `RichText`: a plain string with four inline marks, read by
 * `parseRichText` (`lib/helpers/rich-text.ts`):
 * - `[text](href)`: a link (`#art-12`, `/fr/legal/#sec-05`, `mailto:…`);
 * - `**text**`: strong text;
 * - `` `text` ``: a name in mono (a cookie name);
 * - `[[text]]`: a placeholder Valentin still has to fill, shown in a small mono box.
 */
export type RichText = string;

/** One line of an identity card: a lowercase mono label and its value. */
export type IdentityRow = { key: string; value: RichText };

/** One processing of personal data: its name, how long data is kept, what happens. */
export type ProcessingItem = { title: string; retention: string; text: RichText };

export type LegalBlock =
  | { type: "p"; text: RichText }
  | { type: "ol" | "ul"; items: RichText[] }
  | { type: "identity"; rows: IdentityRow[] }
  | { type: "processing"; items: ProcessingItem[] }
  | {
      type: "subsection";
      /** Anchor of the subsection, `art-12-2`. */
      id: string;
      /** Shown in mono before the title: `12.2`. */
      number: string;
      title: string;
      blocks: LegalBlock[];
    };

export type LegalSection = {
  /** Anchor of the section: `art-01` to `art-20`, `sec-01` to `sec-07`. */
  id: string;
  /** Two digits, shown in the number column and the summary. */
  number: string;
  title: string;
  /** Framed by two rules in the text colour, with more room (articles 11 and 12). */
  emphasis?: boolean;
  blocks: LegalBlock[];
};

/** Texts of the summary of a legal document. */
export type LegalTocTexts = {
  /** Visible label above the summary on wide screens: "sommaire". */
  label: string;
  /** Summary of the folded list on phones, `{count}` replaced: "sommaire · {count} articles". */
  summary: string;
  /** Name of the navigation landmark. */
  navLabel: string;
};

/**
 * The general terms of service, in French only: the English page shows them as they are.
 * Everything a reader sees inside the terms, summary included, is in this object, so that
 * the whole block can carry `lang="fr"` on the English page.
 */
export type TermsDocument = {
  /** The identity of the provider, at the top of the page. */
  identity: IdentityRow[];
  /** The sentence after the identity card: "Ci-après « le Prestataire »." */
  designation: RichText;
  toc: LegalTocTexts;
  /** Name of the `#` link next to each title, `{n}` replaced by the article number. */
  anchor: string;
  sections: LegalSection[];
};
