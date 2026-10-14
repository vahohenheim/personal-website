import { describe, expect, it } from "vitest";
import { PAGE_IDS } from "@/lib/constants/pages";
import { POSTS } from "@/lib/constants/posts";
import { getPageGraph, getPostJsonLd } from "@/lib/helpers/json-ld";
import { getPost, getPosts, getPostLocales } from "@/lib/helpers/posts";
import { LOCALES } from "@/lib/i18n/config";

type Node = Record<string, unknown>;

/** Every value of a graph, with its path, to look for holes. */
const walk = (value: unknown, path: string, visit: (value: unknown, path: string) => void) => {
  visit(value, path);

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      walk(item, `${path}[${index}]`, visit);
    });
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      walk(child, `${path}.${key}`, visit);
    }
  }
};

const URL_KEYS = new Set(["@id", "url", "item", "image", "codeRepository", "sameAs"]);

/** No undefined, empty or relative value; the graph survives a JSON round trip. */
const expectSound = (graph: unknown, name: string) => {
  expect(JSON.parse(JSON.stringify(graph))).toEqual(graph);

  walk(graph, name, (value, path) => {
    expect(value, path).not.toBeUndefined();
    expect(value, path).not.toBeNull();
    expect(value, path).not.toBe("");

    const key =
      path
        .split(".")
        .pop()
        ?.replace(/\[\d+\]$/, "") ?? "";

    if (typeof value === "string" && URL_KEYS.has(key)) {
      expect(value, path).toMatch(/^https:\/\//);
    }
  });
};

const nodes = (graph: { "@graph": unknown }) => graph["@graph"] as Node[];
const byType = (graph: { "@graph": unknown }, type: string) =>
  nodes(graph).find((node) => node["@type"] === type);

describe("structured data of every generated page", () => {
  it.each(LOCALES.flatMap((locale) => PAGE_IDS.map((page) => [page, locale] as const)))(
    "%s in %s is complete",
    (page, locale) => {
      const graph = getPageGraph(page, locale);

      expect(nodes(graph).length).toBeGreaterThan(0);
      expectSound(graph, `${page}/${locale}`);
    },
  );

  it.each(POSTS.flatMap((post) => getPostLocales(post.slug).map((locale) => [post.slug, locale])))(
    "post %s in %s is complete",
    (slug, locale) => {
      const post = getPost(slug, locale as "fr");

      expect(post).toBeDefined();

      if (post) {
        expectSound(getPostJsonLd(post), `${slug}/${locale}`);
      }
    },
  );
});

describe("graph of a post", () => {
  const post = getPost("pensee", "fr");
  const graph = post ? getPostJsonLd(post) : { "@graph": [] };
  const posting = byType(graph, "BlogPosting") ?? {};

  it("is a page, a post and a trail", () => {
    expect(nodes(graph).map((node) => node["@type"])).toEqual([
      "WebPage",
      "BlogPosting",
      "BreadcrumbList",
    ]);
    expect(byType(graph, "WebPage")?.breadcrumb).toEqual({
      "@id": "https://www.valentinbourreau.com/fr/posts/pensee/#breadcrumb",
    });
    expect(
      (byType(graph, "BreadcrumbList")?.itemListElement as Node[]).map((item) => item.name),
    ).toEqual(["Accueil", "Articles", "pensee, un carnet hors ligne qui prend du recul"]);
  });

  it("describes the post from the registry and its source", () => {
    expect(posting).toMatchObject({
      headline: "pensee, un carnet hors ligne qui prend du recul",
      abstract: post?.lead,
      datePublished: "2026-10-13",
      inLanguage: "fr",
      articleSection: "Projets",
      keywords: "expo, react native, next.js, sqlite, postgres, api claude, local-first",
      author: { "@id": "https://www.valentinbourreau.com/#person" },
      publisher: { "@id": "https://www.valentinbourreau.com/#person" },
      isPartOf: { "@id": "https://www.valentinbourreau.com/fr/posts/#blog" },
      about: {
        "@type": "MobileApplication",
        name: "pensee",
        operatingSystem: "iOS",
        applicationCategory: "LifestyleApplication",
      },
    });
    expect(posting.wordCount).toBeGreaterThan(1000);
    expect(posting.timeRequired).toMatch(/^PT\d+M$/);
    expect(posting.image).toEqual([
      expect.objectContaining({
        url: "https://www.valentinbourreau.com/posts/pensee/schema-architecture-jour.webp",
        width: "2080",
        height: "1200",
      }),
      expect.objectContaining({
        url: "https://www.valentinbourreau.com/fr/posts/pensee/opengraph-image/",
        width: "1200",
        height: "630",
      }),
    ]);
  });

  it("describes a website project with its URL", () => {
    const brut = getPost("brut", "fr");

    expect(brut && byType(getPostJsonLd(brut), "BlogPosting")?.about).toEqual({
      "@type": "WebSite",
      name: "BRUT",
      url: "https://www.mangezbrut.fr",
    });
  });

  it("lists the images of the body after the cover and the sharing image", () => {
    const brut = getPost("brut", "fr");
    const image = brut && byType(getPostJsonLd(brut), "BlogPosting")?.image;

    expect(image).toEqual([
      expect.objectContaining({ url: "https://www.valentinbourreau.com/posts/brut/accueil.webp" }),
      expect.objectContaining({
        url: "https://www.valentinbourreau.com/fr/posts/brut/opengraph-image/",
      }),
      ...[
        "https://www.valentinbourreau.com/posts/brut/perf-scores-jour.webp",
        "https://www.valentinbourreau.com/posts/brut/perf-lcp-jour.webp",
        "https://www.valentinbourreau.com/posts/brut/perf-poids-jour.webp",
        "https://www.valentinbourreau.com/posts/brut/perf-video-jour.webp",
      ].map((url) => ({ "@type": "ImageObject", url, width: "2080", height: "1200" })),
    ]);
  });
});

describe("graphs of the list and of the home page", () => {
  it("makes the list a collection page with its blog, without protected posts", () => {
    const graph = getPageGraph("posts", "fr");
    const blog = byType(graph, "Blog");

    expect(byType(graph, "CollectionPage")).toBeDefined();
    expect(byType(graph, "BreadcrumbList")).toBeDefined();
    expect((blog?.blogPost as Node[]).map((item) => item.url)).toEqual(
      getPosts("fr").map((item) => `https://www.valentinbourreau.com/fr/posts/${item.slug}/`),
    );
    expect(JSON.stringify(graph)).not.toContain("headless-commerce");
  });

  it("references the blog from the home page only where posts are listed", () => {
    expect(byType(getPageGraph("home", "fr"), "ProfilePage")?.hasPart).toEqual({
      "@id": "https://www.valentinbourreau.com/fr/posts/#blog",
    });
    expect(byType(getPageGraph("home", "en"), "ProfilePage")?.hasPart).toBeUndefined();
    expect(JSON.stringify(getPageGraph("home", "fr"))).not.toContain("BlogPosting");
  });
});
