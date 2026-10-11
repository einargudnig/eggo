import * as stylex from "@stylexjs/stylex";

/** Breakpoints and capability queries. Media queries can't use CSS variables, so these are constants. */
export const media = stylex.defineConsts({
  tablet: "@media (max-width: 960px)",
  phone: "@media (max-width: 760px)",
  hover: "@media (hover: hover) and (pointer: fine)",
  reducedMotion: "@media (prefers-reduced-motion: reduce)",
  forcedColors: "@media (forced-colors: active)",
});
