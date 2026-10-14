import { expect, test, type Page } from "@playwright/test";

/** On phone the language link and theme switch live in the contents sheet. */
const showControls = async (page: Page, isMobile: boolean) => {
  if (isMobile) await page.getByRole("button", { name: /^(Efni|Contents)$/ }).click();
};

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
  test.skip(Boolean(process.env["PLAYWRIGHT_BASE_URL"]), "a deployed copy would send a real email");
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

test("language switch keeps every label in the new language", async ({ page, isMobile }) => {
  await page.goto("/");
  await showControls(page, isMobile);
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("switch", { name: "Dark mode" })).toBeAttached();
  await expect(page.getByRole("button", { name: "05 Not sure yet, see details" }).first()).toBeAttached();
});

test("theme switch persists across reloads", async ({ page, isMobile }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await showControls(page, isMobile);
  const toggle = page.getByRole("switch", { name: "Myrkur hamur" });
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await showControls(page, isMobile);
  await expect(page.getByRole("switch", { name: "Myrkur hamur" })).toHaveAttribute("aria-checked", "true");
});

test("contents sheet: focus moves in, Esc returns it, entries focus their section", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "contents sheet is phone only");
  await page.goto("/");
  const open = page.getByRole("button", { name: "Efni" });
  await open.click();
  await expect(page.getByRole("dialog", { name: "Efnisyfirlit" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Loka" })).toBeFocused();
  await expect(open).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(open).toBeFocused();
  await expect(open).toHaveAttribute("aria-expanded", "false");

  await open.click();
  await page.getByRole("link", { name: /^Ferli/ }).click();
  await expect(page.locator("#ferli")).toBeFocused();
  await expect(page).toHaveURL(/#ferli$/);
});

test("troubleshooting button moves focus to its part card", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sjá hluta 04, Tenging" }).click();
  await expect(page.locator("#part-04")).toBeFocused();
});

test("work rows open and close from the keyboard", async ({ page }) => {
  await page.goto("/");
  const row = page.locator("#verk details").nth(1);
  await expect(row).not.toHaveAttribute("open");
  await row.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(row).toHaveAttribute("open");
});

test("thumb bar is inert over the hero and usable below it", async ({ page, isMobile }) => {
  test.skip(!isMobile, "thumb bar is phone only");
  await page.goto("/");
  const bar = page.locator("[data-hidden]");
  await expect(bar).toHaveAttribute("inert");
  await page.locator("#ferli").scrollIntoViewIfNeeded();
  await expect(bar).not.toHaveAttribute("inert");
  await expect(bar.getByRole("link", { name: /Hafa samband/ })).toBeInViewport();
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
