import * as stylex from "@stylexjs/stylex";
import { colors, fonts, layout, motion, space, type } from "./tokens.stylex";

/** Shared building blocks. Components compose these instead of re-declaring them. */
export const ui = stylex.create({
  wrap: {
    maxWidth: layout.max,
    marginInline: "auto",
    paddingInline: space.gutter,
    position: "relative",
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: type.label,
    fontWeight: 500,
    letterSpacing: type.trackLabel,
    textTransform: "uppercase",
    color: colors.muted,
    margin: 0,
  },
  labelStrong: { color: colors.ink, fontWeight: 700 },
  tabular: { fontVariantNumeric: "tabular-nums" },
  focusRing: {
    outline: { default: "none", ":focus-visible": `2px solid ${colors.accentInk}` },
    outlineOffset: "3px",
  },
  srOnly: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
  /** Section targets: clear the sticky bar when jumped to, no ring when focused by script. */
  anchor: { scrollMarginTop: layout.barHeight, outline: "none" },
  press: {
    transitionProperty: "transform, background-color, color",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.step,
    transform: { default: null, ":active": "translateY(1px)" },
  },
});
