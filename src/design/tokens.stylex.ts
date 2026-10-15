import * as stylex from "@stylexjs/stylex";

/**
 * Colour tokens. Every value is `light-dark(light, dark)`: the active scheme comes from
 * `color-scheme` on <html> (OS preference, or data-theme set by the theme switch).
 * Contrast for every pair is checked by `bun run contrast`. See docs/DESIGN-SYSTEM.md §3.
 *
 * The page is calm white and asphalt grey; road-sign blue is the identity and appears only on signs,
 * buttons and links. Warning yellow is for "you are here" and ticked symptoms, never for text.
 */
export const colors = stylex.defineVars({
  page: "light-dark(#FFFFFF, #17191B)",
  page2: "light-dark(#EEF0F1, #202326)",
  ink: "light-dark(#16191C, #E9ECEE)",
  muted: "light-dark(#545B62, #A3AAB1)",
  line: "light-dark(#D5D9DC, #34393E)",
  link: "light-dark(#0B4F9C, #8DB8EC)",
  sign: "light-dark(#0B4F9C, #0E5AAE)",
  signInk: "light-dark(#FFFFFF, #FFFFFF)",
  signSoft: "light-dark(#C9DBF0, #D3E2F4)",
  signHighlight: "light-dark(rgb(255 255 255 / 0.12), rgb(255 255 255 / 0.12))",
  warn: "light-dark(#FFD200, #FFD200)",
  warnEdge: "light-dark(#C8102E, #E0243F)",
  warnInk: "light-dark(#16191C, #16191C)",
  field: "light-dark(#FFFFFF, #FFFFFF)",
  fieldInk: "light-dark(#16191C, #16191C)",
});

export const fonts = stylex.defineVars({
  sign: '"Overpass", "Overpass Fallback", "Helvetica Neue", Arial, sans-serif',
  text: '"Public Sans", "Public Sans Fallback", "Helvetica Neue", Arial, sans-serif',
});

const PHONE = "@media (max-width: 760px)";

export const type = stylex.defineVars({
  display: { default: "clamp(42px, 5.2vw, 72px)", [PHONE]: "clamp(38px, 11vw, 48px)" },
  h2: { default: "clamp(32px, 3.8vw, 52px)", [PHONE]: "clamp(30px, 8.4vw, 38px)" },
  signName: { default: "clamp(28px, 2.8vw, 38px)", [PHONE]: "26px" },
  h3: { default: "24px", [PHONE]: "22px" },
  lead: { default: "20px", [PHONE]: "18px" },
  body: "18px",
  small: "16px",
  fine: "15px",
  trackDisplay: "-0.02em",
  trackHead: "-0.015em",
});

/** Spacing scale: 2 · 4 · 8 · 12 · 16 · 22 · 28 · 36 · 56 · 72 · 96. Lint rejects raw spacing values outside this folder. */
export const space = stylex.defineVars({
  s0: "2px",
  s1: "4px",
  s2: "8px",
  s3: "12px",
  s4: "16px",
  s5: "22px",
  s6: "28px",
  s7: "36px",
  s8: "56px",
  s9: "72px",
  s10: "96px",
  gutter: { default: "28px", [PHONE]: "16px" },
  section: { default: "96px", [PHONE]: "64px" },
});

export const layout = stylex.defineVars({
  max: "1180px",
  /** The sign plate: an outer blue rim, then a white inset border, like a real road sign. */
  signRim: { default: "10px", [PHONE]: "6px" },
  signBorder: { default: "4px", [PHONE]: "3px" },
  signRadius: { default: "22px", [PHONE]: "16px" },
  signInnerRadius: { default: "15px", [PHONE]: "11px" },
});

export const motion = stylex.defineVars({
  step: "cubic-bezier(0.6, 0, 0.3, 1)",
  fast: "120ms",
  base: "160ms",
});
