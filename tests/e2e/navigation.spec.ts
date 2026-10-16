import { expect, test } from "@playwright/test";

test.describe("header", () => {
  test("leads to every section and marks the current page", async ({ page }) => {
    await page.goto("/fr/");

    const menu = page.getByRole("navigation", { name: "Menu principal" });

    await menu.getByRole("link", { name: "cv" }).click();
    await expect(page).toHaveURL("/fr/resume/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ingénieur front-end senior");
    await expect(menu.getByRole("link", { name: "cv" })).toHaveAttribute("aria-current", "page");

    await menu.getByRole("link", { name: "articles" }).click();
    await expect(page).toHaveURL("/fr/posts/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Articles");

    await menu.getByRole("link", { name: "projets" }).click();
    await expect(page).toHaveURL("/fr/#projects");
    await expect(page.locator("#projects")).toBeInViewport();

    await page.getByRole("link", { name: "valentinbourreau", exact: true }).click();
    await expect(page).toHaveURL("/fr/");
  });

  test("stays visible on a phone, every link included", async ({ page }) => {
    await page.goto("/fr/");

    for (const name of ["cv", "projets", "articles", "contact"]) {
      await expect(
        page.getByRole("navigation", { name: "Menu principal" }).getByRole("link", { name }),
      ).toBeVisible();
    }
  });

  test("offers a skip link to the content", async ({ page }) => {
    await page.goto("/fr/resume/");
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: "Aller au contenu" });

    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await skip.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("leads to the posts in English too", async ({ page }) => {
    await page.goto("/en/");
    await page
      .getByRole("navigation", { name: "Main menu" })
      .getByRole("link", { name: "posts" })
      .click();

    await expect(page).toHaveURL("/en/posts/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Posts");
  });
});

test.describe("language", () => {
  test("switches to the same page in the other language, and remembers it", async ({
    page,
    context,
  }) => {
    await page.goto("/fr/resume/");
    await page.getByRole("link", { name: "fr · en, English version" }).click();

    await expect(page).toHaveURL("/en/resume/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Senior front-end engineer");

    const cookies = await context.cookies();

    expect(cookies.find(({ name }) => name === "NEXT_LOCALE")?.value).toBe("en");

    // The next visit to the root lands on the chosen language, whatever the browser says.
    await page.goto("/");
    await expect(page).toHaveURL("/en/");
  });

  test("goes from a post to its translation, and back", async ({ page }) => {
    await page.goto("/fr/posts/brut/");
    await page.getByRole("link", { name: "fr · en, English version" }).click();

    await expect(page).toHaveURL("/en/posts/brut/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /^BRUT, the website of a truck/,
    );

    await page.getByRole("link", { name: "fr · en, Version française" }).click();
    await expect(page).toHaveURL("/fr/posts/brut/");
  });

  test.describe("for a browser in English", () => {
    test.use({ locale: "en-US" });

    test("the root opens the English home page", async ({ page }) => {
      await page.goto("/");

      await expect(page).toHaveURL("/en/");
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });
  });

  test("the root opens the French home page for a French browser", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL("/fr/");
  });
});

test.describe("unknown page", () => {
  test("shows a translated 404 with a title and a way back home", async ({ page }) => {
    const response = await page.goto("/fr/page-qui-n-existe-pas/");

    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle("Page introuvable | valentinbourreau");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("pas été trouvée");

    await page.getByRole("link", { name: "retour à la page d’accueil" }).click();
    await expect(page).toHaveURL("/fr/");
  });

  test("is in English under /en/", async ({ page }) => {
    await page.goto("/en/nothing-here/");

    await expect(page).toHaveTitle("Page not found | valentinbourreau");
    await expect(page.getByRole("link", { name: "back to homepage" })).toHaveAttribute(
      "href",
      "/en/",
    );
  });
});

test.describe("footer", () => {
  test("links to the legal page, which describes how data is handled", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("contentinfo").getByRole("link", { name: "mentions légales" }).click();

    await expect(page).toHaveURL("/fr/legal/");

    for (const heading of [
      "Éditeur",
      "Hébergement",
      "Données personnelles",
      "Cookies et stockage local",
      "Vos droits",
    ]) {
      await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    }
  });

  test("opens external profiles in a new tab, safely", async ({ page }) => {
    await page.goto("/fr/");

    // In the contact section of the home page, above the footer.
    const github = page.locator("#contact").getByRole("link", { name: /github/ });

    await expect(github).toHaveAttribute("href", "https://github.com/vahohenheim");
    await expect(github).toHaveAttribute("target", "_blank");
    await expect(github).toHaveAttribute("rel", /noopener/);
  });
});
