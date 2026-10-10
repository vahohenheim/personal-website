import { type IsoDate } from "@/lib/models/experience";

type PageDefinition = {
  /** Path without the locale, with a trailing slash. */
  path: string;
  createdAt: IsoDate;
  /** Last change a reader would notice. Bump it when the content of the page changes. */
  updatedAt: IsoDate;
};

/**
 * Every public page of the site. Metadata, the sitemap and the structured data
 * are all keyed by this list, so a page added here must be completed in each of them.
 */
export const PAGES = {
  home: { path: "/", createdAt: "2024-07-12", updatedAt: "2026-10-10" },
  resume: { path: "/resume/", createdAt: "2024-07-12", updatedAt: "2026-10-10" },
} as const satisfies Record<string, PageDefinition>;

export type PageId = keyof typeof PAGES;

export const PAGE_IDS = Object.keys(PAGES) as PageId[];
