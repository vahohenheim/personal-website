import { expect, type Page, test } from "@playwright/test";
import { adminHeaders, lotusReceived } from "./settings";

const toast = (page: Page, text: string) =>
  page.locator("[data-sonner-toast]").filter({ hasText: text });

/** Opens the dialog from the main button of the home page. */
const openContact = async (page: Page) => {
  await page.getByRole("link", { name: "Prendre contact", exact: true }).click();

  const dialog = page.getByRole("dialog");

  await expect(dialog).toBeVisible();

  return dialog;
};

/** Fills the three steps with valid answers, up to the send button. */
const fillForm = async (page: Page, email: string) => {
  const dialog = await openContact(page);

  await dialog.getByLabel("Qualité et audit").check();
  await dialog.getByRole("button", { name: "Continuer" }).click();
  await dialog
    .getByLabel("votre message")
    .fill("Un audit de notre front Next.js, avant une refonte.");
  await dialog.getByRole("button", { name: "Continuer" }).click();
  await dialog.getByLabel("nom", { exact: true }).fill("Camille Test");
  await dialog.getByLabel("e-mail", { exact: true }).fill(email);

  return dialog;
};

/**
 * The server refuses, silently, a form sent less than 3 seconds after the dialog opened. It
 * compares the browser's `startedAt` with its own clock: the browser clock is set back 10
 * seconds instead of waiting.
 */
const visitAsAPerson = async (page: Page, path = "/fr/") => {
  await page.clock.install({ time: Date.now() - 10_000 });
  await page.goto(path);
};

test.describe("a person", () => {
  test.beforeEach(async ({ page }) => {
    await visitAsAPerson(page);
  });

  test("sends a lead in three steps, then confirms it on the home page", async ({ page }) => {
    const email = `e2e-${Date.now()}-${test.info().project.name}@example.com`;
    const dialog = await openContact(page);

    await expect(dialog.getByText("étape 1 / 3")).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "De quoi avez-vous besoin ?" })).toBeVisible();

    // Step 1: a need is required.
    await dialog.getByRole("button", { name: "Continuer" }).click();
    await expect(toast(page, "Choisissez un besoin pour continuer.")).toBeVisible();
    await dialog.getByLabel("Architecture front-end").check();
    await dialog.getByRole("button", { name: "Continuer" }).click();

    // Step 2: a message of a few words, a start date if known.
    await expect(dialog.getByText("étape 2 / 3")).toBeVisible();
    await dialog.getByLabel("votre message").fill("Court");
    await dialog.getByRole("button", { name: "Continuer" }).click();
    await expect(toast(page, "Votre message est trop court")).toBeVisible();
    await dialog.getByLabel("votre message").fill("Refondre le front d’une marketplace B2B.");
    await dialog.getByLabel("Dans 1 à 3 mois").check();
    await dialog.getByRole("button", { name: "Continuer" }).click();

    // Step 3: a name and a valid address.
    await expect(dialog.getByText("étape 3 / 3")).toBeVisible();
    await dialog.getByRole("button", { name: "Envoyer" }).click();
    await expect(toast(page, "Indiquez votre nom.")).toBeVisible();
    await dialog.getByLabel("nom", { exact: true }).fill("Camille Test");
    await dialog.getByLabel("e-mail", { exact: true }).fill("pas-une-adresse");
    await dialog.getByRole("button", { name: "Envoyer" }).click();
    await expect(toast(page, "Cette adresse e-mail n’est pas valide.")).toBeVisible();
    await expect(dialog.getByLabel("e-mail", { exact: true })).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    // Going back keeps what was typed.
    await dialog.getByRole("button", { name: "Retour" }).click();
    await expect(dialog.getByLabel("votre message")).toHaveValue(
      "Refondre le front d’une marketplace B2B.",
    );
    await dialog.getByRole("button", { name: "Continuer" }).click();
    await dialog.getByLabel("e-mail", { exact: true }).fill(email);
    await dialog.getByLabel("entreprise · facultatif").fill("Exemple SAS");
    await expect(
      dialog.getByRole("link", { name: "Mentions légales et confidentialité" }),
    ).toHaveAttribute("href", "/fr/legal/");

    await dialog.getByRole("button", { name: "Envoyer" }).click();

    // The confirmation recaps the answers.
    await expect(dialog.getByRole("heading", { name: "Message envoyé" })).toBeVisible();
    await expect(dialog.getByText("Merci Camille Test.")).toBeVisible();
    await expect(dialog.getByText("Architecture front-end")).toBeVisible();
    await expect(dialog.getByText("Dans 1 à 3 mois")).toBeVisible();
    await expect(dialog.getByText(email)).toBeVisible();

    await dialog.getByRole("button", { name: "Retour à l’accueil" }).click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL("/fr/");
    await expect(
      page.getByRole("status").filter({ hasText: "Message envoyé." }).first(),
    ).toBeVisible();

    // The confirmation survives a reload, and the visitor can write again.
    await page.reload();
    await page.getByRole("button", { name: "nouveau message" }).first().click();
    await expect(page.getByRole("dialog").getByText("étape 1 / 3")).toBeVisible();

    // The lead reached the stand-in for lotus, after the visitor got the answer.
    // Forwarded after the response (`after()`): it may take a moment when the suite is busy.
    await expect
      .poll(async () => (await lotusReceived()).some((lead) => lead.email === email), {
        timeout: 15_000,
      })
      .toBe(true);
  });

  test("closes with Escape and starts over when opened again", async ({ page }) => {
    const dialog = await openContact(page);

    await dialog.getByLabel("Design system").check();
    await dialog.getByRole("button", { name: "Continuer" }).click();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await openContact(page);
    await expect(page.getByRole("dialog").getByText("étape 1 / 3")).toBeVisible();
    await expect(page.getByRole("dialog").getByLabel("Design system")).not.toBeChecked();
  });

  test("keeps the keyboard inside the dialog and gives focus back on close", async ({ page }) => {
    const trigger = page.getByRole("link", { name: "Prendre contact", exact: true });
    const dialog = await openContact(page);

    for (let index = 0; index < 12; index += 1) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(
        true,
      );
    }

    await dialog.getByRole("button", { name: "fermer" }).click();
    await expect(trigger).toBeFocused();
  });

  test("explains a network failure without losing the form", async ({ page }) => {
    await page.route("**/api/contact/", (route) => route.abort("internetdisconnected"));

    const dialog = await fillForm(page, "reseau@example.com");

    await dialog.getByRole("button", { name: "Envoyer" }).click();

    await expect(toast(page, "Connexion impossible.")).toBeVisible();
    await expect(dialog.getByLabel("e-mail", { exact: true })).toHaveValue("reseau@example.com");
    await expect(dialog.getByRole("button", { name: "Envoyer" })).toBeEnabled();
  });

  test("shows the server's reason, with the address to write to instead", async ({ page }) => {
    await page.route("**/api/contact/", (route) =>
      route.fulfill({ status: 503, json: { error: "unavailable" } }),
    );

    const dialog = await fillForm(page, "indispo@example.com");

    await dialog.getByRole("button", { name: "Envoyer" }).click();

    await expect(
      toast(
        page,
        "Le formulaire est momentanément indisponible. Écrivez à contact@valentinbourreau.com.",
      ),
    ).toBeVisible();
  });
});

test.describe("in English", () => {
  test.use({ locale: "en-US" });

  test("asks the same questions, translated", async ({ page }) => {
    await visitAsAPerson(page, "/en/");
    await page.getByRole("link", { name: "Get in touch", exact: true }).click();

    const dialog = page.getByRole("dialog");

    await expect(dialog.getByRole("heading", { name: "What do you need?" })).toBeVisible();
    await dialog.getByRole("button", { name: "Continue" }).click();
    await expect(page.locator("[data-sonner-toast]")).toBeVisible();
  });
});

test.describe("a form sent too fast", () => {
  test("looks sent, like for a person, but is never stored", async ({ page, request }) => {
    const email = `robot-${Date.now()}-${test.info().project.name}@example.com`;

    await page.goto("/fr/");

    const dialog = await fillForm(page, email);

    await dialog.getByRole("button", { name: "Envoyer" }).click();
    await expect(dialog.getByRole("heading", { name: "Message envoyé" })).toBeVisible();

    const csv = await (await request.get("/admin/export/", { headers: adminHeaders })).text();

    expect(csv).not.toContain(email);
  });
});
