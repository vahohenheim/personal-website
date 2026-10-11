import { type Post } from "@/lib/models/post";

/**
 * Every post of the site. To publish one: write `content/posts/<slug>/<locale>.mdx`, add
 * an entry here, and remove `draft` when it is ready. See docs/features/posts.md.
 */
export const POSTS: Post[] = [
  {
    slug: "example-draft",
    publishedAt: "2026-10-11",
    updatedAt: "2026-10-11",
    // A template showing what a post can contain. It is not meant to be published.
    draft: true,
    versions: {
      fr: {
        title: "Exemple : la forme d’un article",
        description:
          "Un brouillon qui montre ce qu’un article peut contenir : intertitres, listes, citation, code. Visible en développement seulement.",
        load: () => import("@/content/posts/example-draft/fr.mdx"),
      },
      en: {
        title: "Example: what a post looks like",
        description:
          "A draft showing what a post can contain: headings, lists, a quote, code. Only visible in development.",
        load: () => import("@/content/posts/example-draft/en.mdx"),
      },
    },
  },
];
