import { describe, expect, it } from "vitest";
import { adminAuthorization, get, post, SMOKE } from "./settings";

const LOCALES = ["fr", "en"];
const PAGES = ["/", "/resume/", "/legal/", "/cgv/"];

/** Path a redirect points to, whether the header is absolute or relative. */
const target = (response: Response) =>
  new URL(response.headers.get("location") ?? "", SMOKE.baseUrl).pathname;

/** The JSON-LD graph of a page, parsed. */
const readJsonLd = (html: string) => {
  const match = /<script type="application\/ld\+json">([^<]*)<\/script>/.exec(html);

  return match ? (JSON.parse(match[1]) as { "@graph": { "@type": string }[] }) : null;
};

describe("public pages", () => {
  it.each(LOCALES.flatMap((locale) => PAGES.map((page) => `/${locale}${page}`)))(
    "serves %s with its language, one title and structured data",
    async (path) => {
      const response = await get(path);
      const html = await response.text();

      expect(response.status).toBe(200);
      expect(html).toContain(`<html lang="${path.slice(1, 3)}"`);
      expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
      expect(html).toContain(
        `<link rel="canonical" href="https://www.valentinbourreau.com${path}"`,
      );
      expect(html).toMatch(/<meta name="description" content="[^"]{50,}"/);
      expect(readJsonLd(html)?.["@graph"].length).toBeGreaterThan(0);
    },
  );

  it("describes the person on the home page and the resume", async () => {
    for (const path of ["/fr/", "/en/resume/"]) {
      const types = readJsonLd(await (await get(path)).text())?.["@graph"].map(
        (node) => node["@type"],
      );

      expect(types).toContain("Person");
      expect(types).toContain("ProfilePage");
    }
  });

  it("redirects the root to the language of the browser", async () => {
    const french = await get("/", { "accept-language": "fr-FR,fr;q=0.9" });
    const other = await get("/resume/", { "accept-language": "de" });

    expect(french.status).toBe(307);
    expect(target(french)).toBe("/fr/");
    expect(target(other)).toBe("/en/resume/");
  });

  it("answers 404 in the right language for an unknown page", async () => {
    const response = await get("/fr/nope/");

    // The 404 page is streamed: its French text is in the payload of the response.
    expect(response.status).toBe(404);
    expect((await response.text()).includes("la page n’a pas été trouvée")).toBe(true);
  });

  it("sends the security headers", async () => {
    const { headers } = await get("/fr/");

    expect(headers.get("content-security-policy")).toContain("default-src 'self'");
    expect(headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
    expect(headers.get("x-frame-options")).toBe("DENY");
    expect(headers.get("x-content-type-options")).toBe("nosniff");
  });
});

describe("files and feeds", () => {
  it("serves the sitemap, robots and manifest", async () => {
    const sitemap = await (await get("/sitemap.xml")).text();
    const robots = await (await get("/robots.txt")).text();

    expect(sitemap).toContain("<loc>https://www.valentinbourreau.com/fr/</loc>");
    expect(sitemap).toContain("<loc>https://www.valentinbourreau.com/en/resume/</loc>");
    expect(sitemap).not.toContain("/print/");
    expect(sitemap).not.toContain("/admin");
    expect(robots).toContain("Sitemap: https://www.valentinbourreau.com/sitemap.xml");
    expect((await get("/manifest.webmanifest")).status).toBe(200);
  });

  it("serves the resume as a PDF in each language", async () => {
    for (const locale of LOCALES) {
      const response = await get(`/cv-${locale}.pdf`);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("application/pdf");
      expect(await (await get(`/${locale}/resume/`)).text()).toContain(`href="/cv-${locale}.pdf"`);
    }

    const old = await get("/cv.pdf");

    expect(old.status).toBe(308);
    expect(target(old)).toBe("/cv-fr.pdf");
  });

  it("serves the PDF of the terms, linked from the terms in each language", async () => {
    const response = await get("/cgv/cgp-1.0.pdf");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/pdf");

    for (const locale of LOCALES) {
      expect(await (await get(`/${locale}/cgv/`)).text()).toContain('href="/cgv/cgp-1.0.pdf"');
    }
  });

  it("lists the terms in the sitemap and links them from every footer", async () => {
    const sitemap = await (await get("/sitemap.xml")).text();

    expect(sitemap).toContain("<loc>https://www.valentinbourreau.com/fr/cgv/</loc>");
    expect(sitemap).toContain("<loc>https://www.valentinbourreau.com/en/cgv/</loc>");

    for (const path of ["/fr/", "/en/", "/fr/resume/", "/en/legal/"]) {
      const html = await (await get(path)).text();

      expect(html, path).toContain(`href="/${path.slice(1, 3)}/cgv/"`);
      expect(html, path).toContain(`href="/${path.slice(1, 3)}/legal/"`);
    }
  });

  it("shows the French terms on the English page, marked as French", async () => {
    const html = await (await get("/en/cgv/")).text();

    expect(html).toContain('<html lang="en"');
    expect(html).toContain('<article lang="fr"');
    expect(html).toContain("These terms are available in French only.");
    expect(html).toContain("Objet et champ d’application");
  });

  it("keeps the print page of the resume out of search engines", async () => {
    const response = await get("/fr/resume/print/");

    expect(response.status).toBe(200);
    expect(await response.text()).toContain('<meta name="robots" content="noindex, nofollow"');
  });

  it("does not publish drafts", async () => {
    expect((await get("/fr/posts/example-draft/")).status).toBe(404);
    expect(await (await get("/fr/posts/feed.xml")).text()).not.toContain("example-draft");
  });
});

describe("admin", () => {
  it("asks for credentials on every admin URL", async () => {
    for (const path of ["/admin/", "/admin/export/", "/admin/anything.css"]) {
      const response = await get(path);

      expect(response.status, path).toBe(401);
      expect(response.headers.get("www-authenticate")).toContain("Basic");
    }

    expect((await get("/admin/", { authorization: "Basic d3Jvbmc6d3Jvbmc=" })).status).toBe(401);
  });

  it("opens for the admin, without cache or indexing", async () => {
    const response = await get("/admin/", { authorization: adminAuthorization });
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(html).toContain("Demandes de contact");
  });
});

describe("contact form, from the request to the admin", () => {
  it("stores a lead, counts the steps and shows both in the admin", async () => {
    const email = `smoke-${Date.now()}@example.com`;

    expect((await post("/api/events/", { event: "contact_open" })).status).toBe(204);
    expect((await post("/api/events/", { event: "contact_sent" })).status).toBe(204);

    const sent = await post("/api/contact/", {
      need: "quality",
      timeline: "later",
      message: "A smoke test message, long enough.",
      name: "Smoke Test",
      email,
      company: "",
      locale: "en",
      source: "smoke.example",
      website: "",
      startedAt: Date.now() - 10_000,
    });

    expect(sent.status).toBe(200);
    expect(await sent.json()).toEqual({ ok: true });

    const csv = await (await get("/admin/export/", { authorization: adminAuthorization })).text();
    const admin = await (await get("/admin/", { authorization: adminAuthorization })).text();

    expect(csv).toContain(email);
    expect(csv).toContain('"smoke.example"');
    expect(admin).toContain(email);
    expect(admin).toContain("Formulaire ouvert");
  });

  it("refuses an invalid form and answers a bot like a person", async () => {
    const invalid = await post("/api/contact/", {
      need: "quality",
      startedAt: Date.now() - 10_000,
    });
    const bot = await post("/api/contact/", { website: "https://spam.example" });

    expect(invalid.status).toBe(400);
    expect(await invalid.json()).toEqual({ error: "message_too_short" });
    expect(await bot.json()).toEqual({ ok: true });
  });
});

describe("cron routes", () => {
  it("are closed without the secret and open with it", async () => {
    const path = "/api/cron/analytics-snapshot/";

    expect((await get(path)).status).toBe(403);
    expect((await get(path, { authorization: "Bearer wrong" })).status).toBe(403);
    expect((await get(path, { authorization: `Bearer ${SMOKE.cronSecret}` })).status).toBe(200);
  });
});
