import { describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import { POSTS } from "@/lib/constants/posts";
import { getLanguageFallbacks, getPost, getPosts, getPostsLocales } from "@/lib/helpers/posts";
import { LOCALES } from "@/lib/i18n/config";

const drafts = POSTS.filter((post) => post.draft);
const published = POSTS.filter((post) => !post.draft);

describe("posts", () => {
  it("hides drafts outside development", () => {
    for (const locale of LOCALES) {
      expect(getPosts(locale).some((post) => post.draft)).toBe(false);
    }

    for (const draft of drafts) {
      expect(getPost(draft.slug, "fr")).toBeUndefined();
    }
  });

  it("shows drafts in development", () => {
    vi.stubEnv("NODE_ENV", "development");

    for (const draft of drafts) {
      const locale = LOCALES.find((candidate) => draft.versions[candidate]);

      expect(locale && getPost(draft.slug, locale)?.draft).toBe(true);
    }
  });

  it("lists posts most recent first", () => {
    vi.stubEnv("NODE_ENV", "development");
    const dates = getPosts("fr").map((post) => post.publishedAt);

    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("gives every version a title and a description short enough for search results", () => {
    for (const post of POSTS) {
      for (const version of Object.values(post.versions)) {
        expect(version.title).not.toBe("");
        expect(version.description.length).toBeLessThanOrEqual(155);
      }

      expect(post.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("sends the language link to the home page when the other language has no post", () => {
    vi.stubEnv("NODE_ENV", "production");

    if (getPostsLocales().length === 0) {
      expect(getLanguageFallbacks("fr", "en")).toEqual({ "/fr/posts/": "/en/" });
    }
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

  it("never lists a draft, the print page or the admin", () => {
    const urls = sitemap().map((entry) => entry.url);

    for (const draft of drafts) {
      expect(urls.some((url) => url.includes(`/posts/${draft.slug}/`))).toBe(false);
    }

    expect(urls.some((url) => url.includes("/print/") || url.includes("/admin"))).toBe(false);

    if (published.length === 0) {
      expect(urls.some((url) => url.includes("/posts/"))).toBe(false);
    }
  });
});
