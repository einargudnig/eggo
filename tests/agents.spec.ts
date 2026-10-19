import { expect, test } from "@playwright/test";

/**
 * The agent-facing surface: llms.txt, Markdown mirrors, sitemap, structured data and the MCP server.
 * Nothing here sends a work order, so the suite is safe to run against production.
 */
test.describe.configure({ mode: "parallel" });
test.skip(({ isMobile }) => isMobile, "HTTP-only checks; one project is enough");

test("llms.txt points at the Markdown pages, the API and the MCP server", async ({ request }) => {
  const res = await request.get("/llms.txt");
  expect(res.ok()).toBe(true);
  const body = await res.text();
  expect(body).toMatch(/^# Eggó/);
  for (const url of ["/en.md", "/index.md", "/api/work-order", "/mcp"]) expect(body).toContain(url);
});

for (const [path, heading] of [
  ["/index.md", "# Eggó — frá vandamáli"],
  ["/en.md", "# Eggó — from problem"],
] as const) {
  test(`markdown mirror: ${path}`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.headers()["content-type"]).toContain("text/markdown");
    const body = await res.text();
    expect(body.startsWith(heading)).toBe(true);
    expect(body).toContain("einargudni.com/use-cases/");
  });
}

test("sitemap lists both languages and robots.txt points at it", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<loc>https://eggo.is/</loc>");
  expect(sitemap).toContain("<loc>https://eggo.is/en</loc>");
  expect(sitemap).toContain("<loc>https://eggo.is/verk</loc>");
  expect(sitemap).toContain("<loc>https://eggo.is/en/verk</loc>");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://eggo.is/sitemap.xml");
});

for (const path of ["/", "/en", "/verk", "/en/verk"]) {
  test(`head carries canonical, OG and valid JSON-LD: ${path}`, async ({ page }) => {
    await page.goto(path);
    const canonical = path === "/" ? "https://eggo.is/" : `https://eggo.is${path}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og-(is|en)\.png$/);
    await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveCount(1);
    const ld: unknown = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}",
    );
    expect(ld).toMatchObject({
      "@graph": [{ "@type": "ProfessionalService" }, { "@type": "Person" }, { "@type": "WebSite" }],
    });
  });
}

test("og images exist", async ({ request }) => {
  const responses = await Promise.all(["is", "en"].map((lang) => request.get(`/og-${lang}.png`)));
  for (const res of responses) expect(res.headers()["content-type"]).toBe("image/png");
});

test("work-order endpoint describes itself and rejects bad input", async ({ request }) => {
  const usage = await request.get("/api/work-order");
  expect(await usage.json()).toMatchObject({ method: "POST" });
  const bad = await request.post("/api/work-order", { data: { name: "Only a name" } });
  expect(bad.status()).toBe(400);
});

test("work-order endpoint answers a filled honeypot like a normal order", async ({ request }) => {
  test.skip(
    Boolean(process.env["PLAYWRIGHT_BASE_URL"]),
    "a deployed copy would send a real email if this broke",
  );
  const order = {
    name: "Bot",
    email: "bot@example.com",
    message: "Buy links",
    website: "https://spam.example",
  };
  const res = await request.post("/api/work-order", { data: order });
  expect(res.status()).toBe(201);
  expect(await res.json()).toMatchObject({ ticket: expect.stringMatching(/^VB-\d{4}-\d+$/) });
});

test("MCP server initializes and lists its tools", async ({ request }) => {
  const rpc = (body: object) => request.post("/mcp", { data: { jsonrpc: "2.0", ...body } });
  const init: unknown = await (
    await rpc({ id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {} } })
  ).json();
  expect(init).toMatchObject({
    id: 1,
    result: { protocolVersion: "2025-06-18", serverInfo: { name: "eggo" } },
  });

  expect((await rpc({ method: "notifications/initialized" })).status()).toBe(202);

  const list: unknown = await (await rpc({ id: 2, method: "tools/list" })).json();
  expect(list).toMatchObject({
    result: { tools: [{ name: "get_studio_info" }, { name: "send_work_order" }] },
  });

  const info: unknown = await (
    await rpc({ id: 3, method: "tools/call", params: { name: "get_studio_info", arguments: {} } })
  ).json();
  expect(info).toMatchObject({
    result: { content: [{ type: "text", text: expect.stringContaining("# Eggó — from problem") }] },
  });
});

for (const [path, title] of [
  ["/nope", "Þessi síða fannst ekki · Eggó"],
  ["/en/nope", "Page not found · Eggó"],
] as const) {
  test(`unknown URL ${path} is a 404 that search engines skip`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.status()).toBe(404);
    const html = await res.text();
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).toContain('name="robots" content="noindex"');
    expect(html).not.toContain('rel="canonical"');
  });
}
