import { test } from "@playwright/test";
import { expectAccessible, expectNoHorizontalScroll, gotoInTheme, PUBLIC_PAGES } from "./helpers";

// Every public page, in day and night mode, on the desktop and on a phone: no WCAG A/AA
// violation axe can find, and nothing that makes the page scroll sideways.
for (const theme of ["light", "dark"] as const) {
  for (const path of [...PUBLIC_PAGES, "/fr/page-qui-n-existe-pas/"]) {
    test(`${path} in ${theme} mode is accessible and fits the screen`, async ({ page }) => {
      await gotoInTheme(page, path, theme);
      await expectAccessible(page);
      await expectNoHorizontalScroll(page);
    });
  }
}

test("the password page of a protected post is accessible", async ({ page }) => {
  await page.goto("/fr/posts/headless-commerce/");
  await expectAccessible(page);
});

test("every step of the contact dialog is accessible", async ({ page }) => {
  await page.goto("/fr/");
  await page.getByRole("link", { name: "Prendre contact" }).first().click();

  const dialog = page.getByRole("dialog");

  await expectAccessible(page);
  await dialog.getByLabel("Lead technique").check();
  await dialog.getByRole("button", { name: "Continuer" }).click();
  await expectAccessible(page);
  await dialog.getByLabel("votre message").fill("Un message assez long pour passer.");
  await dialog.getByRole("button", { name: "Continuer" }).click();
  await expectAccessible(page);
});
