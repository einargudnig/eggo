import * as stylex from "@stylexjs/stylex";
import { partIds, type PartId } from "../content/parts";
import { isk, priceFrom } from "../content/pricing";
import { troubleIds, type TroubleId } from "../content/work";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, motion, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { ButtonLink } from "./Button";
import { Junction } from "./Junction";

type Props = {
  picked: readonly TroubleId[];
  /** Parts that fix the picked symptoms, in part order. */
  route: readonly PartId[];
  onToggle: (id: TroubleId) => void;
  onSend: () => void;
};

/** The hero: what, and "where are you?" — tick symptoms, the sign lights the way and the summary prices it. */
export function Hero({ picked, route, onToggle, onSend }: Props) {
  const { t } = useLang();
  const first = picked[0];
  const here =
    picked.length === 0
      ? t.junction.nowhere
      : picked.length === 1 && first
        ? t.trouble.rows[first].here
        : t.junction.many.replace("{n}", String(picked.length));

  return (
    <div {...stylex.props(ui.wrap, styles.hero)}>
      <div {...stylex.props(styles.intro)}>
        <h1 {...stylex.props(styles.title)}>
          {t.hero.titleStart}
          {t.hero.titleEm}
        </h1>
        <p {...stylex.props(styles.lead)}>{t.hero.lead}</p>
      </div>

      <fieldset {...stylex.props(styles.ask)}>
        <legend {...stylex.props(styles.legend)}>{t.ask.legend}</legend>
        <p {...stylex.props(styles.hint)}>{t.ask.hint}</p>
        <ul {...stylex.props(styles.list)}>
          {troubleIds.map((id) => (
            <li key={id} {...stylex.props(styles.item)}>
              <label {...stylex.props(styles.row, stylex.defaultMarker())}>
                <input
                  type="checkbox"
                  checked={picked.includes(id)}
                  onChange={() => onToggle(id)}
                  {...stylex.props(ui.srOnly, stylex.defaultMarker())}
                />
                <Triangle on={picked.includes(id)} />
                <span {...stylex.props(styles.symptom)}>
                  {t.trouble.quote.open}
                  {t.trouble.rows[id].symptom}
                  {t.trouble.quote.close}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <div {...stylex.props(styles.side)}>
        <Junction lit={route} here={here} />
        <Trip route={route} onSend={onSend} />
      </div>
    </div>
  );
}

/** The checkbox, drawn as a warning sign: an outline until ticked, then yellow with a red edge. */
function Triangle({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 40 36" aria-hidden="true" {...stylex.props(styles.tri)}>
      <path d="M20 3 37 33H3z" {...stylex.props(styles.edge, on && styles.edgeOn)} />
      <path
        d="M18.4 12h3.2l-.5 10h-2.2zM20 24.6a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6z"
        {...stylex.props(styles.mark, on && styles.markOn)}
      />
    </svg>
  );
}

/** The route summary under the sign: one leg per part, with time and starting price. */
function Trip({ route, onSend }: { route: readonly PartId[]; onSend: () => void }) {
  const { lang, t } = useLang();
  const unknown = route.includes("05");
  const builds = route.filter((id) => id !== "05");
  const note = unknown ? t.trip.noteUnknown : builds.length > 1 ? t.trip.noteMany : null;

  return (
    <section aria-labelledby="h-trip" {...stylex.props(styles.trip)}>
      <h2 id="h-trip" {...stylex.props(styles.tripTitle)}>
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
                <li key={id} {...stylex.props(styles.leg)}>
                  <b {...stylex.props(styles.legName)}>{id === "05" ? t.trip.mapping : t.parts[id].sign}</b>
                  <span {...stylex.props(styles.legTime)}>{t.parts[id].time}</span>
                  <span {...stylex.props(styles.legPrice, ui.tabular)}>
                    {id === "05" ? isk(lang, priceFrom[id]) : `${t.trip.from} ${isk(lang, priceFrom[id])}`}
                  </span>
                </li>
              ))}
          </ul>
        )}
        {note ? <p {...stylex.props(styles.note)}>{note}</p> : null}
        {route.length > 0 ? <p {...stylex.props(styles.priceNote)}>{t.trip.priceNote}</p> : null}
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

const styles = stylex.create({
  hero: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1fr) minmax(0, 1.02fr)", [media.tablet]: "minmax(0, 1fr)" },
    gridTemplateAreas: { default: '"intro side" "ask side"', [media.tablet]: '"intro" "ask" "side"' },
    columnGap: space.s8,
    alignItems: "start",
    paddingTop: { default: space.s8, [media.phone]: space.s5 },
    paddingBottom: { default: space.s10, [media.phone]: space.s8 },
  },
  intro: { gridArea: "intro" },
  title: {
    margin: 0,
    fontFamily: fonts.sign,
    fontSize: type.display,
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: type.trackDisplay,
    textWrap: "balance",
  },
  lead: {
    marginTop: space.s5,
    marginBottom: 0,
    fontSize: type.lead,
    color: colors.muted,
    maxWidth: "30em",
    textWrap: "pretty",
  },
  ask: {
    gridArea: "ask",
    borderWidth: 0,
    padding: 0,
    marginTop: { default: space.s7, [media.phone]: space.s6 },
    marginInline: 0,
    minWidth: 0,
  },
  legend: {
    padding: 0,
    fontFamily: fonts.sign,
    fontSize: type.h3,
    fontWeight: 800,
    lineHeight: 1.1,
  },
  hint: { marginTop: space.s2, marginBottom: space.s3, fontSize: type.small, color: colors.muted },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
  item: { borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: colors.line },
  row: {
    display: "grid",
    gridTemplateColumns: "40px minmax(0, 1fr)",
    gap: space.s4,
    alignItems: "center",
    paddingBlock: space.s3,
    paddingInline: space.s1,
    cursor: "pointer",
  },
  symptom: { fontFamily: fonts.sign, fontWeight: 700, fontSize: "19px", lineHeight: 1.3 },
  tri: {
    width: "36px",
    height: "32px",
    borderRadius: "4px",
    outlineWidth: "3px",
    outlineStyle: { default: "none", [stylex.when.siblingBefore(":focus-visible")]: "solid" },
    outlineColor: colors.link,
    outlineOffset: "4px",
  },
  edge: {
    fill: "none",
    stroke: {
      default: colors.muted,
      [media.hover]: { default: null, [stylex.when.ancestor(":hover")]: colors.ink },
    },
    strokeWidth: 2.5,
    strokeLinejoin: "round",
    transitionProperty: "fill, stroke",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.step,
  },
  edgeOn: { fill: colors.warn, stroke: colors.warnEdge, strokeWidth: 4 },
  mark: { fill: colors.muted, transitionProperty: "fill", transitionDuration: motion.fast },
  markOn: { fill: colors.warnInk },
  side: { gridArea: "side", marginTop: { default: 0, [media.tablet]: space.s7 } },
  trip: {
    marginTop: space.s3,
    backgroundColor: colors.page2,
    borderRadius: "16px",
    paddingBlock: space.s5,
    paddingInline: { default: space.s6, [media.phone]: space.s4 },
  },
  tripTitle: { margin: 0, fontFamily: fonts.sign, fontSize: "22px", fontWeight: 800 },
  empty: { marginTop: space.s2, marginBottom: 0, color: colors.muted, fontSize: type.small },
  legs: { listStyle: "none", marginTop: space.s3, marginBottom: 0, padding: 0 },
  leg: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    columnGap: space.s4,
    rowGap: space.s1,
    paddingBlock: space.s3,
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
  legName: { fontFamily: fonts.sign, fontWeight: 800, fontSize: "19px", lineHeight: 1.2 },
  legTime: { gridColumn: 1, color: colors.muted, fontSize: type.fine },
  legPrice: {
    gridColumn: 2,
    gridRow: 1,
    fontFamily: fonts.sign,
    fontWeight: 700,
    fontSize: "18px",
    textAlign: "right",
    whiteSpace: "nowrap",
  },
  note: { marginTop: space.s3, marginBottom: 0, color: colors.muted, fontSize: type.fine },
  priceNote: {
    marginTop: space.s3,
    marginBottom: 0,
    fontFamily: fonts.sign,
    fontWeight: 700,
    fontSize: type.fine,
  },
  go: {
    marginTop: space.s5,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: space.s4,
  },
  reply: { color: colors.muted, fontSize: type.fine },
});
