import { describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import { POSTS } from "@/lib/constants/posts";
import {
  areDraftsVisible,
  formatPostDate,
  getIndexablePosts,
  getHomePosts,
  getLanguageFallbacks,
  getNextPost,
  getPost,
  getPostForProject,
  getPosts,
  getPostsLocales,
  getProtectedSlugs,
  getReadingStats,
  getSectionId,
  getTableOfContents,
  resolvePostImage,
  toIsoDuration,
} from "@/lib/helpers/posts";
import { LOCALES } from "@/lib/i18n/config";

const drafts = POSTS.filter((post) => post.draft);
const protectedPosts = POSTS.filter((post) => post.visibility === "protected");

describe("drafts, by environment", () => {
  it("are hidden in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");

    expect(areDraftsVisible()).toBe(false);

    for (const locale of LOCALES) {
      expect(getPosts(locale).some((post) => post.draft)).toBe(false);
    }

    for (const draft of drafts) {
      expect(getPost(draft.slug, "fr")).toBeUndefined();
    }
  });

  it("are shown in development", () => {
    vi.stubEnv("NODE_ENV", "development");

    for (const draft of drafts) {
      const locale = LOCALES.find((candidate) => draft.versions[candidate]);

      expect(locale && getPost(draft.slug, locale)?.draft).toBe(true);
    }
  });

  it("are shown on a preview deployment, but never indexed", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "preview");

    expect(areDraftsVisible()).toBe(true);
    expect(getPosts("fr").some((post) => post.draft)).toBe(drafts.length > 0);
    expect(getIndexablePosts("fr").some((post) => post.draft)).toBe(false);

    const urls = sitemap().map((entry) => entry.url);

    for (const draft of drafts) {
      expect(urls.some((url) => url.includes(`/posts/${draft.slug}/`))).toBe(false);
    }
  });
});

describe("posts", () => {
  it("lists posts most recent first, the registry order breaking ties", () => {
    const listed = getPosts("fr");
    const dates = listed.map((post) => post.publishedAt);

    expect(dates).toEqual([...dates].sort().reverse());
    expect(listed.map((post) => post.slug)).toEqual(["brut", "lotus", "pensee"]);
  });

  it("gives every version a title, a lead and a description short enough", () => {
    for (const post of POSTS) {
      for (const version of Object.values(post.versions)) {
        expect(version.title).not.toBe("");
        expect(version.lead).not.toBe("");
        expect(version.description.length).toBeLessThan(155);
      }

      expect(post.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("links to the next post, looping, and never to a protected one", () => {
    expect(getNextPost("brut", "fr")?.slug).toBe("lotus");
    expect(getNextPost("pensee", "fr")?.slug).toBe("brut");

    for (const post of POSTS) {
      expect(protectedPosts.map(({ slug }) => slug)).not.toContain(
        getNextPost(post.slug, "fr")?.slug,
      );
    }
  });

  it("finds the post of a project card", () => {
    expect(getPostForProject("pensee", "fr")?.slug).toBe("pensee");
    expect(getPostForProject("editorials", "fr")).toBeUndefined();
    expect(getPostForProject("pensee", "en")).toBeUndefined();
  });

  it("formats dates as days", () => {
    expect(formatPostDate("2026-10-13", "fr")).toBe("13 oct. 2026");
    expect(formatPostDate("2026-10-13", "en")).toBe("Oct 13, 2026");
  });

  it("sends the language link of a post without translation to a page that exists", () => {
    vi.stubEnv("NODE_ENV", "production");

    const fallbacks = getLanguageFallbacks("fr", "en");
    const expected = getPostsLocales().includes("en") ? "/en/posts/" : "/en/";

    expect(fallbacks.post).toBe(expected);
    expect(fallbacks.otherPosts).not.toContain("/en/posts/pensee/");
    // Nothing the header sends to the browser names a protected post.
    expect(JSON.stringify(fallbacks)).not.toContain("headless-commerce");
  });
});

describe("protected posts", () => {
  it("are readable at their URL but listed nowhere", () => {
    expect(protectedPosts.length).toBeGreaterThan(0);

    for (const post of protectedPosts) {
      expect(getProtectedSlugs()).toContain(post.slug);
      expect(getPost(post.slug, "fr")).toBeDefined();

      for (const locale of LOCALES) {
        expect(getPosts(locale).map(({ slug }) => slug)).not.toContain(post.slug);
        expect(getIndexablePosts(locale).map(({ slug }) => slug)).not.toContain(post.slug);
      }

      expect(sitemap().some(({ url }) => url.includes(`/posts/${post.slug}/`))).toBe(false);
    }
  });

  it("are not linked from a project card", () => {
    for (const post of protectedPosts) {
      const id = post.project?.personalProjectId;

      if (id) {
        expect(getPostForProject(id, "fr")?.slug).not.toBe(post.slug);
      }
    }
  });
});

describe("reading the MDX source", () => {
  const source = `{/* A comment that is not counted. */}

<Shot src="/posts/x/a" alt="Not counted either" width={10} height={10} />

<Section n="01" label="contexte" title="L’architecture">

Un deux trois : quatre.

<PlusList>
  <Plus title="Titre compté.">
    Cinq six.
  </Plus>
</PlusList>

\`\`\`text
code not counted <Section n="09" title="Inside code">
\`\`\`

</Section>

<Section>

Sept.

</Section>

<Section n="02" title="Écrire sans réseau"></Section>`;

  it("builds the summary from the numbered sections, outside code", () => {
    expect(getTableOfContents(source)).toEqual([
      { n: "01", label: "contexte", title: "L’architecture", id: "l-architecture" },
      { n: "02", title: "Écrire sans réseau", id: "ecrire-sans-reseau" },
    ]);
  });

  it("counts the words of the prose only", () => {
    // un deux trois quatre cinq six sept: attributes, comments and code are left out.
    expect(getReadingStats(source)).toEqual({ words: 7, minutes: 1 });
    expect(getReadingStats("mot ".repeat(2201)).minutes).toBe(11);
    expect(toIsoDuration(12)).toBe("PT12M");
  });

  it("derives stable anchors", () => {
    expect(getSectionId("Le Recul : une IA qui relit un journal")).toBe(
      "le-recul-une-ia-qui-relit-un-journal",
    );
  });

  it("resolves a src without extension to a day and night pair", () => {
    expect(resolvePostImage("/posts/pensee/ecran-notes")).toEqual({
      kind: "pair",
      light: "/posts/pensee/ecran-notes-jour.webp",
      dark: "/posts/pensee/ecran-notes-nuit.webp",
    });
    expect(resolvePostImage("/posts/brut/accueil.webp")).toEqual({
      kind: "single",
      src: "/posts/brut/accueil.webp",
    });
  });
});

describe("sitemap", () => {
  it("lists every page in every language, with its alternates", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    for (const path of ["/", "/resume/", "/legal/"]) {
      for (const locale of LOCALES) {
        expect(urls).toContain(`https://www.valentinbourreau.com/${locale}${path}`);
      }
    }

    expect(new Set(urls).size).toBe(urls.length);
    expect(entries[0].alternates?.languages).toHaveProperty("x-default");
  });

  it("lists each published post with its date and its cover", () => {
    const entry = sitemap().find(
      ({ url }) => url === "https://www.valentinbourreau.com/fr/posts/pensee/",
    );

    expect(entry?.lastModified).toBe("2026-10-13");
    expect(entry?.images).toEqual([
      "https://www.valentinbourreau.com/posts/pensee/schema-architecture-jour.webp",
    ]);
    expect(sitemap().map(({ url }) => url)).toContain("https://www.valentinbourreau.com/fr/posts/");
  });

  it("never lists a draft, the print page or the admin", () => {
    const urls = sitemap().map((entry) => entry.url);

    for (const draft of drafts) {
      expect(urls.some((url) => url.includes(`/posts/${draft.slug}/`))).toBe(false);
    }

    expect(
      urls.some(
        (url) => url.includes("/print/") || url.includes("/admin") || url.includes("/unlock/"),
      ),
    ).toBe(false);
  });
});

describe("home page block", () => {
  it("shows the three latest listed posts, and nothing in a language without any", () => {
    expect(getHomePosts("fr").map(({ slug }) => slug)).toEqual(["brut", "lotus", "pensee"]);
    expect(getHomePosts("en")).toEqual([]);
  });

  it("disappears when no post is published", () => {
    vi.stubEnv("NODE_ENV", "production");
    const saved = POSTS.splice(0, POSTS.length, ...drafts);

    try {
      expect(getHomePosts("fr")).toEqual([]);
    } finally {
      POSTS.splice(0, POSTS.length, ...saved);
    }
  });
});
