import { expect, test } from "@playwright/test";

/**
 * Nothing may widen the page. On phones a single overflowing element (even a 1px visually-hidden
 * label escaping a scroll container) makes the browser zoom the whole page out.
 */
for (const path of ["/", "/en"]) {
  test(`no horizontal overflow: ${path}`, async ({ page }) => {
    await page.goto(path);
    const { scrollWidth, clientWidth, innerWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      innerWidth: window.innerWidth,
    }));
    expect(scrollWidth).toBe(clientWidth);
    expect(innerWidth).toBe(clientWidth);
  });
}
