import { expect, test } from "@playwright/test";

test("leads from the home page to the services page", async ({ page }) => {
  await page.goto("/fr/");

  const offer = page.locator("section", {
    has: page.getByRole("heading", { level: 2, name: "offre", exact: true }),
  });

  await expect(offer.getByRole("heading", { level: 3 })).toHaveText([
    "Audit performance & architecture",
    "Lead technique à temps partiel",
    "Mise en production web",
  ]);
  await offer.getByRole("link", { name: "Voir l’offre complète →" }).click();

  await expect(page).toHaveURL("/fr/offre/");
  await expect(page).toHaveTitle(
    "Offre · audit, lead technique, mise en production | valentinbourreau",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Offre");
  await expect(
    page.getByRole("navigation", { name: "Menu principal" }).getByRole("link", { name: "offre" }),
  ).toHaveAttribute("aria-current", "page");
});

test("lists the five services and their prices, with the summary on the left", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/fr/offre/");

  const summary = page.getByRole("navigation", { name: "Sommaire de l’offre" });

  await expect(summary.getByRole("link")).toHaveCount(5);

  const services = page.locator("#sec-02");

  await expect(services.getByRole("heading", { level: 3 })).toHaveCount(5);
  await expect(services.getByText("sur devis")).toBeVisible();
  await expect(page.locator("#sec-03").getByRole("table")).toContainText("950 €/j");

  // The summary is left of the text.
  const summaryBox = await summary.boundingBox();
  const textBox = await services.boundingBox();

  expect((summaryBox?.x ?? 0) < (textBox?.x ?? 0)).toBe(true);
});

test("opens the contact form from the end of the page", async ({ page }) => {
  await page.goto("/fr/offre/");
  await page.getByRole("link", { name: "Prendre contact →" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();
});

test("exists in English", async ({ page }) => {
  await page.goto("/en/offre/");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Services");
  await expect(page.locator("#sec-02")).toContainText("€1,900");
});
