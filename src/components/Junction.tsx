import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import type { PartId } from "../content/parts";
import { media } from "../design/media.stylex";
import { colors, fonts, motion } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";

type Props = {
  /** Routes that match the ticked symptoms. Empty: every route is lit. */
  lit: readonly PartId[];
  /** Second line of "You are here:". */
  here: string;
};

/**
 * The hero's junction sign: five roads leave a yellow "you are here" dot. Ticking symptoms lights the
 * matching roads and dims the rest. The arms draw in once on load. Decorative for screen readers: the
 * route summary next to it says the same thing in words.
 */
export function Junction({ lit, here }: Props) {
  const { t } = useLang();
  const on = (id: PartId) => lit.length === 0 || lit.includes(id);
  const arm = (id: PartId, delay: Delay, children: ReactNode) => (
    <g {...stylex.props(styles.arm, !on(id) && styles.dim)}>
      <g {...stylex.props(styles.draw, styles[delay])}>{children}</g>
    </g>
  );

  return (
    <svg viewBox="0 0 620 600" aria-hidden="true" {...stylex.props(styles.svg)}>
      <rect width="620" height="600" rx="26" {...stylex.props(styles.plate)} />
      <rect x="11" y="11" width="598" height="578" rx="17" {...stylex.props(styles.border)} />
      <path d="M310 548 V330" {...stylex.props(styles.road)} />

      {arm(
        "05",
        "d4",
        <>
          <path d="M310 360 C 280 420, 200 430, 170 480" {...stylex.props(styles.road, styles.gravel)} />
          <text x="46" y="524" {...stylex.props(styles.name, styles.nameSmall)}>
            {t.parts["05"].sign}
          </text>
          <text x="46" y="552" {...stylex.props(styles.dist)}>
            {t.junction.mapping}
          </text>
        </>,
      )}
      {arm(
        "02",
        "d0",
        <>
          <path d="M310 330 V136" {...stylex.props(styles.road)} />
          <polygon points="310,88 274,140 346,140" {...stylex.props(styles.head)} />
          <text x="270" y="112" textAnchor="end" {...stylex.props(styles.name)}>
            {t.parts["02"].sign}
          </text>
          <text x="270" y="142" textAnchor="end" {...stylex.props(styles.dist)}>
            {t.parts["02"].time}
          </text>
        </>,
      )}
      {arm(
        "01",
        "d1",
        <>
          <path d="M310 330 L438 202" {...stylex.props(styles.road)} />
          <polygon points="474,166 418,176 464,222" {...stylex.props(styles.head)} />
          <text x="392" y="84" {...stylex.props(styles.name)}>
            {t.parts["01"].sign}
          </text>
          <text x="392" y="114" {...stylex.props(styles.dist)}>
            {t.parts["01"].time}
          </text>
        </>,
      )}
      {arm(
        "04",
        "d2",
        <>
          <path d="M310 330 H500" {...stylex.props(styles.road)} />
          <polygon points="550,330 496,294 496,366" {...stylex.props(styles.head)} />
          <text x="574" y="414" textAnchor="end" {...stylex.props(styles.name)}>
            {t.parts["04"].sign}
          </text>
          <text x="574" y="444" textAnchor="end" {...stylex.props(styles.dist)}>
            {t.parts["04"].time}
          </text>
        </>,
      )}
      {arm(
        "03",
        "d3",
        <>
          <path d="M310 330 H120" {...stylex.props(styles.road)} />
          <polygon points="70,330 124,294 124,366" {...stylex.props(styles.head)} />
          <text x="46" y="414" {...stylex.props(styles.name)}>
            {t.parts["03"].sign}
          </text>
          <text x="46" y="444" {...stylex.props(styles.dist)}>
            {t.parts["03"].time}
          </text>
        </>,
      )}

      <text x="338" y="518" {...stylex.props(styles.hereLabel)}>
        {t.junction.here}
      </text>
      <text x="338" y="552" {...stylex.props(styles.name, styles.here)}>
        {here}
      </text>
      <circle cx="310" cy="546" r="14" {...stylex.props(styles.dot)} />
    </svg>
  );
}

type Delay = "d0" | "d1" | "d2" | "d3" | "d4";

const reveal = stylex.keyframes({
  from: { opacity: 0, transform: "scale(0.96)" },
  to: { opacity: 1, transform: "none" },
});

const styles = stylex.create({
  svg: { display: "block", width: "100%", height: "auto" },
  plate: { fill: colors.sign },
  border: { fill: "none", stroke: colors.signInk, strokeWidth: 5 },
  road: { fill: "none", stroke: colors.signInk, strokeWidth: 26 },
  gravel: { strokeDasharray: "16 12", strokeWidth: 10 },
  head: { fill: colors.signInk },
  name: { fill: colors.signInk, fontFamily: fonts.sign, fontWeight: 700, fontSize: "31px" },
  nameSmall: { fontSize: "25px" },
  dist: { fill: colors.signSoft, fontFamily: fonts.sign, fontWeight: 600, fontSize: "24px" },
  hereLabel: { fill: colors.signSoft, fontFamily: fonts.sign, fontWeight: 600, fontSize: "21px" },
  here: { fontSize: "28px" },
  dot: { fill: colors.warn },
  arm: {
    transitionProperty: "opacity",
    transitionDuration: motion.base,
    transitionTimingFunction: motion.step,
  },
  dim: { opacity: 0.22 },
  draw: {
    transformOrigin: "310px 330px",
    animationName: { default: reveal, [media.reducedMotion]: "none" },
    animationDuration: "420ms",
    animationTimingFunction: motion.step,
    animationFillMode: "backwards",
  },
  d0: { animationDelay: "0ms" },
  d1: { animationDelay: "90ms" },
  d2: { animationDelay: "180ms" },
  d3: { animationDelay: "270ms" },
  d4: { animationDelay: "360ms" },
});
