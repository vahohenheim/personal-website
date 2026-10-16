import { expect, type Page, test } from "@playwright/test";
import { loadLazyImages } from "./helpers";

test.describe("list", () => {
  test("shows each post with its date, reading time and tags, most recent first", async ({
    page,
  }) => {
    await page.goto("/fr/posts/");

    await expect(page.getByRole("heading", { level: 2 })).toHaveText([
      /^BRUT/,
      /^lotus/,
      /^pensee/,
    ]);
    await expect(page.getByText(/min de lecture/)).toHaveCount(3);
    await expect(page.getByText("performance", { exact: true })).toBeVisible();
  });

  test("never lists the protected post", async ({ page }) => {
    await page.goto("/fr/posts/");

    await expect(page.getByText("Refondre un e-commerce")).toHaveCount(0);
    expect(await page.content()).not.toContain("headless-commerce");
  });

  test("links to the RSS feed", async ({ page, request }) => {
    await page.goto("/fr/posts/");

    await expect(page.getByRole("link", { name: "flux rss →" })).toHaveAttribute(
      "href",
      "/fr/posts/feed.xml",
    );

    const feed = await request.get("/fr/posts/feed.xml");

    expect(feed.headers()["content-type"]).toMatch(/xml/);
    expect(await feed.text()).toContain("<category>lighthouse</category>");
  });
});

/**
 * The summary of a post, opened first on phones, where it is folded above the text: the
 * same summary as the legal pages (components/toc/toc.tsx).
 */
const openSummary = async (page: Page, isMobile: boolean, name: string) => {
  if (isMobile) {
    await page.locator("details summary").click();
  }

  return page.getByRole("navigation", { name });
};

test.describe("post", () => {
  test("shows the title, the lead, the dates, the tags and the summary", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/fr/posts/brut/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/^BRUT, le site d’un camion/);
    await expect(page.locator("main time").first()).toHaveAttribute("datetime", "2026-10-14");
    await expect(page.getByText(/^\d+\s*min de lecture$/)).toBeVisible();

    const summary = await openSummary(page, isMobile, "sommaire");

    await expect(summary.getByRole("link")).toHaveCount(9);
    // The number is part of the link, as on the legal pages.
    await expect(summary.getByRole("link").nth(6)).toHaveText(/^\d{2}\s*Mesurer, puis alléger$/);
  });

  test("puts the summary on the left of the text, as on the legal pages", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "On phones, the summary is folded above the text.");

    await page.goto("/fr/posts/brut/");

    const summary = await page.getByRole("navigation", { name: "sommaire" }).boundingBox();
    const text = await page.locator("main article").boundingBox();

    expect(summary && text && summary.x + summary.width < text.x).toBe(true);
  });

  test("jumps to a section from the summary", async ({ page, isMobile }) => {
    await page.goto("/fr/posts/brut/");
    await (
      await openSummary(page, isMobile, "sommaire")
    )
      .getByRole("link", { name: "Mesurer, puis alléger" })
      .click();

    await expect(page).toHaveURL(/#mesurer-puis-alleger$/);
    await expect(
      page.getByRole("heading", { level: 2, name: "Mesurer, puis alléger" }),
    ).toBeInViewport();
  });

  test("opens straight on a section from a shared link", async ({ page }) => {
    await page.goto("/fr/posts/brut/#mesurer-puis-alleger");

    await expect(
      page.getByRole("heading", { level: 2, name: "Mesurer, puis alléger" }),
    ).toBeInViewport();
  });

  test("loads every image, with a text alternative", async ({ page }) => {
    await page.goto("/fr/posts/brut/");
    await loadLazyImages(page);

    const images = page.locator("main img");

    for (const image of await images.all()) {
      await expect(image).toHaveAttribute("alt", /.{10,}/);
    }
  });

  test("keeps the figures of the performance section on one line each", async ({ page }) => {
    await page.goto("/fr/posts/brut/#mesurer-puis-alleger");

    const values = page.locator("dl", { hasText: "score mobile" }).locator("dd");

    await expect(values.first()).toBeVisible();

    for (const value of await values.all()) {
      const lines = await value.evaluate(
        (element) =>
          element.getBoundingClientRect().height / parseFloat(getComputedStyle(element).lineHeight),
      );

      expect(lines).toBeLessThan(1.5);
    }
  });

  test("leads to the next post, looping, and back to the list", async ({ page }) => {
    await page.goto("/fr/posts/pensee/");
    await page.getByRole("link", { name: /article suivant/ }).click();
    await expect(page).toHaveURL("/fr/posts/brut/");

    await page.getByRole("link", { name: "← tous les articles" }).click();
    await expect(page).toHaveURL("/fr/posts/");
  });

  test("has a sharing image", async ({ page, request }) => {
    await page.goto("/fr/posts/brut/");

    const image = await page.locator('meta[property="og:image"]').getAttribute("content");

    expect(image).toContain("/fr/posts/brut/opengraph-image");

    const response = await request.get(new URL(image ?? "").pathname);

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});

test.describe("in English", () => {
  test("lists the translated posts, most recent first", async ({ page }) => {
    await page.goto("/en/posts/");

    await expect(page.getByRole("heading", { level: 2 })).toHaveText([
      /^BRUT, the website/,
      /^lotus, the app/,
      /^pensee, an offline notebook/,
    ]);
    await expect(page.getByText(/min read/)).toHaveCount(3);
  });

  test("shows a translated post with its own summary and anchors", async ({ page, isMobile }) => {
    await page.goto("/en/posts/brut/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("main time").first()).toHaveText("Oct 14, 2026");

    const summary = await openSummary(page, isMobile, "contents");

    await expect(summary.getByRole("link")).toHaveCount(9);
    await summary.getByRole("link", { name: "Measure, then lighten" }).click();
    await expect(page).toHaveURL(/#measure-then-lighten$/);
    await expect(
      page.getByRole("heading", { level: 2, name: "Measure, then lighten" }),
    ).toBeInViewport();
  });

  test("uses the same images as the French post", async ({ page }) => {
    const sources = async (path: string) => {
      await page.goto(path);

      return page
        .locator("main img")
        .evaluateAll((images) => images.map((image) => image.getAttribute("src")));
    };

    for (const slug of ["brut", "lotus", "pensee"]) {
      expect(await sources(`/en/posts/${slug}/`)).toEqual(await sources(`/fr/posts/${slug}/`));
    }
  });

  test("links each project card to the English post", async ({ page }) => {
    await page.goto("/en/");
    await page.getByRole("link", { name: /read the post · pensee/ }).click();

    await expect(page).toHaveURL("/en/posts/pensee/");
  });
});
