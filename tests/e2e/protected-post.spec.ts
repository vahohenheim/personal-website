import { expect, test } from "@playwright/test";
import { E2E } from "./settings";

const PAGE = "/fr/posts/headless-commerce/";
const SECRET = "Refondre un e-commerce";

test("asks for the password and shows nothing of the post", async ({ page }) => {
  await page.goto(PAGE);

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Article protégé");
  await expect(page.getByRole("button", { name: "Lire l’article" })).toBeDisabled();
  expect(await page.content()).not.toContain(SECRET);
});

test("refuses a wrong password with a toast", async ({ page }) => {
  await page.goto(PAGE);
  // The server refuses an answer typed faster than a person could.
  await page.waitForTimeout(1100);
  await page.getByLabel("mot de passe").fill("not-the-password");
  await page.getByRole("button", { name: "Lire l’article" }).click();

  await expect(page.getByText("Ce mot de passe n’ouvre pas l’article.")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Article protégé");
});

test("opens with the right password, and stays open", async ({ page, context }) => {
  await page.goto(PAGE);
  await page.waitForTimeout(1100);
  await page.getByLabel("mot de passe").fill(E2E.postsPassword);
  await page.getByRole("button", { name: "Lire l’article" }).press("Enter");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(SECRET);
  await expect(page).toHaveURL(PAGE);

  const cookie = (await context.cookies()).find(
    ({ name }) => name === "post_access_headless-commerce",
  );

  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe("Lax");

  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(SECRET);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  const image = page.locator("main img").first();

  await image.scrollIntoViewIfNeeded();
  expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(
    0,
  );
});

test("opens in English with the same password", async ({ page }) => {
  await page.goto("/en/posts/headless-commerce/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Protected post");
  await page.waitForTimeout(1100);
  await page.getByLabel("password").fill(E2E.postsPassword);
  await page.getByRole("button", { name: "Read the post" }).click();

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Rebuilding an e-commerce site",
  );
});
