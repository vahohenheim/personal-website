import { expect, test } from "@playwright/test";
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

test.describe("post", () => {
  test("shows the title, the lead, the dates, the tags and the summary", async ({ page }) => {
    await page.goto("/fr/posts/brut/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/^BRUT, le site d’un camion/);
    await expect(page.locator("main time").first()).toHaveAttribute("datetime", "2026-10-14");
    await expect(page.getByText(/^\d+\s*min de lecture$/)).toBeVisible();

    const summary = page.getByRole("navigation", { name: "sommaire" });

    await expect(summary.getByRole("link")).toHaveCount(9);
    await expect(summary.getByRole("link").nth(6)).toHaveText("Mesurer, puis alléger");
  });

  test("jumps to a section from the summary", async ({ page }) => {
    await page.goto("/fr/posts/brut/");
    await page
      .getByRole("navigation", { name: "sommaire" })
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
