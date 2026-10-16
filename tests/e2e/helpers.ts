import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** Every public page, in both languages where it exists. */
export const PUBLIC_PAGES = [
  "/fr/",
  "/en/",
  "/fr/resume/",
  "/en/resume/",
  "/fr/offre/",
  "/en/offre/",
  "/fr/legal/",
  "/en/legal/",
  "/fr/cgv/",
  "/en/cgv/",
  "/fr/posts/",
  "/fr/posts/brut/",
  "/fr/posts/lotus/",
  "/fr/posts/pensee/",
  "/en/posts/",
  "/en/posts/brut/",
  "/en/posts/lotus/",
  "/en/posts/pensee/",
] as const;

/** WCAG 2.2 A and AA, as checked by axe on the page as it is now. */
export const expectAccessible = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(
    violations.map(
      ({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(" ")).join(", ")}`,
    ),
  ).toEqual([]);
};

/** Nothing on the page makes it scroll sideways. */
export const expectNoHorizontalScroll = async (page: Page) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(0);
};

/** Opens a page with the theme already chosen, as a returning visitor would. */
export const gotoInTheme = async (page: Page, path: string, theme: "light" | "dark") => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("theme", value);
  }, theme);
  await page.goto(path);
};

/** Scrolls the whole page so that every lazy image is requested, then waits for them. */
export const loadLazyImages = async (page: Page) => {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    window.scrollTo(0, 0);
  });
  await expect
    .poll(() =>
      page.evaluate(() =>
        [...document.images]
          .filter((image) => image.checkVisibility())
          .every((image) => image.complete && image.naturalWidth > 0),
      ),
    )
    .toBe(true);
};
