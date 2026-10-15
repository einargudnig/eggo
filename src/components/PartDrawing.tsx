import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import type { PartId } from "../content/parts";
import { colors } from "../design/tokens.stylex";

/**
 * One line drawing per part: 72×48 box, 4px grid, 1px stroke, exactly one 4×4 `out` square marking
 * what you get (dotted for part 05, where nobody knows yet).
 */
const Out = ({ x, y, on }: { x: number; y: number; on: boolean }) => (
  <rect x={x} y={y} width="4" height="4" {...stylex.props(styles.out, on && styles.outOn)} />
);
const Dot = ({ x, y }: { x: number; y: number }) => (
  <rect x={x} y={y} width="2" height="2" {...stylex.props(styles.dot)} />
);

const drawings: Record<PartId, (on: boolean) => ReactNode> = {
  "01": (on) => (
    <>
      <rect x="4" y="4" width="64" height="40" />
      <path d="M4 12 H68 M12 20 H44 M12 24 H36 M40 32 H60 M40 36 H60 M40 40 H52" />
      <rect x="12" y="28" width="20" height="12" />
      <Dot x={8} y={7} />
      <Dot x={12} y={7} />
      <Dot x={16} y={7} />
      <Out x={60} y={20} on={on} />
    </>
  ),
  "02": (on) => (
    <>
      <rect x="4" y="4" width="64" height="40" />
      <path d="M4 12 H68 M4 20 H68 M4 28 H68 M4 36 H68 M24 4 V44 M48 4 V44" />
      <path d="M4 13 H68" />
      <Out x={56} y={22} on={on} />
    </>
  ),
  "03": (on) => (
    <>
      <rect x="4" y="16" width="12" height="8" />
      <path d="M4 16 L10 21 L16 16 M16 20 H24 M48 24 H56" />
      <rect x="24" y="12" width="24" height="24" />
      <path d="M36 12 V4 H44" strokeDasharray="2 2" />
      <rect x="56" y="18" width="12" height="12" />
      <path d="M59 24 L61 26 L65 21" />
      <Out x={34} y={22} on={on} />
    </>
  ),
  "04": (on) => (
    <>
      <rect x="4" y="12" width="20" height="24" />
      <rect x="48" y="12" width="20" height="24" />
      <path d="M24 20 H30 M24 28 H30 M44 24 H48" />
      <rect x="30" y="16" width="6" height="16" />
      <rect x="38" y="16" width="6" height="16" />
      <Out x={56} y={22} on={on} />
    </>
  ),
  "05": () => (
    <>
      <rect x="4" y="4" width="64" height="40" strokeDasharray="4 4" />
      <path d="M32 18 A4 4 0 1 1 37 22 Q36 23 36 26" />
      <Dot x={35} y={30} />
      <rect x="60" y="36" width="4" height="4" {...stylex.props(styles.outUnknown)} />
    </>
  ),
};

export function PartDrawing({ id, on }: { id: PartId; on: boolean }) {
  return (
    <svg
      viewBox="0 0 72 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      {...stylex.props(styles.svg)}
    >
      {drawings[id](on)}
    </svg>
  );
}

const styles = stylex.create({
  svg: { display: "block", width: "72px", height: "48px", color: colors.muted, shapeRendering: "crispEdges" },
  dot: { fill: "currentColor", stroke: "none" },
  out: { fill: colors.accent, stroke: "none" },
  outOn: { fill: colors.ink },
  outUnknown: { fill: "none", stroke: colors.accent, strokeDasharray: "1 1" },
});
