import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, motion, space } from "../design/tokens.stylex";

type Common = { children: ReactNode; stretchOnPhone?: boolean | undefined };

const buttonStyle = (stretchOnPhone = false) =>
  stylex.props(styles.base, ui.focusRing, stretchOnPhone && styles.stretch);

/** The arrow is part of the button language (DESIGN-SYSTEM §5) and hidden from screen readers. */
const Label = ({ children }: { children: ReactNode }) => (
  <>
    <span>{children}</span>
    <span aria-hidden="true">→</span>
  </>
);

export function ButtonLink({
  stretchOnPhone,
  children,
  ...rest
}: Common & Omit<ComponentProps<"a">, "className" | "style">) {
  return (
    <a {...rest} {...buttonStyle(stretchOnPhone)}>
      <Label>{children}</Label>
    </a>
  );
}

export function Button({
  stretchOnPhone,
  children,
  ...rest
}: Common & Omit<ComponentProps<"button">, "className" | "style">) {
  return (
    <button {...rest} {...buttonStyle(stretchOnPhone)}>
      <Label>{children}</Label>
    </button>
  );
}

const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.s3,
    textDecoration: "none",
    fontFamily: fonts.text,
    fontSize: "16px",
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
  stretch: { width: { default: null, [media.phone]: "100%" } },
});
