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
  h2: {
    margin: 0,
    fontFamily: fonts.text,
    fontSize: type.h2,
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: type.trackHead,
    textWrap: "balance",
  },
  /** Section head: heading, then one muted sentence under it. */
  head: { display: "grid", gap: space.s3, marginBottom: space.s7, maxWidth: "40em" },
  headBody: { margin: 0, color: colors.muted, textWrap: "pretty" },
  /** A small muted line in the text face, sentence case: captions, part names, client names. */
  label: { margin: 0, fontSize: type.small, lineHeight: 1.4, color: colors.muted },
  labelStrong: { color: colors.ink, fontWeight: 600 },
  tabular: { fontVariantNumeric: "tabular-nums" },
  focusRing: {
    outline: { default: "none", ":focus-visible": `2px solid ${colors.accent}` },
    outlineOffset: "3px",
  },
  link: {
    color: colors.accent,
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
  /** A quiet grey panel. The only container shape on the page. */
  card: { backgroundColor: colors.page2, borderRadius: layout.radius },
});
