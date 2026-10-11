import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** docs/ACCESSIBILITY.md: zero axe violations in both languages and both themes. */
for (const path of ["/", "/en"]) {
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
});
