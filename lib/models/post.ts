import { type MDXContent } from "mdx/types";
import { type Locale } from "@/lib/i18n/config";
import { type IsoDate } from "@/lib/models/experience";
import { type PersonalProjectId } from "@/lib/models/personal-project";

/** One language version of a post. */
export type PostVersion = {
  title: string;
  /** One or two sentences: shown in the list, in search results and in the meta tags. */
  description: string;
  /** The lead under the title of the post, also the description of its feed item. */
  lead: string;
  /** Short lowercase keywords, shown as chips and used as feed categories and `keywords`. */
  tags: string[];
  /** Text alternative of the cover image, when the post has one. */
  coverAlt?: string;
};

/** The project a post is about, described in its structured data. */
export type PostProject = {
  name: string;
  type: "MobileApplication" | "WebApplication" | "WebSite";
  /** schema.org category, for example `BusinessApplication`. Applications only. */
  applicationCategory?: string;
  operatingSystem?: string;
  url?: string;
  /** The project card of the home page that links to this post. */
  personalProjectId?: PersonalProjectId;
};

/**
 * `public` (the default): listed everywhere. `protected`: published but listed nowhere,
 * readable only with the password (docs/features/posts.md#protected-posts).
 */
export type PostVisibility = "public" | "protected";

/** One same-origin image of a post, its size in real pixels. */
export type PostImage = { src: string; width: number; height: number };

export type Post = {
  /** Last segment of the URL, the same in every language. Never change it once published. */
  slug: string;
  publishedAt: IsoDate;
  /** Last change a reader would notice. */
  updatedAt: IsoDate;
  /** A draft is visible in development and on preview deployments, never in production. */
  draft?: boolean;
  visibility?: PostVisibility;
  /**
   * One image, same-origin, in pixels: the `-jour` variant when the image comes as a pair.
   * Used by the structured data and the sitemap.
   */
  cover?: PostImage;
  /**
   * Images of the body worth listing, after the cover, in the structured data and the
   * sitemap. Same form as the cover: the `-jour` file of a pair, in pixels.
   */
  images?: PostImage[];
  project?: PostProject;
  /** A post may exist in one language only. Its body is in lib/constants/post-bodies.ts. */
  versions: Partial<Record<Locale, PostVersion>>;
};

/** A post as seen in one language. */
export type LocalizedPost = Omit<Post, "versions"> & PostVersion & { locale: Locale };

/** Loads the compiled MDX body of one language version. */
export type PostBodyLoader = () => Promise<{ default: MDXContent }>;
