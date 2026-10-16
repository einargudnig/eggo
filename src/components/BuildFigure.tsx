import * as stylex from "@stylexjs/stylex";
import { partIds, parts, type PartId } from "../content/parts";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, motion, space } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";

type Box = { x: number; y: number; w: number; h: number };

/** Four parts in a loop around the undefined one. Not shown on phones: the services list says the same. */
const boxes: Record<PartId, Box> = {
  "01": { x: 10, y: 22, w: 216, h: 96 },
  "02": { x: 294, y: 22, w: 216, h: 96 },
  "03": { x: 294, y: 212, w: 216, h: 96 },
  "04": { x: 10, y: 212, w: 216, h: 96 },
  "05": { x: 196, y: 140, w: 128, h: 50 },
};

/**
 * "Mynd 1": a typical build, five parts wired together. Decorative: the services list says the same in
 * words. Parts in the hero's suggestion are outlined in the accent and the rest step back.
 */
export function BuildFigure({ lit }: { lit: readonly PartId[] }) {
  const { t } = useLang();
  const dimmed = (id: PartId) => lit.length > 0 && !lit.includes(id);

  const node = (id: PartId, b: Box) => {
    const unknown = !parts[id].defined;
    return (
      <g key={id} {...stylex.props(styles.node, dimmed(id) && styles.off)}>
        <rect
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          {...stylex.props(styles.rect, unknown && styles.rectUnknown, lit.includes(id) && styles.rectOn)}
        />
        {unknown ? (
          <>
            <text x={b.x + 14} y={b.y + b.h / 2 + 5} {...stylex.props(styles.detail)}>
              {t.parts[id].detail}
            </text>
            <text
              x={b.x + b.w - 22}
              y={b.y + b.h / 2 + 8}
              textAnchor="middle"
              {...stylex.props(styles.question)}
            >
              ?
            </text>
          </>
        ) : (
          <>
            <text x={b.x + 14} y={b.y + 44} {...stylex.props(styles.name)}>
              {t.parts[id].short}
            </text>
            <text x={b.x + 14} y={b.y + 70} {...stylex.props(styles.detail)}>
              {t.parts[id].detail}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <figure aria-hidden="true" {...stylex.props(styles.figure)}>
      <figcaption {...stylex.props(styles.cap)}>
        <span {...stylex.props(ui.label)}>{t.figure.caption}</span>
        <span {...stylex.props(ui.label)}>{t.figure.count}</span>
      </figcaption>

      <svg viewBox="0 0 520 330" {...stylex.props(styles.svg)}>
        <path d="M226 70 H294" {...stylex.props(styles.wire)} />
        <path d="M398 118 V212" {...stylex.props(styles.wire, styles.wire2)} />
        <path d="M294 260 H226" {...stylex.props(styles.wire, styles.wire3)} />
        <path
          d="M196 146 L170 118 M324 146 L350 118 M324 184 L350 212 M196 184 L170 212"
          {...stylex.props(styles.stub)}
        />
        <text x="260" y="60" textAnchor="middle" {...stylex.props(styles.wireLabel)}>
          {t.figure.wires.post}
        </text>
        <text x="408" y="169" {...stylex.props(styles.wireLabel)}>
          {t.figure.wires.webhook}
        </text>
        <text x="260" y="250" textAnchor="middle" {...stylex.props(styles.wireLabel)}>
          {t.figure.wires.api}
        </text>
        {partIds.map((id) => node(id, boxes[id]))}
      </svg>
    </figure>
  );
}

/** The wires draw in once on load, in the order data flows: site → system → agent → integration. */
const draw = stylex.keyframes({ from: { strokeDashoffset: 120 }, to: { strokeDashoffset: 0 } });

const styles = stylex.create({
  figure: {
    display: { default: "block", [media.phone]: "none" },
    margin: 0,
    width: "100%",
    maxWidth: { default: null, [media.tablet]: "560px" },
  },
  cap: { display: "flex", justifyContent: "space-between", gap: space.s4, marginBottom: space.s4 },
  svg: {
    display: "block",
    width: "100%",
    height: "auto",
    overflow: "visible",
    shapeRendering: "geometricPrecision",
  },
  node: { transitionProperty: "opacity", transitionDuration: "300ms", transitionTimingFunction: motion.ease },
  off: { opacity: 0.32 },
  rect: {
    fill: colors.page,
    stroke: { default: colors.ink, [media.forcedColors]: "CanvasText" },
    strokeWidth: 1,
    transitionProperty: "stroke, stroke-width",
    transitionDuration: "300ms",
    transitionTimingFunction: motion.ease,
  },
  rectOn: { stroke: colors.accent, strokeWidth: 2 },
  rectUnknown: { strokeDasharray: "4 3" },
  name: {
    fontFamily: fonts.text,
    fontSize: "21px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    fill: colors.ink,
  },
  detail: { fontFamily: fonts.text, fontSize: "14px", fill: colors.muted },
  question: { fontFamily: fonts.text, fontSize: "24px", fontWeight: 700, fill: colors.accent },
  wire: {
    stroke: colors.ink,
    strokeWidth: 1,
    fill: "none",
    strokeDasharray: 120,
    animationName: draw,
    animationDuration: "700ms",
    animationTimingFunction: motion.ease,
    animationFillMode: "both",
    animationDelay: "200ms",
  },
  wire2: { animationDelay: "450ms" },
  wire3: { animationDelay: "700ms" },
  stub: { stroke: colors.muted, strokeWidth: 1, strokeDasharray: "3 3", fill: "none" },
  wireLabel: {
    fontFamily: fonts.text,
    fontSize: "13px",
    fontWeight: 500,
    fill: colors.muted,
  },
});
