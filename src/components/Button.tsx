import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, motion, space, type } from "../design/tokens.stylex";

/** `inverse` is for a field set in ink (the work page's close): page-coloured button, ink text. */
type Common = { children: ReactNode; stretchOnPhone?: boolean | undefined; inverse?: boolean | undefined };

const buttonStyle = (stretchOnPhone = false, inverse = false) =>
  stylex.props(
    styles.base,
    ui.focusRing,
    stretchOnPhone && styles.stretch,
    inverse && styles.inverse,
    stylex.defaultMarker(),
  );

/** The arrow is part of the button language (DESIGN-SYSTEM §5) and hidden from screen readers. */
const Label = ({ children }: { children: ReactNode }) => (
  <>
    <span>{children}</span>
    <span aria-hidden="true" {...stylex.props(styles.arrow)}>
      →
    </span>
  </>
);

export function ButtonLink({
  stretchOnPhone,
  inverse,
  children,
  ...rest
}: Common & Omit<ComponentProps<"a">, "className" | "style">) {
  return (
    <a {...rest} {...buttonStyle(stretchOnPhone, inverse)}>
      <Label>{children}</Label>
    </a>
  );
}

export function Button({
  stretchOnPhone,
  inverse,
  children,
  ...rest
}: Common & Omit<ComponentProps<"button">, "className" | "style">) {
  return (
    <button {...rest} {...buttonStyle(stretchOnPhone, inverse)}>
      <Label>{children}</Label>
    </button>
  );
}

const styles = stylex.create({
  arrow: {
    display: "inline-block",
    transitionProperty: "transform",
    transitionDuration: motion.base,
    transitionTimingFunction: motion.ease,
    transform: {
      default: "none",
      [media.hover]: { default: "none", [stylex.when.ancestor(":hover")]: "translateX(3px)" },
    },
  },
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.s3,
    textDecoration: "none",
    fontFamily: fonts.text,
    fontSize: type.body,
    fontWeight: 600,
    lineHeight: 1,
    minHeight: "48px",
    paddingInline: space.s5,
    borderWidth: 0,
    borderRadius: layout.control,
    backgroundColor: colors.accent,
    color: colors.accentInk,
    cursor: "pointer",
    transitionProperty: "opacity",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.ease,
    opacity: { default: 1, ":disabled": 0.6, [media.hover]: { default: 1, ":hover": 0.88 } },
  },
  inverse: {
    backgroundColor: colors.page,
    color: colors.ink,
    outline: { default: "none", ":focus-visible": `2px solid ${colors.page}` },
  },
  stretch: { width: { default: null, [media.phone]: "100%" } },
});
