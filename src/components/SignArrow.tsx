import * as stylex from "@stylexjs/stylex";
import { parts, type Direction, type PartId } from "../content/parts";
import { colors, fonts, motion } from "../design/tokens.stylex";
import { media } from "../design/media.stylex";

/** The road-sign arrow, pointing straight ahead before rotation. */
const ARROW = "M26 2 48 26H34v24H18V26H4z";

type Props = {
  part: PartId;
  size: "sign" | "chip";
  /** Nudge the arrow in its own direction while an ancestor marked with `stylex.defaultMarker()` is hovered. */
  nudge?: boolean;
};

/** A part's arrow as drawn on the direction sign. Decorative: the part's name is always next to it. */
export function SignArrow({ part, size, nudge = false }: Props) {
  const { arrow } = parts[part];
  return (
    <svg
      viewBox="0 0 52 52"
      aria-hidden="true"
      {...stylex.props(
        styles.svg,
        styles[size],
        arrow !== null && rotation[arrow],
        nudge && arrow !== null && nudges[arrow],
      )}
    >
      {arrow === null ? (
        <text x="26" y="44" textAnchor="middle" {...stylex.props(styles.mark)}>
          ?
        </text>
      ) : (
        <path d={ARROW} {...stylex.props(styles.fill)} />
      )}
    </svg>
  );
}

const styles = stylex.create({
  svg: {
    display: "block",
    flexShrink: 0,
    transitionProperty: "translate",
    transitionDuration: motion.base,
    transitionTimingFunction: motion.step,
  },
  sign: {
    width: { default: "52px", [media.phone]: "34px" },
    height: { default: "52px", [media.phone]: "34px" },
  },
  chip: { width: "12px", height: "12px" },
  fill: { fill: colors.signInk },
  mark: { fill: colors.signInk, fontFamily: fonts.sign, fontWeight: 800, fontSize: "48px" },
  r45: { transform: "rotate(45deg)" },
  r0: { transform: "none" },
  rLeft: { transform: "rotate(-90deg)" },
  rRight: { transform: "rotate(90deg)" },
  nudgeDiagonal: {
    translate: {
      default: null,
      [media.hover]: { default: null, [stylex.when.ancestor(":hover")]: "4px -4px" },
    },
  },
  nudgeUp: {
    translate: {
      default: null,
      [media.hover]: { default: null, [stylex.when.ancestor(":hover")]: "0 -6px" },
    },
  },
  nudgeLeft: {
    translate: {
      default: null,
      [media.hover]: { default: null, [stylex.when.ancestor(":hover")]: "-6px 0" },
    },
  },
  nudgeRight: {
    translate: { default: null, [media.hover]: { default: null, [stylex.when.ancestor(":hover")]: "6px 0" } },
  },
});

const rotation = {
  diagonal: styles.r45,
  ahead: styles.r0,
  left: styles.rLeft,
  right: styles.rRight,
} satisfies Record<Direction, unknown>;

const nudges = {
  diagonal: styles.nudgeDiagonal,
  ahead: styles.nudgeUp,
  left: styles.nudgeLeft,
  right: styles.nudgeRight,
} satisfies Record<Direction, unknown>;
