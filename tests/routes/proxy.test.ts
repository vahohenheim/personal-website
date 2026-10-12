import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { LOCALES } from "@/lib/i18n/config";
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

    for (const path of ["/admin", "/admin/", "/admin/export/", "/admin/file.css"]) {
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
