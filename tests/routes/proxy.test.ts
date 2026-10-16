import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { getProtectedSlugs } from "@/lib/helpers/posts";
import { LOCALES } from "@/lib/i18n/config";
import { ACCESS_MAX_AGE_SECONDS, createAccessToken, getAccessCookieName } from "@/lib/posts/access";
import { config, proxy } from "@/proxy";

// Outside a running server, NextRequest does not know `trailingSlash`: the root comes
// back without its final slash. The smoke tests check the real redirect.
const location = (response: ReturnType<typeof proxy>) =>
  response?.headers.get("location")?.replace(/\/?$/, "/");

const request = (path: string, headers: Record<string, string> = {}) =>
  new NextRequest(`http://localhost${path}`, { headers });

describe("proxy: language redirect", () => {
  it("sends the root to the language of the browser", () => {
    const response = proxy(request("/", { "accept-language": "fr-FR,fr;q=0.9,en;q=0.8" }));

    expect(response?.status).toBe(307);
    expect(location(response)).toBe("http://localhost/fr/");
  });

  it("falls back to English", () => {
    expect(location(proxy(request("/resume/", { "accept-language": "de" })))).toBe(
      "http://localhost/en/resume/",
    );
    expect(location(proxy(request("/")))).toBe("http://localhost/en/");
  });

  it("prefers the language saved by the header link", () => {
    const response = proxy(request("/", { "accept-language": "fr", cookie: "NEXT_LOCALE=en" }));

    expect(location(response)).toBe("http://localhost/en/");
  });

  it("leaves a localized URL alone", () => {
    expect(proxy(request("/fr/resume/"))).toBeUndefined();
  });

  // The matcher is a literal: it must name every locale of lib/i18n/config.ts.
  it("names every locale in its matcher", () => {
    for (const locale of LOCALES) {
      expect(config.matcher[1]).toContain(`${locale}(?:/|$)`);
    }
  });
});

describe("proxy: admin gate", () => {
  const basic = `Basic ${Buffer.from("valentin:secret").toString("base64")}`;

  it("asks for credentials, and refuses everyone while none is configured", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    for (const path of [
      "/admin",
      "/admin/",
      "/admin/export/",
      "/admin/design-system/",
      "/admin/file.css",
    ]) {
      const response = proxy(request(path, { authorization: basic }));

      expect(response?.status, path).toBe(401);
      expect(response?.headers.get("www-authenticate")).toContain("Basic");
    }
  });

  it("lets the admin in, without cache or indexing", () => {
    vi.stubEnv("ADMIN_USER", "valentin");
    vi.stubEnv("ADMIN_PASSWORD", "secret");

    const response = proxy(request("/admin/", { authorization: basic }));

    expect(response?.status).toBe(200);
    expect(response?.headers.get("cache-control")).toBe("no-store");
    expect(response?.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(proxy(request("/admin/", { authorization: "Basic wrong" }))?.status).toBe(401);
  });
});

describe("proxy: protected posts", () => {
  const slug = "headless-commerce";
  const configure = () => {
    vi.stubEnv("PROTECTED_POSTS_PASSWORD", "the-password");
    vi.stubEnv("PROTECTED_POSTS_SECRET", "the-secret");
  };
  const withCookie = (path: string, value: string, name = getAccessCookieName(slug)) =>
    request(path, { cookie: `${name}=${value}` });
  const rewrittenTo = (response: ReturnType<typeof proxy>) =>
    response?.headers.get("x-middleware-rewrite");

  // The matcher is a literal: every protected post of the registry must be in it.
  it("names every protected post in its matcher", () => {
    for (const protectedSlug of getProtectedSlugs()) {
      expect(config.matcher).toContain(`/:locale(en|fr)/posts/${protectedSlug}:rest(.*)`);
      expect(config.matcher).toContain(`/posts/${protectedSlug}/:path*`);
    }
  });

  it("shows the password form in place of the post, without cache or indexing", () => {
    configure();

    for (const path of [`/fr/posts/${slug}/`, `/fr/posts/${slug}`, `/en/posts/${slug}/`]) {
      const response = proxy(request(path));

      expect(rewrittenTo(response), path).toMatch(new RegExp(`/(fr|en)/unlock/${slug}/$`));
      expect(response?.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(response?.headers.get("cache-control")).toBe("private, no-store");
    }
  });

  it("answers 404 for its images and its sharing image without a valid cookie", () => {
    configure();

    for (const path of [
      `/posts/${slug}/schema-architecture-jour.webp`,
      `/fr/posts/${slug}/opengraph-image/`,
    ]) {
      expect(proxy(request(path))?.status, path).toBe(404);
    }
  });

  it("lets a valid cookie through, and refuses an expired, forged or foreign one", () => {
    configure();
    const valid = createAccessToken(slug);
    const expired = createAccessToken(slug, Date.now() - (ACCESS_MAX_AGE_SECONDS + 60) * 1000);
    const [, signature] = valid.split(".");
    const page = `/fr/posts/${slug}/`;

    expect(rewrittenTo(proxy(withCookie(page, valid)))).toBeNull();
    expect(proxy(withCookie(page, valid))?.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(proxy(withCookie(`/posts/${slug}/schema-cms-jour.webp`, valid))?.status).toBe(200);

    for (const value of [expired, `9999999999.${signature}`, createAccessToken("pensee")]) {
      expect(rewrittenTo(proxy(withCookie(page, value)))).toContain("/unlock/");
    }

    // A valid value under the name of another post.
    expect(rewrittenTo(proxy(withCookie(page, valid, getAccessCookieName("pensee"))))).toContain(
      "/unlock/",
    );
  });

  it("keeps the post closed, with a 404, while the variables are missing", () => {
    expect(rewrittenTo(proxy(request(`/fr/posts/${slug}/`)))).toMatch(/\/fr\/not-found\/$/);
  });

  it("leaves public posts to the CDN", () => {
    expect(proxy(request("/fr/posts/pensee/"))).toBeUndefined();
  });
});
