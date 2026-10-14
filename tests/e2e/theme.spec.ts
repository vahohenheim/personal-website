import { expect, type Page, test } from "@playwright/test";

const html = (page: Page) => page.locator("html");

test("follows the system preference on a first visit", async ({ browser }) => {
  for (const colorScheme of ["light", "dark"] as const) {
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();

    await page.goto("/fr/");
    await expect(html(page)).toHaveClass(colorScheme === "dark" ? /\bdark\b/ : /^(?!.*\bdark\b)/);
    await context.close();
  }
});

test("switches mode, and keeps the choice across pages and reloads", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/fr/");

  const toggle = page.getByRole("button", { name: "Passer en mode jour ou nuit" });

  await expect(html(page)).not.toHaveClass(/\bdark\b/);
  await toggle.click();
  await expect(html(page)).toHaveClass(/\bdark\b/);

  const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await page.reload();
  await expect(html(page)).toHaveClass(/\bdark\b/);
  await page.goto("/fr/resume/");
  await expect(html(page)).toHaveClass(/\bdark\b/);
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
    background,
  );

  await page.getByRole("button", { name: "Passer en mode jour ou nuit" }).click();
  await expect(html(page)).not.toHaveClass(/\bdark\b/);
});

test("sets the mode before React runs, so the page never flashes", async ({ page }) => {
  // Without the JavaScript bundles, only the inline script of next-themes, which runs while
  // the page is parsed, can set the class.
  await page.route("**/_next/static/chunks/**", (route) => route.abort());
  await page.addInitScript(() => {
    window.localStorage.setItem("theme", "dark");
  });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/fr/");

  await expect(html(page)).toHaveClass(/\bdark\b/);
});

test("shows the night variant of post images in night mode", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("theme", "dark");
  });
  await page.goto("/fr/posts/brut/");

  const day = page.locator('img[src="/posts/brut/perf-scores-jour.webp"]');
  const night = page.locator('img[src="/posts/brut/perf-scores-nuit.webp"]');

  await night.scrollIntoViewIfNeeded();
  await expect(night).toBeVisible();
  await expect(day).toBeHidden();
});
