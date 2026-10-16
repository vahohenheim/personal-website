/** Shapes of the services page (`/offre/`) and of the offer block of the home page. */

export type ServiceId = "audit" | "lead" | "build" | "launch" | "retainer";

export type PriceUnit = "day" | "month";

/** A price in euros, excluding VAT. */
export type Price =
  | { type: "fixed"; amount: number; unit?: PriceUnit }
  | { type: "range"; min: number; max: number; unit?: PriceUnit }
  | { type: "quote" };

/** One way to buy a service: the express or the full audit, the day of technical lead. */
export type ServiceOption = { id: string; price: Price };

export type Service = { id: ServiceId; options: ServiceOption[] };

/** The two day rates of the rates table. */
export type DayRateId = "reference" | "urgent";

export type ServiceTexts = {
  /** Mono mark in the date column of the entry: `audit`, `mise en prod`. */
  code: string;
  /** Second mono line: `forfait`, `au jour`. */
  billing: string;
  title: string;
  /** One line on the home page. */
  summary: string;
  text: string;
  deliverables: string[];
  /** A cell shown before the prices: the pace, the duration, the format. */
  detail?: { label: string; value: string };
  /** Label of the price cell of each option, by option id. */
  prices: Record<string, string>;
};

export type OfferSectionId = "positioning" | "services" | "rates" | "method" | "contact";

export type OfferTexts = {
  title: string;
  /** Last segment of the breadcrumb. */
  breadcrumb: string;
  lead: string;
  meta: { status: string; remote: string; vat: string };
  actions: { contact: string; resume: string };
  toc: { label: string; summary: string; navLabel: string };
  /** Name of the `#` link of each section; `{title}` is replaced. */
  anchor: string;
  sections: Record<OfferSectionId, { label: string; title: string }>;
  positioning: { text: string; card: { key: string; value: string }[] };
  services: Record<ServiceId, ServiceTexts>;
  rates: {
    columns: { plan: string; rate: string; billing: string };
    days: Record<DayRateId, { label: string; billing: string }>;
    packages: { label: string; value: string; billing: string };
    vat: string;
  };
  method: { title: string; text: string }[];
  contact: { text: string; cta: string };
  /** Templates of the prices: `{price}`, `{min}` and `{max}` are replaced. */
  price: { from: string; range: string; day: string; month: string; quote: string };
  /** The block of the home page. */
  home: { title: string; lead: string; more: string; vat: string };
  metadata: { title: string; description: string };
};
