import { expect, test } from "@playwright/test";

/** The keyboard paths verified on the mockup (docs/ACCESSIBILITY.md §3). */

test("skip link is first and visible on focus", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Fara í efni" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
});

test("ticking a symptom prices the route and pre-ticks the work order", async ({ page }) => {
  await page.goto("/");
  const symptom = page.getByRole("checkbox", { name: /Excel-skjali/ });
  await symptom.focus();
  await page.keyboard.press("Space");
  await expect(symptom).toBeChecked();
  const trip = page.getByRole("region", { name: "Tillaga" });
  await expect(trip).toContainText("Innra kerfi");
  await expect(trip).toContainText("frá 399.900 kr.");
  await expect(page.getByRole("checkbox", { name: "Innra kerfi" })).toBeChecked();
});

test("get a fixed price moves focus to the work order", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Fá fast verð" }).click();
  await expect(page.getByLabel("Nafn")).toBeFocused();
});

test("phone: the suggestion bar follows the reader and leads to the work order", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) > 760, "the bar is phone-only");
  await page.goto("/");
  const bar = page.getByRole("complementary", { name: "Tillaga í stuttu máli" });
  await page.getByRole("checkbox", { name: /Excel-skjali/ }).check();
  await page.locator("#ferli").scrollIntoViewIfNeeded();
  await expect(bar).toContainText("Innra kerfi");
  await bar.getByRole("button", { name: /Fá verð/ }).click();
  await expect(page.getByLabel("Nafn")).toBeFocused();
  await expect(bar).toHaveCount(0);
});

test("work order: errors are tied to fields, receipt takes focus", async ({ page }) => {
  test.skip(Boolean(process.env["PLAYWRIGHT_BASE_URL"]), "a deployed copy would send a real email");
  await page.goto("/");
  const name = page.getByLabel("Nafn");
  const email = page.getByLabel("Netfang");
  const message = page.getByLabel("Hvað tekur of langan tíma?");
  const submit = page.getByRole("button", { name: /Senda verkbeiðni/ });

  await submit.click();
  await expect(name).toBeFocused();
  await Promise.all(
    [name, email, message].map((field) => expect(field).toHaveAttribute("aria-invalid", "true")),
  );
  await expect(page.getByRole("alert")).toHaveText("Fylltu út nafn, netfang og hvað tekur of langan tíma.");

  await name.fill("Jón");
  await email.fill("jon@");
  await message.fill("Reikningar");
  await submit.click();
  await expect(email).toBeFocused();
  await expect(name).not.toHaveAttribute("aria-invalid", "true");

  await email.fill("jon@daemi.is");
  await page.getByRole("checkbox", { name: "AI agent", exact: true }).check();
  await submit.click();
  await expect(page.getByRole("heading", { name: "Verkbeiðni móttekin" })).toBeFocused();
  await expect(page.getByText(/^VB-\d{4}-\d{6}$/)).toBeVisible();
});

test("language switch keeps every label in the new language", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("switch", { name: "Dark mode" })).toBeAttached();
  await expect(page.getByRole("region", { name: "Suggestion" })).toBeAttached();
});

test("theme switch persists across reloads", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const toggle = page.getByRole("switch", { name: "Myrkur hamur" });
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("switch", { name: "Myrkur hamur" })).toHaveAttribute("aria-checked", "true");
});

test("no console errors or hydration warnings", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" || /hydrat/i.test(m.text())) errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.goto("/en");
  expect(errors).toEqual([]);
});
