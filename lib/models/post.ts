import { type MDXContent } from "mdx/types";
import { type Locale } from "@/lib/i18n/config";
import { type IsoDate } from "@/lib/models/experience";

/** One language version of a post. */
export type PostVersion = {
  title: string;
  /** One or two sentences: shown in the list, in search results and in the feed. */
  description: string;
  /** The body, an MDX file in `content/posts/<slug>/<locale>.mdx`. */
  load: () => Promise<{ default: MDXContent }>;
};

export type Post = {
  /** Last segment of the URL, the same in every language. Never change it once published. */
  slug: string;
  publishedAt: IsoDate;
  /** Last change a reader would notice. */
  updatedAt: IsoDate;
  /** A draft is only visible in development: no page, no link, no feed entry in production. */
  draft?: boolean;
  /** A post may exist in one language only. */
  versions: Partial<Record<Locale, PostVersion>>;
};

/** A post as seen in one language. */
export type LocalizedPost = Omit<Post, "versions"> & PostVersion & { locale: Locale };
