import { type Locale } from "@/lib/i18n/config";
import { type PostBodyLoader } from "@/lib/models/post";

/**
 * The MDX body of each language version of each post of POSTS, loaded on demand. Kept
 * apart from the registry so that proxy.ts can read the registry without compiling the
 * bodies into its bundle. A test checks that every version has its loader and its file.
 */
export const POST_BODIES: Partial<Record<string, Partial<Record<Locale, PostBodyLoader>>>> = {
  brut: { fr: () => import("@/content/posts/brut/fr.mdx") },
  lotus: { fr: () => import("@/content/posts/lotus/fr.mdx") },
  "headless-commerce": { fr: () => import("@/content/posts/headless-commerce/fr.mdx") },
  pensee: { fr: () => import("@/content/posts/pensee/fr.mdx") },
  "example-draft": {
    fr: () => import("@/content/posts/example-draft/fr.mdx"),
    en: () => import("@/content/posts/example-draft/en.mdx"),
  },
};
