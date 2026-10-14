import { POSTS } from "@/lib/constants/posts";

/**
 * Runs `test` with a registry where every post exists in French only, then puts the real
 * registry back: the case of a language without any post, whatever the content is today.
 */
export const withFrenchOnlyPosts = (test: () => void) => {
  const saved = POSTS.splice(
    0,
    POSTS.length,
    ...POSTS.map((post) => ({ ...post, versions: { fr: post.versions.fr } })),
  );

  try {
    test();
  } finally {
    POSTS.splice(0, POSTS.length, ...saved);
  }
};
