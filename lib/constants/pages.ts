import { type IsoDate } from "@/lib/models/experience";

type PageDefinition = {
  /** Path without the locale, with a trailing slash. */
  path: string;
  createdAt: IsoDate;
  /** Last change a reader would notice. Bump it when the content of the page changes. */
  updatedAt: IsoDate;
  /** Sitemap hints: relative weight of the page within the site, and how often it changes. */
  priority: number;
  changeFrequency: "monthly" | "yearly";
};

/**
 * Every public page of the site. Metadata, the sitemap and the structured data
 * are all keyed by this list, so a page added here must be completed in each of them.
 */
export const PAGES = {
  home: {
    path: "/",
    createdAt: "2024-07-12",
    updatedAt: "2026-10-16",
    priority: 1,
    changeFrequency: "monthly",
  },
  resume: {
    path: "/resume/",
    createdAt: "2024-07-12",
    updatedAt: "2026-10-11",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  // The list of posts. It only exists in the languages that have a published post.
  posts: {
    path: "/posts/",
    createdAt: "2026-10-11",
    updatedAt: "2026-10-14",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  // The services and their prices. The same path in both languages, like the terms.
  offre: {
    path: "/offre/",
    createdAt: "2026-10-16",
    updatedAt: "2026-10-16",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  legal: {
    path: "/legal/",
    createdAt: "2026-10-10",
    updatedAt: "2026-10-15",
    priority: 0.2,
    changeFrequency: "yearly",
  },
  // The general terms of service. The English page shows the French text.
  cgv: {
    path: "/cgv/",
    createdAt: "2026-10-15",
    updatedAt: "2026-10-16",
    priority: 0.3,
    changeFrequency: "yearly",
  },
} as const satisfies Record<string, PageDefinition>;

export type PageId = keyof typeof PAGES;

export const PAGE_IDS = Object.keys(PAGES) as PageId[];
