import { expect, type Page, test } from "@playwright/test";
import { PUBLIC_PAGES } from "./helpers";
import { normalize, readLegalSource, readMarkdownSections } from "../helpers/legal";

/** The text of the article as a reader sees it, normalised like the source. */
const articleText = async (page: Page) =>
  normalize((await page.locator("article").textContent()) ?? "");

test.describe("general terms of service", () => {
  test("show the source text, word for word", async ({ page }) => {
    await page.goto("/fr/cgv/");

    const text = await articleText(page);

    for (const section of readMarkdownSections(readLegalSource("cgv.fr.md"))) {
      expect(text).toContain(section.title);

      for (const unit of section.units) {
        expect(text).toContain(unit);
      }
    }

    await expect(page.locator("article section")).toHaveCount(20);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Conditions générales de prestation",
    );
  });

  test("link to the PDF of their version", async ({ page, request }) => {
    await page.goto("/fr/cgv/");

    const link = page.getByRole("link", { name: "télécharger en PDF" });

    await expect(link).toHaveAttribute("href", "/cgv/cgp-1.0.pdf");

    const response = await request.get("/cgv/cgp-1.0.pdf");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  });

  test("open on an article reached directly, with room above its title", async ({ page }) => {
    await page.goto("/fr/cgv/#art-12");

    const title = page.getByRole("heading", { level: 2, name: "Propriété intellectuelle" });

    await expect(title).toBeInViewport();

    const box = await title.boundingBox();

    expect(box?.y).toBeGreaterThanOrEqual(24);
  });

  test("follow internal references to their anchor", async ({ page }) => {
    await page.goto("/fr/cgv/");
    await page.locator("#art-11").getByRole("link", { name: "article 12.2" }).click();

    await expect(page).toHaveURL(/#art-12-2$/);
    await expect(
      page.getByRole("heading", { level: 3, name: "12.2 Avant paiement intégral" }),
    ).toBeInViewport();
  });

  test("keep their summary in view and follow the article being read", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "The sticky summary is for wide screens.");
    await page.goto("/fr/cgv/#art-15");

    const summary = page.getByRole("navigation", { name: "Sommaire des CGP" });

    await expect(summary.locator('[aria-current="true"]')).toHaveText("15 Responsabilité");
    expect((await summary.boundingBox())?.y).toBe(24);

    await page.goto("/fr/cgv/#art-03");
    await expect(summary.locator('[aria-current="true"]')).toHaveText("03 Devis et commande");
  });

  test("fold their summary on phones, and fold it again after a choice", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "The folded summary is for phones.");
    await page.goto("/fr/cgv/");

    const details = page.locator("details");
    const summary = details.locator("summary");

    await expect(summary).toHaveText(/sommaire · 20 articles/);
    await expect(details).not.toHaveAttribute("open");

    await summary.click();
    await expect(details).toHaveAttribute("open");
    await details.getByRole("link", { name: "08 Prix" }).click();

    await expect(page).toHaveURL(/#art-08$/);
    await expect(details).not.toHaveAttribute("open");
    await expect(page.getByRole("heading", { level: 2, name: "Prix" })).toBeInViewport();
  });

  test("stay in French on the English page, under a notice", async ({ page }) => {
    await page.goto("/en/cgv/");

    await expect(page.getByText("These terms are available in French only.")).toBeVisible();
    await expect(page.locator("article")).toHaveAttribute("lang", "fr");
    await expect(
      page.getByRole("heading", { level: 2, name: "Objet et champ d’application" }),
    ).toBeVisible();
  });
});

test.describe("legal notice", () => {
  test("shows the source text in seven numbered sections", async ({ page }) => {
    await page.goto("/fr/legal/");

    const text = await articleText(page);
    const [publisher, ...others] = readMarkdownSections(readLegalSource("mentions-legales.fr.md"));

    expect(text).toContain(publisher.units[0]);

    for (const section of others) {
      for (const unit of section.units) {
        // A processing shows its name in bold, then its text, without the full stop.
        expect(text).toContain(unit.replace(/^([^.]+)\. /, ""));
      }
    }

    await expect(page.locator("article section")).toHaveCount(7);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Mentions légales et confidentialité",
    );
  });

  test("links the services to the terms and shows the blank still to fill", async ({ page }) => {
    await page.goto("/fr/legal/");

    await expect(page.getByText("[à compléter]", { exact: true })).toBeVisible();
    await page.getByRole("link", { name: "conditions générales de prestation" }).click();
    await expect(page).toHaveURL("/fr/cgv/");
  });

  test("is reached from article 14 of the terms at its personal data section", async ({ page }) => {
    await page.goto("/fr/cgv/");
    await page.getByRole("link", { name: "mentions légales de valentinbourreau.com" }).click();

    await expect(page).toHaveURL("/fr/legal/#sec-05");
    await expect(
      page.getByRole("heading", { level: 2, name: "Données personnelles" }),
    ).toBeInViewport();
  });
});

test.describe("footer", () => {
  test("links to the legal notice and the terms on every page", async ({ page }) => {
    for (const path of PUBLIC_PAGES) {
      await page.goto(path);

      const footer = page.getByRole("contentinfo");
      const french = path.startsWith("/fr/");

      await expect(
        footer.getByRole("link", { name: french ? "mentions légales" : "legal notice" }),
      ).toBeVisible();
      await expect(footer.getByRole("link", { name: french ? "cgv" : "terms" })).toBeVisible();
    }
  });

  test("marks the legal page being read", async ({ page }) => {
    await page.goto("/fr/cgv/");
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "cgv" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await page.goto("/fr/legal/");
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: "mentions légales" }),
    ).toHaveAttribute("aria-current", "page");
  });
});
