import * as stylex from "@stylexjs/stylex";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, space } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";

/** Where each handwritten note sits in the "before" box. Visual only, so it lives with the drawing. */
const notePlacement = [
  { top: "2px", left: "4px", rotate: "-4deg" },
  { top: "28px", left: "38%", rotate: "3deg" },
  { top: "52px", left: "2px", rotate: "2deg" },
  { top: "76px", left: "44%", rotate: "-3deg" },
] as const;

/** Part 05's panel: a vague problem → a map → one of the parts (or nothing). */
export function MapFlow() {
  const { t } = useLang();
  const m = t.mapflow;
  return (
    <div
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a labelled group of three panels; fieldset would imply a form (ACCESSIBILITY.md #16)
      role="group"
      aria-label={m.label}
      {...stylex.props(styles.flow)}
    >
      <div {...stylex.props(styles.box, styles.mess)}>
        <span {...stylex.props(ui.label)}>{m.before}</span>
        <div aria-hidden="true" {...stylex.props(styles.notes)}>
          {m.notes.map((note, i) => {
            const at = notePlacement[i];
            return at ? (
              <span key={note} {...stylex.props(styles.note(at.top, at.left, at.rotate))}>
                {note}
              </span>
            ) : null;
          })}
        </div>
      </div>
      <div aria-hidden="true" {...stylex.props(styles.arrow)}>
        →
      </div>
      <div {...stylex.props(styles.box)}>
        <span {...stylex.props(ui.label)}>{m.map}</span>
        <svg
          viewBox="0 0 120 112"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          aria-hidden="true"
          {...stylex.props(styles.svg)}
        >
          <rect x="4" y="8" width="34" height="18" />
          <rect x="82" y="8" width="34" height="18" />
          <rect x="43" y="48" width="34" height="18" />
          <rect x="4" y="88" width="34" height="18" />
          <rect x="82" y="88" width="34" height="18" />
          <path d="M38 17 H82 M21 26 V48 H43 M99 26 V48 H77 M60 66 V78 H21 V88 M60 78 H99 V88" />
          <circle cx="60" cy="57" r="3" fill="currentColor" />
        </svg>
      </div>
      <div aria-hidden="true" {...stylex.props(styles.arrow)}>
        →
      </div>
      <div {...stylex.props(styles.box)}>
        <span {...stylex.props(ui.label)}>{m.after}</span>
        <ul {...stylex.props(styles.list)}>
          {m.outcomes.map((o) => (
            <li key={o.mark} {...stylex.props(styles.item)}>
              <b {...stylex.props(styles.mark, o.isNew && styles.markNew)}>{o.mark}</b>
              <span>{o.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = stylex.create({
  flow: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1.1fr) 28px minmax(0, 1fr) 28px minmax(0, 1.1fr)",
      [media.tablet]: "1fr",
    },
    alignItems: "stretch",
    alignSelf: "center",
  },
  box: {
    display: "grid",
    gap: space.s3,
    alignContent: "start",
    minWidth: 0,
    padding: space.s3,
    backgroundColor: colors.surface,
    borderWidth: layout.rule,
    borderStyle: "solid",
    borderColor: colors.ink,
  },
  mess: { borderStyle: "dashed" },
  notes: {
    position: "relative",
    height: { default: "112px", [media.phone]: "96px" },
    fontFamily: fonts.hand,
    fontSize: "22px",
    lineHeight: 1,
    color: colors.ink,
  },
  note: (top: string, left: string, rotate: string) => ({
    position: "absolute",
    whiteSpace: "nowrap",
    top,
    left,
    transform: `rotate(${rotate})`,
  }),
  svg: { display: "block", width: "100%", height: "112px", color: colors.ink },
  arrow: {
    display: "grid",
    placeItems: "center",
    fontFamily: fonts.mono,
    fontSize: "18px",
    color: colors.muted,
    transform: { default: null, [media.tablet]: "rotate(90deg)" },
    height: { default: null, [media.tablet]: "24px" },
  },
  list: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: space.s2 },
  item: {
    display: "flex",
    gap: space.s2,
    alignItems: "baseline",
    fontFamily: fonts.mono,
    fontSize: "12px",
    fontWeight: 500,
  },
  mark: {
    fontSize: "10px",
    paddingBlock: 0,
    paddingInline: space.s1,
    borderWidth: layout.rule,
    borderStyle: "solid",
    borderColor: colors.ink,
  },
  markNew: { borderStyle: "dashed", borderColor: colors.accentInk, color: colors.accentInk },
});
