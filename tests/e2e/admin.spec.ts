import { type APIRequestContext, expect, type Page, test } from "@playwright/test";
import { E2E } from "./settings";

test.use({ httpCredentials: { username: E2E.adminUser, password: E2E.adminPassword } });

/** A lead sent through the public route, as the form would, with a unique address. */
const sendLead = async (request: APIRequestContext, name: string) => {
  const email = `${name.toLowerCase().replace(/\W+/g, "-")}-${Date.now()}@example.com`;
  const response = await request.post("/api/contact/", {
    data: {
      need: "tech-lead",
      timeline: "asap",
      message: "Un lead technique pour six mois.",
      name,
      email,
      company: "Exemple SAS",
      locale: "fr",
      source: "e2e.example",
      website: "",
      startedAt: Date.now() - 10_000,
    },
  });

  expect(response.status()).toBe(200);

  return email;
};

const rowOf = (page: Page, email: string) => page.getByRole("row").filter({ hasText: email });

test.describe("without credentials", () => {
  test.use({ httpCredentials: undefined });

  test("is closed", async ({ request }) => {
    for (const path of ["/admin/", "/admin/export/"]) {
      const response = await request.get(path, { maxRedirects: 0 });

      expect(response.status(), path).toBe(401);
    }
  });
});

test("shows the leads, the charts, the audience and the conversion", async ({ page }) => {
  await page.goto("/admin/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Demandes de contact");

  for (const name of [
    "demandes par semaine",
    "par besoin",
    "fréquentation",
    "conversion",
    "toutes les demandes",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("lists a new lead with its details", async ({ page, request }) => {
  const email = await sendLead(request, "Alex Liste");

  await page.goto("/admin/");

  const row = rowOf(page, email);

  await expect(row).toContainText("Alex Liste");
  await expect(row).toContainText("Exemple SAS");
  await expect(row).toContainText("via e2e.example");
  await expect(row).toContainText("Lead technique");
  await expect(row).toContainText("Dès que possible");
  await expect(row).toContainText("à traiter");
  await expect(row.getByRole("link", { name: email })).toHaveAttribute("href", `mailto:${email}`);
});

test("records the follow-up of a lead", async ({ page, request }) => {
  const email = await sendLead(request, "Sam Suivi");

  await page.goto("/admin/");
  await rowOf(page, email).getByRole("button", { name: "Suivi" }).click();

  const dialog = page.getByRole("dialog", { name: "Sam Suivi" });

  await dialog.getByLabel("statut").selectOption({ label: "devis envoyé" });
  await dialog.getByLabel("montant estimé (€) · facultatif").fill("4800");
  await dialog.getByLabel("relancer le · facultatif").fill("2030-01-15");
  await dialog.getByLabel("notes").fill("Devis envoyé, rappeler en janvier.");
  await dialog.getByRole("button", { name: "Enregistrer" }).click();

  await expect(page.getByText("Suivi enregistré.")).toBeVisible();
  await expect(dialog).toBeHidden();

  await page.reload();

  const row = rowOf(page, email);

  await expect(row).toContainText("devis envoyé");
  await expect(row).toContainText("4 800");
  await expect(row).toContainText("relance le");
  await expect(row).toContainText("Devis envoyé, rappeler en janvier.");
});

test("deletes a lead only after confirmation", async ({ page, request }) => {
  const email = await sendLead(request, "Dominique Suppression");

  await page.goto("/admin/");
  await rowOf(page, email).getByRole("button", { name: "Suivi" }).click();

  const dialog = page.getByRole("dialog", { name: "Dominique Suppression" });

  await dialog.getByRole("button", { name: "Supprimer" }).click();
  await dialog.getByRole("button", { name: "Annuler" }).click();
  await expect(dialog.getByRole("button", { name: "Confirmer la suppression" })).toHaveCount(0);

  await dialog.getByRole("button", { name: "Supprimer" }).click();
  await dialog.getByRole("button", { name: "Confirmer la suppression" }).click();

  await expect(page.getByText("Demande supprimée.")).toBeVisible();
  await page.reload();
  await expect(rowOf(page, email)).toHaveCount(0);
});

test("exports the leads as a CSV file", async ({ page, request }) => {
  const email = await sendLead(request, "Charlie Export");

  await page.goto("/admin/");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: "Exporter en CSV" }).click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/\.csv$/);

  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk as Buffer);
  }

  expect(Buffer.concat(chunks).toString("utf8")).toContain(email);
});

test("changes the period of the audience figures", async ({ page }) => {
  await page.goto("/admin/");

  const period = page.getByRole("navigation", { name: "Période" });

  await period.getByRole("link", { name: "90 jours" }).click();
  await expect(page).toHaveURL(/\?periode=90#frequentation$/);
  await expect(period.getByRole("link", { name: "90 jours" })).toHaveAttribute(
    "aria-current",
    "true",
  );
});

test("says with a toast that the audience is not configured without the Vercel token", async ({
  page,
}) => {
  await page.goto("/admin/");
  await page.getByRole("button", { name: "Actualiser" }).click();

  await expect(
    page.getByText("La fréquentation n’est pas configurée : WEB_ANALYTICS_TOKEN est absent."),
  ).toBeVisible();
});
