import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, motion, space } from "../design/tokens.stylex";

type Variant = "primary" | "ghost";
type Common = { variant: Variant; children: ReactNode; stretchOnPhone?: boolean; inverted?: boolean };

const buttonStyle = ({ variant, stretchOnPhone, inverted }: Omit<Common, "children">) =>
  stylex.props(
    styles.base,
    ui.focusRing,
    styles[variant],
    inverted && styles.inverted,
    stretchOnPhone && styles.stretch,
  );

/** The arrow is part of the button language (DESIGN-SYSTEM §5) and hidden from screen readers. */
const Label = ({ children }: { children: ReactNode }) => (
  <>
    <span>{children}</span>
    <span aria-hidden="true">→</span>
  </>
);

export function ButtonLink({ href, ...common }: Common & { href: string }) {
  return (
    <a href={href} {...buttonStyle(common)}>
      <Label>{common.children}</Label>
    </a>
  );
}

export function Button({
  variant,
  stretchOnPhone,
  inverted,
  children,
  ...rest
}: Common & Omit<ComponentProps<"button">, "className" | "style">) {
  return (
    <button
      {...rest}
      {...buttonStyle({ variant, stretchOnPhone: stretchOnPhone ?? false, inverted: inverted ?? false })}
    >
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
    fontFamily: fonts.mono,
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    minHeight: "48px",
    paddingInline: space.s4,
    borderWidth: "1px",
    borderStyle: "solid",
    cursor: "pointer",
    transitionProperty: "background-color, color, transform",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.step,
    transform: { default: null, ":active": "translateY(1px)" },
  },
  primary: {
    backgroundColor: { default: colors.accent, [media.hover]: { default: null, ":hover": colors.ink } },
    color: { default: colors.onAccent, [media.hover]: { default: null, ":hover": colors.surface } },
    borderColor: { default: colors.accent, [media.hover]: { default: null, ":hover": colors.ink } },
  },
  ghost: {
    backgroundColor: { default: "transparent", [media.hover]: { default: null, ":hover": colors.ink } },
    color: { default: colors.ink, [media.hover]: { default: null, ":hover": colors.surface } },
    borderColor: colors.ink,
  },
  inverted: {
    backgroundColor: { default: colors.accent, [media.hover]: { default: null, ":hover": colors.contactFg } },
    color: { default: colors.onAccent, [media.hover]: { default: null, ":hover": colors.contactBg } },
    borderColor: { default: colors.accent, [media.hover]: { default: null, ":hover": colors.contactFg } },
  },
  stretch: {
    width: { default: null, [media.phone]: "100%" },
    justifyContent: { default: null, [media.phone]: "space-between" },
  },
});
