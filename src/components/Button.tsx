import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, motion, space } from "../design/tokens.stylex";

/** `sign`: a small blue sign on the page. `onSign`: a white sign on a blue sign. */
type Variant = "sign" | "onSign";
type Common = { variant?: Variant | undefined; children: ReactNode; stretchOnPhone?: boolean | undefined };

const buttonStyle = ({ variant = "sign", stretchOnPhone = false }: Omit<Common, "children">) =>
  stylex.props(
    styles.base,
    styles[variant],
    variant === "sign" ? ui.focusRing : ui.focusRingOnSign,
    stretchOnPhone && styles.stretch,
  );

/** The arrow is part of the button language (DESIGN-SYSTEM §5) and hidden from screen readers. */
const Label = ({ children }: { children: ReactNode }) => (
  <>
    <span>{children}</span>
    <span aria-hidden="true">→</span>
  </>
);

export function ButtonLink({
  variant,
  stretchOnPhone,
  children,
  ...rest
}: Common & Omit<ComponentProps<"a">, "className" | "style">) {
  return (
    <a {...rest} {...buttonStyle({ variant, stretchOnPhone })}>
      <Label>{children}</Label>
    </a>
  );
}

export function Button({
  variant,
  stretchOnPhone,
  children,
  ...rest
}: Common & Omit<ComponentProps<"button">, "className" | "style">) {
  return (
    <button {...rest} {...buttonStyle({ variant, stretchOnPhone })}>
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
    fontFamily: fonts.sign,
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: 1,
    minHeight: "52px",
    paddingTop: space.s1,
    paddingInline: space.s5,
    borderWidth: 0,
    borderRadius: "10px",
    cursor: "pointer",
    transitionProperty: "filter, transform",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.step,
    transform: { default: null, ":active": "translateY(1px)" },
    filter: { default: null, [media.hover]: { default: null, ":hover": "brightness(1.12)" } },
  },
  sign: {
    backgroundColor: colors.sign,
    color: colors.signInk,
    boxShadow: `inset 0 0 0 3px ${colors.sign}, inset 0 0 0 5px ${colors.signInk}`,
  },
  onSign: {
    backgroundColor: colors.signInk,
    color: colors.sign,
    boxShadow: `inset 0 0 0 3px ${colors.signInk}, inset 0 0 0 5px ${colors.sign}`,
    filter: { default: null, [media.hover]: { default: null, ":hover": "brightness(0.94)" } },
  },
  stretch: { width: { default: null, [media.phone]: "100%" } },
});
