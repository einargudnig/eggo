import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** docs/ACCESSIBILITY.md: zero axe violations in both languages and both themes. */
for (const path of ["/", "/en", "/verk", "/en/verk"]) {
  for (const scheme of ["light", "dark"] as const) {
    test(`axe: ${path} ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
      expect(
        results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
      ).toEqual([]);
    });
  }
}

test("html lang follows the route", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "is");
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("unknown language prefix is a 404, not an Icelandic page", async ({ page }) => {
  const response = await page.goto("/de");
  expect(response?.status()).toBe(404);
  expect((await page.goto("/de/verk"))?.status()).toBe(404);
});

test("the work page lists every case and links home and across languages", async ({ page }) => {
  await page.goto("/verk");
  await expect(page.getByRole("heading", { level: 1, name: "Nýleg verk" })).toBeVisible();
  await expect(page.locator("main ol > li")).toHaveCount(5);
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/verk$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the homepage shows two cases and links to the rest", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#verk ul > li")).toHaveCount(2);
  await page
    .locator("#verk")
    .getByRole("link", { name: /Öll verkin/ })
    .click();
  await expect(page).toHaveURL(/\/verk$/);
});
