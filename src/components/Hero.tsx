import * as stylex from "@stylexjs/stylex";
import { partIds, type PartId } from "../content/parts";
import { isk, priceFrom } from "../content/pricing";
import { troubleIds, troubles, type TroubleId } from "../content/work";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, motion, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { BuildFigure } from "./BuildFigure";
import { ButtonLink } from "./Button";
import { PhoneBar } from "./PhoneBar";

type Props = {
  picked: readonly TroubleId[];
  /** Parts that fix the picked symptoms, in part order. */
  route: readonly PartId[];
  onToggle: (id: TroubleId) => void;
  onSend: () => void;
};

/** The hero: what, then "what sounds familiar?" — tick symptoms and the summary says what to build and what it costs. */
export function Hero({ picked, route, onToggle, onSend }: Props) {
  const { t } = useLang();
  return (
    <div {...stylex.props(ui.wrap, styles.hero)}>
      <h1 {...stylex.props(styles.title)}>
        {t.hero.titleStart}
        {t.hero.titleEm}
      </h1>
      <div {...stylex.props(styles.top)}>
        <p {...stylex.props(styles.lead)}>{t.hero.lead}</p>
        <BuildFigure lit={route} />
      </div>

      <div {...stylex.props(styles.tool)}>
        <fieldset {...stylex.props(styles.ask)}>
          <legend {...stylex.props(styles.legend)}>{t.ask.legend}</legend>
          <p {...stylex.props(styles.hint)}>{t.ask.hint}</p>
          <ul {...stylex.props(styles.list)}>
            {troubleIds.map((id) => (
              <li key={id}>
                <label {...stylex.props(styles.row)}>
                  <span {...stylex.props(styles.boxWrap)}>
                    <input
                      type="checkbox"
                      checked={picked.includes(id)}
                      onChange={() => onToggle(id)}
                      {...stylex.props(styles.box, stylex.defaultMarker())}
                    />
                    <svg viewBox="0 0 20 20" aria-hidden="true" {...stylex.props(styles.tick)}>
                      <path d="M5 10.5l3.2 3L15 6.5" {...stylex.props(styles.tickPath)} />
                    </svg>
                  </span>
                  <span>
                    {t.trouble.quote.open}
                    {t.trouble.rows[id].symptom}
                    {t.trouble.quote.close}
                  </span>
                  <span
                    aria-hidden="true"
                    {...stylex.props(ui.label, styles.code, picked.includes(id) && ui.labelStrong)}
                  >
                    {`→ ${t.parts[troubles[id]].short}`}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        <Summary route={route} onSend={onSend} />
        <PhoneBar route={route} onSend={onSend} />
      </div>
    </div>
  );
}

/** What the ticked symptoms add up to: one line per part, with time and starting price. */
function Summary({ route, onSend }: { route: readonly PartId[]; onSend: () => void }) {
  const { lang, t } = useLang();
  const unknown = route.includes("05");
  const builds = route.filter((id) => id !== "05");
  const note = unknown ? t.trip.noteUnknown : builds.length > 1 ? t.trip.noteMany : null;

  return (
    <section id="tillaga" aria-labelledby="h-trip" {...stylex.props(ui.card, ui.anchor, styles.summary)}>
      <h2 id="h-trip" {...stylex.props(styles.summaryTitle)}>
        {t.trip.title}
      </h2>
      <div aria-live="polite">
        {route.length === 0 ? (
          <p {...stylex.props(styles.empty)}>{t.trip.empty}</p>
        ) : (
          <ul {...stylex.props(styles.legs)}>
            {partIds
              .filter((id) => route.includes(id))
              .map((id) => (
                <li key={id} {...stylex.props(styles.leg, styles.enter)}>
                  <b {...stylex.props(styles.legName)}>{id === "05" ? t.trip.mapping : t.parts[id].sign}</b>
                  <span {...stylex.props(styles.legTime)}>{t.parts[id].time}</span>
                  <span {...stylex.props(styles.legPrice, ui.tabular)}>
                    {id === "05" ? isk(lang, priceFrom[id]) : `${t.trip.from} ${isk(lang, priceFrom[id])}`}
                  </span>
                </li>
              ))}
          </ul>
        )}
        {note ? (
          <p key={note} {...stylex.props(styles.note, styles.enter)}>
            {note}
          </p>
        ) : null}
        {route.length > 0 ? (
          <p {...stylex.props(styles.priceNote, styles.enter)}>{t.trip.priceNote}</p>
        ) : null}
      </div>
      <div {...stylex.props(styles.go)}>
        <ButtonLink
          href="#samband"
          onClick={(e) => {
            e.preventDefault();
            onSend();
          }}
        >
          {t.trip.send}
        </ButtonLink>
        <small {...stylex.props(styles.reply)}>{t.trip.reply}</small>
      </div>
    </section>
  );
}

/** A new line in the summary unrolls from its top edge, so the eye catches what the tick added. */
const unroll = stylex.keyframes({
  from: { opacity: 0, transform: "translateY(-6px)", clipPath: "inset(0 0 100% 0)" },
  to: { opacity: 1, transform: "none", clipPath: "inset(0 0 0 0)" },
});

const draw = stylex.keyframes({ from: { strokeDashoffset: 16 }, to: { strokeDashoffset: 0 } });

const styles = stylex.create({
  hero: {
    paddingTop: { default: space.s9, [media.phone]: space.s7 },
    paddingBottom: { default: space.s9, [media.phone]: space.s8 },
  },
  top: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1fr) minmax(0, 1fr)", [media.tablet]: "minmax(0, 1fr)" },
    gap: { default: space.s8, [media.tablet]: space.s7 },
    alignItems: "start",
    marginTop: { default: space.s7, [media.phone]: space.s5 },
  },
  title: {
    margin: 0,
    fontFamily: fonts.text,
    fontSize: type.display,
    fontWeight: 600,
    lineHeight: 1.04,
    letterSpacing: type.trackDisplay,
    textWrap: "balance",
    maxWidth: "12em",
  },
  lead: {
    margin: 0,
    fontSize: type.lead,
    color: colors.muted,
    maxWidth: "30em",
    textWrap: "pretty",
  },
  tool: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1.1fr) minmax(0, 0.9fr)", [media.tablet]: "minmax(0, 1fr)" },
    gap: { default: space.s8, [media.tablet]: space.s6 },
    alignItems: "start",
    marginTop: { default: space.s8, [media.phone]: space.s7 },
  },
  ask: { borderWidth: 0, padding: 0, margin: 0, minWidth: 0 },
  legend: { padding: 0, fontSize: type.h3, fontWeight: 600, letterSpacing: type.trackHead },
  hint: { marginTop: space.s1, marginBottom: space.s4, fontSize: type.small, color: colors.muted },
  list: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: space.s1 },
  row: {
    display: "grid",
    gridTemplateColumns: { default: "20px minmax(0, 1fr) auto", [media.phone]: "20px minmax(0, 1fr)" },
    gap: space.s4,
    alignItems: "start",
    paddingBlock: space.s3,
    paddingInline: space.s3,
    marginInline: `calc(-1 * ${space.s3})`,
    borderRadius: layout.control,
    cursor: "pointer",
    backgroundColor: { default: null, [media.hover]: { default: null, ":hover": colors.page2 } },
    transitionProperty: "background-color",
    transitionDuration: motion.fast,
  },
  /** Native checkbox, restyled: a square that fills with the accent and shows a white tick. */
  boxWrap: { position: "relative", width: "20px", height: "20px", marginTop: space.s0 },
  box: {
    appearance: { default: "none", [media.forcedColors]: "auto" },
    display: "block",
    width: "20px",
    height: "20px",
    margin: 0,
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: { default: colors.control, ":checked": colors.accent },
    borderRadius: "5px",
    backgroundColor: { default: colors.page, ":checked": colors.accent },
    cursor: "pointer",
    outline: { default: "none", ":focus-visible": `2px solid ${colors.accent}` },
    outlineOffset: "3px",
    transitionProperty: "background-color, border-color",
    transitionDuration: motion.fast,
  },
  /** The tick is drawn in accent ink on top of the box, so it stays legible on the light dark-mode accent. */
  tick: {
    position: "absolute",
    inset: 0,
    width: "20px",
    height: "20px",
    pointerEvents: "none",
    display: {
      default: "none",
      [stylex.when.siblingBefore(":checked")]: "block",
      [media.forcedColors]: "none",
    },
  },
  tickPath: {
    fill: "none",
    stroke: colors.accentInk,
    strokeWidth: 2.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeDasharray: 16,
    animationName: draw,
    animationDuration: "180ms",
    animationTimingFunction: motion.ease,
    animationFillMode: "both",
  },
  enter: {
    animationName: unroll,
    animationDuration: "320ms",
    animationTimingFunction: motion.ease,
    animationFillMode: "both",
  },
  code: { alignSelf: "center", whiteSpace: "nowrap", display: { default: "block", [media.phone]: "none" } },
  summary: {
    position: { default: "sticky", [media.tablet]: "static" },
    top: space.s5,
    paddingBlock: space.s6,
    paddingInline: { default: space.s6, [media.phone]: space.s5 },
  },
  summaryTitle: { margin: 0, fontSize: type.h3, fontWeight: 600, letterSpacing: type.trackHead },
  empty: { marginTop: space.s2, marginBottom: 0, color: colors.muted, fontSize: type.small },
  legs: { listStyle: "none", marginTop: space.s4, marginBottom: 0, padding: 0 },
  leg: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    columnGap: space.s4,
    paddingBlock: space.s2,
  },
  legName: { fontWeight: 600 },
  legTime: { gridColumn: 1, color: colors.muted, fontSize: type.small },
  legPrice: { gridColumn: 2, gridRow: 1, fontWeight: 600, textAlign: "right", whiteSpace: "nowrap" },
  note: { marginTop: space.s3, marginBottom: 0, color: colors.muted, fontSize: type.small },
  priceNote: { marginTop: space.s3, marginBottom: 0, fontSize: type.small, fontWeight: 600 },
  go: { marginTop: space.s5, display: "flex", flexWrap: "wrap", alignItems: "center", gap: space.s4 },
  reply: { color: colors.muted, fontSize: type.small },
});
