import * as stylex from "@stylexjs/stylex";
import type { KeyboardEvent } from "react";
import { partIds, parts, type PartId } from "../content/parts";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, motion, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";

type Box = { x: number; y: number; w: number; h: number };

/** Desktop is a loop around the undefined part; phone is a vertical chain. */
const desk: Record<PartId, Box> = {
  "01": { x: 10, y: 22, w: 216, h: 96 },
  "02": { x: 294, y: 22, w: 216, h: 96 },
  "03": { x: 294, y: 212, w: 216, h: 96 },
  "04": { x: 10, y: 212, w: 216, h: 96 },
  "05": { x: 196, y: 140, w: 128, h: 50 },
};
const phone: Record<PartId, Box> = {
  "01": { x: 10, y: 10, w: 244, h: 64 },
  "02": { x: 10, y: 100, w: 244, h: 64 },
  "03": { x: 10, y: 190, w: 244, h: 64 },
  "04": { x: 10, y: 280, w: 244, h: 64 },
  "05": { x: 10, y: 376, w: 244, h: 64 },
};

type Props = { highlighted: PartId | null; onSelect: (id: PartId) => void };

export function Diagram({ highlighted, onSelect }: Props) {
  const { t } = useLang();
  const nodeProps = (id: PartId) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": `${id} ${t.parts[id].short}, ${t.a11y.seePart}`,
    onClick: () => onSelect(id),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      onSelect(id);
    },
  });
  const nodeStyle = (id: PartId) => ({
    "data-on": highlighted === id,
    ...stylex.props(styles.node, stylex.defaultMarker()),
  });

  return (
    <figure {...stylex.props(styles.figure)}>
      <figcaption {...stylex.props(styles.cap)}>
        <span id="fig1" {...stylex.props(ui.label)}>
          {t.hero.figure}
        </span>
        <span {...stylex.props(ui.label, ui.tabular)}>{t.hero.figureCount}</span>
      </figcaption>

      <svg
        viewBox="0 0 520 330"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- <svg> has no native grouping element
        role="group"
        aria-labelledby="fig1"
        {...stylex.props(styles.svg, styles.desk)}
      >
        <g aria-hidden="true">
          <path d="M226 70 H294" {...stylex.props(styles.wire)} />
          <path d="M398 118 V212" {...stylex.props(styles.wire, styles.wire2)} />
          <path d="M294 260 H226" {...stylex.props(styles.wire, styles.wire3)} />
          <path
            d="M196 146 L170 118 M324 146 L350 118 M324 184 L350 212 M196 184 L170 212"
            {...stylex.props(styles.stub)}
          />
          <text x="236" y="60" {...stylex.props(styles.wireLabel)}>
            {t.hero.wires.post}
          </text>
          <text x="406" y="170" {...stylex.props(styles.wireLabel)}>
            {t.hero.wires.webhook}
          </text>
          <text x="240" y="252" {...stylex.props(styles.wireLabel)}>
            {t.hero.wires.api}
          </text>
          <circle r="4" {...stylex.props(styles.packet)}>
            <animateMotion dur="4s" repeatCount="indefinite" path="M226 70 H398 V260 H226" />
          </circle>
        </g>
        {partIds.map((id) => {
          const b = desk[id];
          const unknown = !parts[id].defined;
          return (
            <g key={id} {...nodeProps(id)} {...nodeStyle(id)}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                {...stylex.props(styles.rect, unknown && styles.rectUnknown)}
              />
              <g aria-hidden="true">
                <text
                  x={b.x + 14}
                  y={b.y + 22}
                  {...stylex.props(styles.code)}
                >{`${id} · ${parts[id].code}`}</text>
                {unknown ? (
                  <text x={b.x + 100} y={b.y + 40} textAnchor="middle" {...stylex.props(styles.question)}>
                    ?
                  </text>
                ) : (
                  <text x={b.x + 14} y={b.y + 54} {...stylex.props(styles.name)}>
                    {t.parts[id].short}
                  </text>
                )}
                <text x={b.x + 14} y={unknown ? b.y + 40 : b.y + 78} {...stylex.props(styles.detail)}>
                  {t.parts[id].diagramDetail}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      <svg
        viewBox="0 0 340 452"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- <svg> has no native grouping element
        role="group"
        aria-labelledby="fig1"
        {...stylex.props(styles.svg, styles.phone)}
      >
        <g aria-hidden="true">
          <path d="M132 74 V100 M132 164 V190 M132 254 V280" {...stylex.props(styles.wire)} />
          <path d="M132 344 V376" {...stylex.props(styles.stub)} />
          <path d="M300 10 V344 M294 10 H306 M294 344 H306" {...stylex.props(styles.stub, styles.dim)} />
          <text
            transform="translate(318 177) rotate(90)"
            textAnchor="middle"
            {...stylex.props(styles.wireLabel)}
          >
            {t.hero.duration}
          </text>
          <circle r="4" {...stylex.props(styles.packet)}>
            <animateMotion dur="3.2s" repeatCount="indefinite" path="M132 74 V280" />
          </circle>
        </g>
        {partIds.map((id) => {
          const b = phone[id];
          return (
            <g key={id} {...nodeProps(id)} {...nodeStyle(id)}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                {...stylex.props(styles.rect, !parts[id].defined && styles.rectUnknown)}
              />
              <g aria-hidden="true">
                <text
                  x={b.x + 12}
                  y={b.y + 20}
                  {...stylex.props(styles.code)}
                >{`${id} · ${parts[id].code}`}</text>
                <text x={b.x + 12} y={b.y + 48} {...stylex.props(styles.name)}>
                  {t.parts[id].short}
                </text>
                <text
                  x={b.x + b.w - 18}
                  y={b.y + 38}
                  textAnchor="end"
                  {...stylex.props(styles.detail, styles.arrow)}
                >
                  →
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

const draw = stylex.keyframes({ from: { strokeDashoffset: 160 } });

const styles = stylex.create({
  figure: { margin: 0 },
  cap: { display: "flex", justifyContent: "space-between", marginBottom: space.s3 },
  svg: { width: "100%", height: "auto", overflow: "visible" },
  desk: { display: { default: "block", [media.phone]: "none" } },
  phone: { display: { default: "none", [media.phone]: "block" } },
  node: { cursor: "pointer", outline: "none" },
  rect: {
    fill: {
      default: colors.surface,
      [stylex.when.ancestor('[data-on="true"]')]: colors.accent,
      [stylex.when.ancestor(":focus-visible")]: colors.accent,
      [stylex.when.ancestor(":active")]: colors.surface2,
      [media.hover]: { default: null, [stylex.when.ancestor(":hover")]: colors.accent },
    },
    stroke: {
      default: colors.ink,
      [stylex.when.ancestor(":focus-visible")]: colors.accentInk,
      [media.forcedColors]: "CanvasText",
    },
    strokeWidth: { default: 1, [stylex.when.ancestor(":focus-visible")]: 2 },
    transitionProperty: "fill",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.step,
  },
  rectUnknown: { strokeDasharray: "4 3" },
  code: {
    fontFamily: fonts.mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: type.trackLabel,
    fill: {
      default: colors.muted,
      [stylex.when.ancestor('[data-on="true"]')]: colors.onAccent,
      [stylex.when.ancestor(":focus-visible")]: colors.onAccent,
      [media.hover]: { default: null, [stylex.when.ancestor(":hover")]: colors.onAccent },
    },
  },
  name: {
    fontFamily: fonts.display,
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    fill: {
      default: colors.ink,
      [stylex.when.ancestor('[data-on="true"]')]: colors.onAccent,
      [stylex.when.ancestor(":focus-visible")]: colors.onAccent,
      [media.hover]: { default: null, [stylex.when.ancestor(":hover")]: colors.onAccent },
    },
  },
  detail: {
    fontFamily: fonts.mono,
    fontSize: "11px",
    fill: {
      default: colors.muted,
      [stylex.when.ancestor('[data-on="true"]')]: colors.onAccent,
      [stylex.when.ancestor(":focus-visible")]: colors.onAccent,
      [media.hover]: { default: null, [stylex.when.ancestor(":hover")]: colors.onAccent },
    },
  },
  arrow: { fontSize: "14px" },
  question: {
    fontFamily: fonts.display,
    fontSize: "26px",
    fontWeight: 800,
    fill: {
      default: colors.accentInk,
      [stylex.when.ancestor('[data-on="true"]')]: colors.onAccent,
      [stylex.when.ancestor(":focus-visible")]: colors.onAccent,
      [media.hover]: { default: null, [stylex.when.ancestor(":hover")]: colors.onAccent },
    },
  },
  wire: {
    stroke: colors.ink,
    strokeWidth: 1,
    fill: "none",
    strokeDasharray: 160,
    animationName: { default: draw, [media.reducedMotion]: "none" },
    animationDuration: "700ms",
    animationTimingFunction: motion.step,
    animationFillMode: "both",
  },
  wire2: { animationDelay: "250ms" },
  wire3: { animationDelay: "500ms" },
  stub: { stroke: colors.muted, strokeWidth: 1, strokeDasharray: "3 3", fill: "none" },
  dim: { strokeDasharray: "none" },
  wireLabel: {
    fontFamily: fonts.mono,
    fontSize: "9.5px",
    fontWeight: 500,
    letterSpacing: "0.06em",
    fill: colors.muted,
  },
  packet: {
    fill: colors.accent,
    stroke: colors.ink,
    strokeWidth: 0.5,
    display: { default: null, [media.reducedMotion]: "none" },
  },
});
