import { expect, test } from "@playwright/test";

/** The keyboard paths verified on the mockup (docs/ACCESSIBILITY.md §3). */

test("skip link is first and visible on focus", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Fara í efni" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
});

test("diagram node moves focus to its part card", async ({ page }) => {
  await page.goto("/");
  const node = page.getByRole("button", { name: "02 Kerfi, sjá lýsingu" }).locator("visible=true");
  await node.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#part-02")).toBeFocused();
});

test("phone part nav marks the current part and focuses its card", async ({ page, isMobile }) => {
  test.skip(!isMobile, "part nav is phone only");
  await page.goto("/");
  const tab = page.getByRole("navigation", { name: "Hlutar" }).getByRole("button", { name: "03 AI agent" });
  await tab.click();
  await expect(tab).toHaveAttribute("aria-current", "true");
  await expect(page.locator("#part-03")).toBeFocused();
});

test("work order: errors are tied to fields, receipt takes focus", async ({ page }) => {
  await page.goto("/");
  const name = page.getByLabel("Nafn");
  const email = page.getByLabel("Netfang");
  const message = page.getByLabel("Hvað þarf að leysa?");
  const submit = page.getByRole("button", { name: /Senda verkbeiðni/ });

  await submit.click();
  await expect(name).toBeFocused();
  await Promise.all(
    [name, email, message].map((field) => expect(field).toHaveAttribute("aria-invalid", "true")),
  );
  await expect(page.getByRole("alert")).toHaveText("Fylltu út nafn, netfang og hvað þarf að leysa.");

  await name.fill("Jón");
  await email.fill("jon@");
  await message.fill("Reikningar");
  await submit.click();
  await expect(email).toBeFocused();
  await expect(name).not.toHaveAttribute("aria-invalid", "true");

  await email.fill("jon@daemi.is");
  await page.getByRole("checkbox", { name: "03 AI agent" }).check();
  await submit.click();
  await expect(page.getByRole("heading", { name: "Verkbeiðni móttekin" })).toBeFocused();
  await expect(page.getByText(/^VB-\d{4}-\d{4}$/)).toBeVisible();
});

test("language switch keeps every label in the new language", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("switch", { name: "Dark mode" })).toBeAttached();
  await expect(page.getByRole("button", { name: "05 Undefined, see details" }).first()).toBeAttached();
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
