import { expect, test } from "@playwright/test";

test("presents the person, the changelog, the posts, the projects and the contact", async ({
  page,
}) => {
  await page.goto("/fr/");

  await expect(page).toHaveTitle("Ingénieur front-end senior · freelance | valentinbourreau");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ingénieur front-end senior");
  await expect(page.getByRole("img", { name: "Valentin Bourreau", exact: true })).toBeVisible();

  for (const name of ["ce que j’apporte", "changelog", "articles", "projets", "contact"]) {
    await expect(page.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
  }
});

test("preloads the portrait, the largest image above the fold", async ({ page }) => {
  await page.goto("/fr/");

  const portrait = page.getByRole("img", { name: "Valentin Bourreau", exact: true });

  await expect(page.locator('link[rel="preload"][as="image"][imagesrcset*="avatar"]')).toHaveCount(
    1,
  );
  await expect(portrait).not.toHaveAttribute("loading", "lazy");
  expect(await portrait.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(
    0,
  );
});

test("lists the three latest posts and leads to them", async ({ page }) => {
  await page.goto("/fr/");

  const posts = page.locator("section", {
    has: page.getByRole("heading", { level: 2, name: "articles", exact: true }),
  });

  await expect(posts.getByRole("heading", { level: 3 })).toHaveCount(3);
  await posts.getByRole("link", { name: /^BRUT/ }).click();
  await expect(page).toHaveURL("/fr/posts/brut/");

  await page.goBack();
  await page.getByRole("link", { name: "tous les articles →" }).click();
  await expect(page).toHaveURL("/fr/posts/");
});

test("links a project card to its post and to the project", async ({ page }) => {
  await page.goto("/fr/");

  await expect(page.getByRole("link", { name: "brut", exact: true })).toHaveAttribute(
    "href",
    "https://www.mangezbrut.fr",
  );
  await page.getByRole("link", { name: "lire l’article · lotus" }).click();
  await expect(page).toHaveURL("/fr/posts/lotus/");
});

test("leads from the changelog and the hero to the resume", async ({ page }) => {
  await page.goto("/fr/");
  await page.getByRole("link", { name: "Voir le CV" }).click();
  await expect(page).toHaveURL("/fr/resume/");

  await page.goto("/fr/");
  await page.getByRole("link", { name: "journal complet →" }).click();
  await expect(page).toHaveURL("/fr/resume/");
});

test("is fully translated in English", async ({ page }) => {
  await page.goto("/en/");

  await expect(page).toHaveTitle("Senior front-end engineer · freelance | valentinbourreau");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Senior front-end engineer");
  await expect(page.getByRole("link", { name: "Get in touch" }).first()).toBeVisible();
});
