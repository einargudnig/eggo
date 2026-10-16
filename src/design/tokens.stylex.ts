import * as stylex from "@stylexjs/stylex";

/**
 * Colour tokens. Every value is `light-dark(light, dark)`: the active scheme comes from
 * `color-scheme` on <html> (OS preference, or data-theme set by the theme switch).
 * Contrast for every pair is checked by `bun run contrast`. See docs/DESIGN-SYSTEM.md §3.
 *
 * Neutral greys with a faint green cast (never cream), and one muted pine accent for links, buttons
 * and ticked boxes. Nothing else is coloured.
 */
export const colors = stylex.defineVars({
  page: "light-dark(#FFFFFF, #121413)",
  page2: "light-dark(#F3F4F2, #1A1D1C)",
  ink: "light-dark(#1A1D1C, #E4E7E5)",
  muted: "light-dark(#5E6562, #9BA29F)",
  line: "light-dark(#E2E5E2, #2B2F2D)",
  /** Form field and checkbox borders: 3:1 against the page (WCAG 1.4.11). */
  control: "light-dark(#878F8B, #6E7672)",
  accent: "light-dark(#2F5D50, #8FBFAE)",
  accentInk: "light-dark(#FFFFFF, #121413)",
  /** Soft lift for the one floating element, the phone suggestion bar. */
  shadow: "light-dark(rgb(0 0 0 / 0.06), rgb(0 0 0 / 0.4))",
});

export const fonts = stylex.defineVars({
  text: '"Public Sans", "Public Sans Fallback", "Helvetica Neue", Arial, sans-serif',
});

const PHONE = "@media (max-width: 760px)";

export const type = stylex.defineVars({
  display: { default: "clamp(44px, 6.2vw, 88px)", [PHONE]: "clamp(34px, 9.6vw, 42px)" },
  /** The work page's numbers: each case is led by the one figure that changed. Larger than the display headline on purpose. */
  monument: { default: "clamp(72px, 10vw, 144px)", [PHONE]: "clamp(64px, 20vw, 88px)" },
  h2: { default: "clamp(28px, 3vw, 40px)", [PHONE]: "28px" },
  h3: "20px",
  lead: { default: "20px", [PHONE]: "18px" },
  body: "17px",
  small: "15px",
  trackDisplay: "-0.03em",
  trackHead: "-0.02em",
});

/** Spacing scale: 2 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144. Lint rejects raw spacing values outside this folder. */
export const space = stylex.defineVars({
  s0: "2px",
  s1: "4px",
  s2: "8px",
  s3: "12px",
  s4: "16px",
  s5: "24px",
  s6: "32px",
  s7: "48px",
  s8: "64px",
  s9: "96px",
  s10: "144px",
  gutter: { default: "32px", [PHONE]: "20px" },
  section: { default: "96px", [PHONE]: "72px" },
});

export const layout = stylex.defineVars({
  max: "1120px",
  radius: "12px",
  control: "8px",
});

export const motion = stylex.defineVars({
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  fast: "120ms",
  base: "200ms",
});
