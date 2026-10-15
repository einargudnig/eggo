/**
 * WCAG contrast check for every text/UI pair, in both themes, read straight from the token source.
 * Run: `bun run contrast`. Exits 1 if any pair fails, so it runs in `bun run check`.
 */
import { readFileSync } from "node:fs";

type Rgba = { r: number; g: number; b: number; a: number };
type Theme = "light" | "dark";

const source = readFileSync(new URL("../src/design/tokens.stylex.ts", import.meta.url), "utf8");
const colorsBlock = source.slice(
  source.indexOf("export const colors"),
  source.indexOf("});", source.indexOf("export const colors")),
);

const parseColor = (value: string): Rgba => {
  const hex = /^#([0-9a-f]{6})$/i.exec(value.trim());
  if (hex?.[1]) {
    const n = Number.parseInt(hex[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const rgb = /^rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)$/.exec(value.trim());
  if (rgb) return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]), a: Number(rgb[4]) };
  throw new Error(`Unsupported colour "${value}". Extend parseColor in scripts/contrast.ts.`);
};

const tokens = new Map<string, Record<Theme, Rgba>>();
for (const m of colorsBlock.matchAll(/(\w+): "light-dark\((.+?), ((?:#|rgb).+?)\)",/g)) {
  const [, name, light, dark] = m;
  if (name && light && dark) tokens.set(name, { light: parseColor(light), dark: parseColor(dark) });
}

const token = (name: string, theme: Theme) => {
  const t = tokens.get(name);
  if (!t) throw new Error(`Unknown token "${name}" in contrast pairs.`);
  return t[theme];
};

const over = (fg: Rgba, bg: Rgba): Rgba => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a),
  a: 1,
});
const channel = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = ({ r, g, b }: Rgba) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const ratio = (fg: Rgba, bg: Rgba) => {
  const [hi, lo] = [luminance(over(fg, bg)), luminance(bg)].toSorted((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
};

/** [label, foreground token, background token, minimum ratio]. 4.5 = text, 3 = UI boundaries. */
const pairs: readonly [string, string, string, number][] = [
  ["ink / page", "ink", "page", 4.5],
  ["ink / page-2 (cards)", "ink", "page2", 4.5],
  ["muted / page", "muted", "page", 4.5],
  ["muted / page-2", "muted", "page2", 4.5],
  ["accent / page (links)", "accent", "page", 4.5],
  ["accent / page-2", "accent", "page2", 4.5],
  ["accent ink / accent (buttons, ticked chips)", "accentInk", "accent", 4.5],
  ["control / page (field and checkbox borders)", "control", "page", 3],
  ["control / page-2", "control", "page2", 3],
  ["accent / page-2 (focus ring on cards)", "accent", "page2", 3],
];

let failed = 0;
for (const theme of ["light", "dark"] as const) {
  console.log(`\n${theme}`);
  for (const [label, fg, bg, min] of pairs) {
    const r = ratio(token(fg, theme), token(bg, theme));
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`${ok ? "ok  " : "FAIL"} ${r.toFixed(2).padStart(5)}  (min ${min})  ${label}`);
  }
}
if (failed) {
  console.error(`\n${failed} pair(s) below WCAG AA.`);
  process.exit(1);
}
