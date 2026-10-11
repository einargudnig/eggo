import * as stylex from "@stylexjs/stylex";

/**
 * Colour tokens. Every value is `light-dark(light, dark)`: the active scheme comes from
 * `color-scheme` on <html> (OS preference, or data-theme set by the theme switch).
 * Contrast for every pair is checked by `bun run contrast`. See docs/DESIGN-SYSTEM.md §3.
 */
export const colors = stylex.defineVars({
  surface: "light-dark(#F2F1EC, #121211)",
  surface2: "light-dark(#E9E7E0, #1B1B19)",
  ink: "light-dark(#111110, #E6E4DC)",
  muted: "light-dark(#5F5D57, #9D9B93)",
  rule: "light-dark(rgb(17 17 16 / 0.13), rgb(237 236 230 / 0.11))",
  ruleStrong: "light-dark(rgb(17 17 16 / 0.55), rgb(237 236 230 / 0.42))",
  grid: "light-dark(rgb(17 17 16 / 0.1), rgb(237 236 230 / 0.055))",
  accent: "light-dark(#E8501A, #F2622B)",
  onAccent: "light-dark(#111110, #121211)",
  accentInk: "light-dark(#B83A0C, #F47A4A)",
  signal: "light-dark(#E8D600, #CDBE12)",
  contactBg: "light-dark(#111110, #1C1B18)",
  contactFg: "light-dark(#F2F1EC, #E6E4DC)",
  contactRule: "light-dark(rgb(242 241 236 / 0.42), rgb(230 228 220 / 0.42))",
  contactMuted: "light-dark(rgb(242 241 236 / 0.66), rgb(230 228 220 / 0.62))",
});

export const fonts = stylex.defineVars({
  display: '"Schibsted Grotesk", "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  hand: '"Reenie Beanie", "Bradley Hand", cursive',
});

const PHONE = "@media (max-width: 760px)";

export const type = stylex.defineVars({
  display: { default: "clamp(46px, 7.4vw, 104px)", [PHONE]: "clamp(46px, 14.2vw, 72px)" },
  h2: { default: "clamp(28px, 3.8vw, 52px)", [PHONE]: "clamp(28px, 8.4vw, 38px)" },
  h3: { default: "clamp(30px, 3vw, 40px)", [PHONE]: "34px" },
  lead: { default: "18px", [PHONE]: "17px" },
  body: "17px",
  small: "15px",
  label: "11px",
  trackDisplay: "-0.045em",
  trackHead: "-0.035em",
  trackLabel: "0.08em",
});

/** Spacing scale: 4 · 8 · 12 · 16 · 22 · 28 · 36 · 56 · 72. Lint rejects raw spacing values outside this folder. */
export const space = stylex.defineVars({
  s1: "4px",
  s2: "8px",
  s3: "12px",
  s4: "16px",
  s5: "22px",
  s6: "28px",
  s7: "36px",
  s8: "56px",
  s9: "72px",
  gutter: { default: "24px", [PHONE]: "16px" },
});

export const layout = stylex.defineVars({
  max: "1240px",
  barHeight: { default: "60px", [PHONE]: "56px" },
  rule: "1px",
});

export const motion = stylex.defineVars({
  step: "cubic-bezier(0.7, 0, 0.3, 1)",
  fast: "120ms",
  base: "160ms",
  slow: "220ms",
});
