import { expect, test } from "@playwright/test";

test("shows the experience, the stack, the education and the languages", async ({ page }) => {
  await page.goto("/fr/resume/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ingénieur front-end senior");

  const headings = page.getByRole("heading", { level: 2 });

  await expect(headings).not.toHaveCount(0);
  await expect(page.getByRole("heading", { level: 3, name: /Freelance/ })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Fil d’Ariane" })).toBeVisible();
});

for (const locale of ["fr", "en"] as const) {
  test(`offers the ${locale} resume as a one-file PDF download`, async ({ page, request }) => {
    await page.goto(`/${locale}/resume/`);

    const link = page.getByRole("link", { name: /cv\.pdf/ });

    await expect(link).toHaveAttribute("href", `/cv-${locale}.pdf`);

    const response = await request.get(`/cv-${locale}.pdf`);

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  });
}

test("prints on one A4 page, kept out of search engines", async ({ page }) => {
  await page.goto("/fr/resume/print/");

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.emulateMedia({ media: "print" });

  const pdf = await page.pdf({ format: "A4", printBackground: true });
  const pages = pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? [];

  expect(pages).toHaveLength(1);
});
