import { type APIRequestContext, expect, type Page, test } from "@playwright/test";
import { expectAccessible, expectNoHorizontalScroll, gotoInTheme } from "./helpers";
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
    for (const path of [
      "/admin/",
      "/admin/frequentation/",
      "/admin/export/",
      "/admin/design-system/",
    ]) {
      const response = await request.get(path, { maxRedirects: 0 });

      expect(response.status(), path).toBe(401);
    }
  });
});

test("shows the leads first, then the audience recap and the trend", async ({ page }) => {
  await page.goto("/admin/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Demandes");

  const titles = page.getByRole("heading", { level: 2 });

  await expect(titles).toHaveText(["toutes les demandes", "fréquentation · 30 jours", "tendance"]);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await page.getByRole("link", { name: "voir la fréquentation et la conversion →" }).click();
  await expect(page).toHaveURL("/admin/frequentation/");
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

test("creates a lead typed by hand", async ({ page }) => {
  const email = `camille-${Date.now()}@example.com`;

  await page.goto("/admin/");
  await page.getByRole("button", { name: "+ Nouvelle demande" }).click();

  const dialog = page.getByRole("dialog", { name: "Nouvelle demande" });

  await dialog.getByLabel("nom").fill("Camille Saisie");
  await dialog.getByLabel("e-mail").fill(email);
  await dialog.getByLabel("origine · facultatif").fill("malt");
  await dialog.getByLabel("besoin").selectOption({ label: "Qualité et audit" });
  await dialog.getByLabel("message").fill("Appel");
  await dialog.getByLabel("statut").selectOption({ label: "contacté" });
  await dialog.getByRole("button", { name: "Enregistrer" }).click();

  await expect(page.getByText("Demande ajoutée.")).toBeVisible();
  await expect(dialog).toBeHidden();

  const row = rowOf(page, email);

  await expect(row).toContainText("Camille Saisie");
  await expect(row).toContainText("via malt");
  await expect(row).toContainText("Qualité et audit");
  await expect(row).toContainText("contacté");
});

test("says with a toast what is wrong in the lead form", async ({ page }) => {
  await page.goto("/admin/");
  await page.getByRole("button", { name: "+ Nouvelle demande" }).click();

  const dialog = page.getByRole("dialog", { name: "Nouvelle demande" });

  await dialog.getByLabel("nom").fill("Erreur");
  // Passes the browser check, not the server one.
  await dialog.getByLabel("e-mail").fill("erreur@exemple");
  await dialog.getByLabel("besoin").selectOption({ label: "Autre" });
  await dialog.getByLabel("message").fill("Test");
  await dialog.getByRole("button", { name: "Enregistrer" }).click();

  await expect(page.getByText("L’adresse e-mail n’est pas valide.")).toBeVisible();
  await expect(dialog).toBeVisible();
});

test("edits a lead and its follow-up", async ({ page, request }) => {
  const email = await sendLead(request, "Sam Suivi");

  await page.goto("/admin/");
  await rowOf(page, email)
    .getByRole("button", { name: "Modifier la demande de Sam Suivi" })
    .click();

  const dialog = page.getByRole("dialog", { name: "Sam Suivi" });

  await expect(dialog.getByLabel("e-mail")).toHaveValue(email);
  await dialog.getByLabel("entreprise · facultatif").fill("Autre SAS");
  await dialog.getByLabel("statut").selectOption({ label: "devis envoyé" });
  await dialog.getByLabel("montant estimé (€) · facultatif").fill("4800");
  await dialog.getByLabel("relancer le · facultatif").fill("2030-01-15");
  await dialog.getByLabel("notes").fill("Devis envoyé, rappeler en janvier.");
  await dialog.getByRole("button", { name: "Enregistrer" }).click();

  await expect(page.getByText("Demande enregistrée.")).toBeVisible();
  await expect(dialog).toBeHidden();

  await page.reload();

  const row = rowOf(page, email);

  await expect(row).toContainText("Autre SAS");
  await expect(row).toContainText("devis envoyé");
  await expect(row).toContainText("4 800");
  await expect(row).toContainText("relance le");
  await expect(row).toContainText("Devis envoyé, rappeler en janvier.");
});

test("filters the list by where the leads stand", async ({ page, request }) => {
  const email = await sendLead(request, "Filtre Nouveau");

  await page.goto("/admin/");

  const filters = page.getByRole("navigation", { name: "Filtrer les demandes" });

  await filters.getByRole("link", { name: /^closes/ }).click();
  await expect(page).toHaveURL(/\?filtre=closed#liste$/);
  await expect(rowOf(page, email)).toHaveCount(0);

  await filters.getByRole("link", { name: /^à traiter/ }).click();
  await expect(filters.getByRole("link", { name: /^à traiter/ })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(rowOf(page, email)).toHaveCount(1);
});

test("deletes a lead from its row, only after confirmation", async ({ page, request }) => {
  const email = await sendLead(request, "Dominique Suppression");

  await page.goto("/admin/");
  await rowOf(page, email)
    .getByRole("button", { name: "Supprimer la demande de Dominique Suppression" })
    .click();

  const confirm = page.getByRole("dialog", {
    name: "Supprimer la demande de Dominique Suppression ?",
  });

  await confirm.getByRole("button", { name: "Annuler" }).click();
  await expect(confirm).toBeHidden();
  await expect(rowOf(page, email)).toHaveCount(1);

  await rowOf(page, email)
    .getByRole("button", { name: "Supprimer la demande de Dominique Suppression" })
    .click();
  await confirm.getByRole("button", { name: "Supprimer", exact: true }).click();

  await expect(page.getByText("Demande supprimée.")).toBeVisible();
  await page.reload();
  await expect(rowOf(page, email)).toHaveCount(0);
});

test("deletes a lead from its sheet", async ({ page, request }) => {
  const email = await sendLead(request, "Lou Fiche");

  await page.goto("/admin/");
  await rowOf(page, email)
    .getByRole("button", { name: "Modifier la demande de Lou Fiche" })
    .click();
  await page
    .getByRole("dialog", { name: "Lou Fiche" })
    .getByRole("button", { name: "Supprimer la demande de Lou Fiche" })
    .click();
  await page
    .getByRole("dialog", { name: "Supprimer la demande de Lou Fiche ?" })
    .getByRole("button", { name: "Supprimer", exact: true })
    .click();

  await expect(page.getByText("Demande supprimée.")).toBeVisible();
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

test("shows the audience and the conversion on their own page", async ({ page }) => {
  await page.goto("/admin/frequentation/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fréquentation");
  await expect(page.getByRole("heading", { level: 2, name: "conversion" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "fréquentation" }).and(page.locator("[aria-current=page]")),
  ).toBeVisible();
});

test("changes the period of the audience figures", async ({ page }) => {
  await page.goto("/admin/frequentation/");

  const period = page.getByRole("navigation", { name: "Période" });

  await period.getByRole("link", { name: "90 jours" }).click();
  await expect(page).toHaveURL(/\/admin\/frequentation\/\?periode=90$/);
  await expect(period.getByRole("link", { name: "90 jours" })).toHaveAttribute(
    "aria-current",
    "true",
  );
});

test("says with a toast that the audience is not configured without the Vercel token", async ({
  page,
}) => {
  await page.goto("/admin/frequentation/");
  await page.getByRole("button", { name: "Actualiser" }).click();

  await expect(
    page.getByText("La fréquentation n’est pas configurée : WEB_ANALYTICS_TOKEN est absent."),
  ).toBeVisible();
});

test.describe("design system", () => {
  test("shows every group of components, with the summary on the left", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/admin/design-system/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Design system");
    await expect(page.getByRole("navigation", { name: "Menu de l’admin" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "design system" }).and(page.locator("[aria-current=page]")),
    ).toBeVisible();

    for (const name of ["Couleurs", "Typographie", "Boutons", "Entrées datées", "Hors vitrine"]) {
      await expect(page.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
    }

    // Every specimen is drawn twice: in day mode, then in night mode.
    await expect(page.locator("figure .light").first()).toBeVisible();
    await expect(page.locator("figure .dark").first()).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

    if (!isMobile) {
      const summary = await page
        .getByRole("navigation", { name: "Sommaire du design system" })
        .boundingBox();
      const text = await page.locator("main article").boundingBox();

      expect(summary && text && summary.x + summary.width < text.x).toBe(true);
    }
  });

  for (const theme of ["light", "dark"] as const) {
    test(`is accessible and fits the screen in ${theme} mode`, async ({ page }) => {
      await gotoInTheme(page, "/admin/design-system/", theme);
      await expectAccessible(page);
      await expectNoHorizontalScroll(page);
    });
  }

  test("is reached from the leads page", async ({ page }) => {
    await page.goto("/admin/");
    await page.getByRole("link", { name: "design system" }).click();

    await expect(page).toHaveURL("/admin/design-system/");
  });
});
