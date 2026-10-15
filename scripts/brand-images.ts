/**
 * Renders the share images and icons from the dictionaries, the light colour tokens and the self-hosted fonts:
 * public/og-is.png, og-en.png, og.png (1200×630), logo-social.png (1080²), apple-touch-icon.png (180²),
 * and copies the OG images and favicon into docs/brand/. Run: `bun scripts/brand-images.ts`.
 */
import { copyFileSync, readFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { brand } from "../src/content/brand";
import { partIds, parts, type PartId } from "../src/content/parts";
import { wordmark } from "../src/design/wordmark";
import { en } from "../src/i18n/en";
import { is, type Dict } from "../src/i18n/is";

const root = new URL("../", import.meta.url);
const tokens = readFileSync(new URL("src/design/tokens.stylex.ts", root), "utf8");
const light = (name: string) => {
  const m = new RegExp(`${name}: "light-dark\\((#[0-9A-Fa-f]{6}),`).exec(tokens);
  if (!m?.[1]) throw new Error(`No light value for colour token "${name}".`);
  return m[1];
};
const c = {
  page: light("page"),
  page2: light("page2"),
  ink: light("ink"),
  muted: light("muted"),
  accent: light("accent"),
};

const font = (file: string) =>
  `data:font/woff2;base64,${readFileSync(new URL(`public/fonts/${file}`, root)).toString("base64")}`;
/** The drawn wordmark at a given height in px, as inline SVG. */
const mark = (height: number) =>
  `<svg class="mark" width="${(height * wordmark.width) / wordmark.height}" height="${height}" viewBox="0 0 ${wordmark.width} ${wordmark.height}">${wordmark.letters
    .map((d) => `<path d="${d}" fill="${c.ink}"/>`)
    .join("")}<polygon points="${wordmark.accent}" fill="${c.accent}"/></svg>`;

const css = `
@font-face { font-family: "Public Sans"; font-weight: 400 700; src: url(${font("public-sans-latin.woff2")}) format("woff2"); }
@font-face { font-family: "JetBrains Mono"; font-weight: 400 700; src: url(${font("jetbrains-mono-latin.woff2")}) format("woff2"); }
* { box-sizing: border-box; margin: 0; }
body { background: ${c.page}; color: ${c.ink}; font-family: "Public Sans", sans-serif; -webkit-font-smoothing: antialiased;
  /* Without it, headless Chromium draws big glyphs as faceted polygons. */
  text-rendering: geometricPrecision; }
.label { font: 500 22px "JetBrains Mono", monospace; letter-spacing: .06em; text-transform: uppercase; color: ${c.muted}; }
.label b { color: ${c.ink}; font-weight: 700; }
.mark { display: block; flex: none; align-self: flex-start; overflow: visible; }
`;

/** The hero figure's four parts as a 2×2 of outlined boxes; `lit` gets the accent outline, like a ticked symptom. */
const boxes = (t: Dict, lit: PartId) =>
  partIds
    .filter((id) => parts[id].defined)
    .map(
      (id) => `<div class="box${id === lit ? " lit" : ""}">
        <p class="label">${id} · ${parts[id].code}</p><p class="name">${t.parts[id].short}</p></div>`,
    )
    .join("");

const og = (t: Dict) => `<style>${css}
.og { width: 1200px; height: 630px; padding: 64px 72px; display: grid; grid-template-columns: 1.15fr 1fr; gap: 56px; }
.left { display: flex; flex-direction: column; justify-content: space-between; }
h1 { font-size: 66px; font-weight: 600; line-height: 1.04; letter-spacing: -.035em; text-wrap: balance; }
.grid { align-self: center; display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
.box { border: 2px solid ${c.ink}; padding: 22px 22px 26px; background: ${c.page}; }
.box.lit { border: 4px solid ${c.accent}; padding: 20px 20px 24px; }
.box .label { font-size: 17px; }
.name { margin-top: 10px; font-size: 30px; font-weight: 600; letter-spacing: -.02em; }
</style>
<div class="og"><div class="left">${mark(52)}
<h1>${t.hero.titleStart}${t.hero.titleEm}</h1>
<p class="label"><b>${brand.url.replace("https://", "")}</b> · ${t.figure.count}</p></div>
<div class="grid">${boxes(t, "03")}</div></div>`;

const square = (size: number, scale: number) => `<style>${css}
.sq { width: ${size}px; height: ${size}px; display: grid; place-items: center; background: ${c.page}; }
.in { display: grid; justify-items: center; gap: ${24 * scale}px; }
.dots { display: grid; grid-template-columns: repeat(2, ${40 * scale}px); gap: ${12 * scale}px; }
.dots i { height: ${28 * scale}px; border: ${Math.max(2, 4 * scale)}px solid ${c.ink}; }
.dots i:last-child { background: ${c.accent}; border-color: ${c.accent}; }
</style>
<div class="sq"><div class="in">${mark(300 * scale)}<div class="dots"><i></i><i></i><i></i><i></i></div></div></div>`;

const shots: { file: string; html: string; w: number; h: number }[] = [
  { file: "og-is.png", html: og(is), w: 1200, h: 630 },
  { file: "og-en.png", html: og(en), w: 1200, h: 630 },
  { file: "og.png", html: og(is), w: 1200, h: 630 },
  { file: "logo-social.png", html: square(1080, 1.6), w: 1080, h: 1080 },
  { file: "apple-touch-icon.png", html: square(180, 0.26), w: 180, h: 180 },
];

const browser = await chromium.launch();
await Promise.all(
  shots.map(async ({ file, html, w, h }) => {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: new URL(`public/${file}`, root).pathname });
    await page.close();
    console.log(`public/${file}`);
  }),
);
await browser.close();

for (const file of ["og-is.png", "og-en.png", "favicon.svg"]) {
  copyFileSync(new URL(`public/${file}`, root), new URL(`docs/brand/${file}`, root));
}
