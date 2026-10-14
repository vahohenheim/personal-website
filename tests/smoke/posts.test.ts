import { createHmac } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { get, SMOKE } from "./settings";

const PUBLIC_POSTS = ["pensee", "lotus", "brut"];
const PROTECTED = "headless-commerce";
const COOKIE = `post_access_${PROTECTED}`;

// Sentences of the protected post that must never leave the server without the cookie.
const SECRET_SENTENCES = [
  "Sortir d’un monolithe",
  "Gravitee, une passerelle devant l’ERP",
  "Moving off a monolith",
  "Gravitee, a gateway in front of the ERP",
];

/** Every JSON-LD graph of a page, parsed. */
const readJsonLd = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)].map(
    (match) => JSON.parse(match[1]) as { "@graph": Record<string, unknown>[] },
  );

/** Same format as lib/posts/access.ts, built here to forge and age cookies. */
const token = (slug: string, expiresAt: number, secret: string = SMOKE.postsSecret) =>
  `${expiresAt}.${createHmac("sha256", secret).update(`${slug}.${expiresAt}`).digest("base64url")}`;

const inThirtyDays = () => Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;

const unlock = (password: string) =>
  fetch(`${SMOKE.baseUrl}/api/posts/unlock/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      slug: PROTECTED,
      password,
      website: "",
      startedAt: Date.now() - 5000,
    }),
  });

describe("posts", () => {
  it.each(
    ["fr", "en"].flatMap((locale) => [
      `/${locale}/posts/`,
      ...PUBLIC_POSTS.map((slug) => `/${locale}/posts/${slug}/`),
    ]),
  )("serves %s with parseable structured data and images that load", async (path) => {
    const response = await get(path);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);

    const graphs = readJsonLd(html);

    expect(graphs).toHaveLength(1);
    expect(graphs[0]["@graph"].length).toBeGreaterThan(0);

    const images = [...html.matchAll(/<img[^>]+src="(\/posts\/[^"]+)"/g)].map((m) => m[1]);

    // The lists have no image; every post has some.
    expect(images.length > 0).toBe(!path.endsWith("/posts/"));

    for (const src of new Set(images)) {
      expect((await get(src)).status, src).toBe(200);
    }
  });

  it("serves the performance section of the BRUT post with its four visuals", async () => {
    const html = await (await get("/fr/posts/brut/")).text();

    expect(html).toContain('id="mesurer-puis-alleger"');
    expect(html).toContain('href="#mesurer-puis-alleger"');

    for (const name of ["scores", "lcp", "poids", "video"]) {
      for (const mode of ["jour", "nuit"]) {
        const src = `/posts/brut/perf-${name}-${mode}.webp`;

        expect(html, src).toContain(`src="${src}"`);
        expect((await get(src)).status, src).toBe(200);
      }
    }
  });

  it("serves the sharing image of each post", async () => {
    for (const slug of PUBLIC_POSTS) {
      const response = await get(`/fr/posts/${slug}/opengraph-image/`);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("image/png");
    }
  });

  it.each([
    ["fr", "lire l’article"],
    ["en", "read the post"],
  ])(
    "lists the %s posts on the home page, in the feed and in the sitemap, never the protected one",
    async (locale, readPost) => {
      const home = await (await get(`/${locale}/`)).text();
      const list = await (await get(`/${locale}/posts/`)).text();
      const feed = await (await get(`/${locale}/posts/feed.xml`)).text();
      const sitemap = await (await get("/sitemap.xml")).text();

      for (const slug of PUBLIC_POSTS) {
        expect(home).toContain(`href="/${locale}/posts/${slug}/"`);
        expect(feed).toContain(`/${locale}/posts/${slug}/`);
        expect(sitemap).toContain(`/${locale}/posts/${slug}/`);
      }

      expect(home).toContain(`href="/${locale}/posts/"`);
      expect(home).toContain(readPost);
      expect(feed).toContain("<category>expo</category>");
      expect(sitemap).toContain("<image:loc>https://www.valentinbourreau.com/posts/pensee/");

      for (const text of [home, list, feed, sitemap]) {
        expect(text).not.toContain(PROTECTED);
      }
    },
  );
});

describe("protected post", () => {
  const page = `/fr/posts/${PROTECTED}/`;
  const withCookie = (value: string, path = page, headers: Record<string, string> = {}) =>
    get(path, { cookie: `${COOKIE}=${value}`, ...headers });

  const expectLocked = async (response: Response) => {
    const body = await response.text();

    for (const sentence of SECRET_SENTENCES) {
      expect(body).not.toContain(sentence);
    }

    expect(body).not.toContain("Refondre un e-commerce");
    expect(body).not.toContain("Rebuilding an e-commerce site");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");

    return body;
  };

  it("shows the password form, and nothing of the post, without a cookie (HTML and RSC)", async () => {
    const html = await get(page);

    expect(html.status).toBe(200);
    expect(await expectLocked(html)).toContain("Article protégé");
    await expectLocked(await get(page, { rsc: "1" }));
    await expectLocked(await get(page, { rsc: "1", "next-router-prefetch": "1" }));

    const english = `/en/posts/${PROTECTED}/`;

    expect(await expectLocked(await get(english))).toContain("Protected post");
    await expectLocked(await get(english, { rsc: "1" }));
  });

  it("keeps its images and its sharing image closed", async () => {
    for (const path of [
      `/posts/${PROTECTED}/schema-architecture-jour.webp`,
      `/fr/posts/${PROTECTED}/opengraph-image/`,
      `/_next/image/?url=%2Fposts%2F${PROTECTED}%2Fschema-architecture-jour.webp&w=640&q=75`,
    ]) {
      expect((await get(path)).status, path).toBeGreaterThanOrEqual(400);
    }
  });

  it("opens with the right password, for this post only", async () => {
    expect((await unlock("wrong")).status).toBe(401);

    const response = await unlock(SMOKE.postsPassword);
    const value = new RegExp(`${COOKIE}=([^;]+)`).exec(
      response.headers.get("set-cookie") ?? "",
    )?.[1];

    expect(response.status).toBe(200);
    expect(value).toBeDefined();

    const opened = await withCookie(value ?? "");
    const html = await opened.text();

    expect(opened.status).toBe(200);
    expect(html).toContain(SECRET_SENTENCES[0]);
    expect(html).toContain('<meta name="robots" content="noindex, nofollow"');
    expect(opened.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect((await withCookie(value ?? "", `/posts/${PROTECTED}/schema-cms-jour.webp`)).status).toBe(
      200,
    );
  });

  it("refuses an expired, forged or foreign cookie", async () => {
    const past = Math.floor(Date.now() / 1000) - 60;

    for (const value of [
      token(PROTECTED, past),
      token(PROTECTED, inThirtyDays(), "another-secret"),
      token("pensee", inThirtyDays()),
      `${inThirtyDays()}.forged`,
    ]) {
      await expectLocked(await withCookie(value));
    }
  });
});

describe("build output", () => {
  it("leaves no sentence of the protected post in the public files", () => {
    const files = (dir: string): string[] =>
      readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);

        return statSync(path).isDirectory() ? files(path) : [path];
      });

    for (const file of files(".next/static")) {
      const text = readFileSync(file, "utf8");

      for (const sentence of SECRET_SENTENCES) {
        expect(text.includes(sentence), file).toBe(false);
      }
    }
  });
});
