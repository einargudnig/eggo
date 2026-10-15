import * as stylex from "@stylexjs/stylex";
import { colors, fonts, layout, space, type } from "./tokens.stylex";

/** Shared building blocks. Components compose these instead of re-declaring them. */
export const ui = stylex.create({
  wrap: {
    maxWidth: layout.max,
    marginInline: "auto",
    paddingInline: space.gutter,
    position: "relative",
  },
  section: { paddingBlock: space.section },
  band: { backgroundColor: colors.page2 },
  h2: {
    margin: 0,
    fontFamily: fonts.sign,
    fontSize: type.h2,
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: type.trackHead,
    textWrap: "balance",
  },
  tabular: { fontVariantNumeric: "tabular-nums" },
  /** Focus on the page: link blue. Yellow would fail 3:1 against white. */
  focusRing: {
    outline: { default: "none", ":focus-visible": `3px solid ${colors.link}` },
    outlineOffset: "3px",
  },
  /** Focus on a blue sign: warning yellow. */
  focusRingOnSign: {
    outline: { default: "none", ":focus-visible": `3px solid ${colors.warn}` },
    outlineOffset: "3px",
  },
  link: {
    color: colors.link,
    textUnderlineOffset: "3px",
    textDecorationThickness: { default: "1px", ":hover": "2px" },
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
  /** Section targets: a little air above when jumped to, no ring when focused by script. */
  anchor: { scrollMarginTop: space.s5, outline: "none" },
  /** A road sign: blue plate with a white inset border. `plate` on the outside, `plateIn` inside it. */
  plate: {
    backgroundColor: colors.sign,
    color: colors.signInk,
    borderRadius: layout.signRadius,
    padding: layout.signRim,
  },
  plateIn: {
    borderWidth: layout.signBorder,
    borderStyle: "solid",
    borderColor: colors.signInk,
    borderRadius: layout.signInnerRadius,
  },
  /** A supplementary plate (undirmerki): white with a dark border. Small print that matters, and small jobs. */
  subPlate: {
    backgroundColor: colors.page,
    color: colors.ink,
    borderWidth: "3px",
    borderStyle: "solid",
    borderColor: colors.ink,
    borderRadius: "10px",
  },
});
