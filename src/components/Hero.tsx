import * as stylex from "@stylexjs/stylex";
import { partIds, parts, type PartId } from "../content/parts";
import { isk, priceFrom } from "../content/pricing";
import { troubleIds, troubles, type TroubleId } from "../content/work";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, motion, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { ButtonLink } from "./Button";

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
      <div>
        <h1 {...stylex.props(styles.title)}>
          {t.hero.titleStart}
          {t.hero.titleEm}
        </h1>
        <p {...stylex.props(styles.lead)}>{t.hero.lead}</p>
      </div>

      <div {...stylex.props(styles.tool)}>
        <fieldset {...stylex.props(styles.ask)}>
          <legend {...stylex.props(styles.legend)}>{t.ask.legend}</legend>
          <p {...stylex.props(styles.hint)}>{t.ask.hint}</p>
          <ul {...stylex.props(styles.list)}>
            {troubleIds.map((id) => (
              <li key={id}>
                <label {...stylex.props(styles.row)}>
                  <input
                    type="checkbox"
                    checked={picked.includes(id)}
                    onChange={() => onToggle(id)}
                    {...stylex.props(styles.box)}
                  />
                  <span>
                    {t.trouble.quote.open}
                    {t.trouble.rows[id].symptom}
                    {t.trouble.quote.close}
                  </span>
                  <span aria-hidden="true" {...stylex.props(ui.label, styles.code)}>
                    {`→ ${troubles[id]} · ${parts[troubles[id]].code}`}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        <Summary route={route} onSend={onSend} />
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
    <section aria-labelledby="h-trip" {...stylex.props(ui.card, styles.summary)}>
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
                <li key={id} {...stylex.props(styles.leg)}>
                  <b {...stylex.props(styles.legName)}>
                    <span aria-hidden="true" {...stylex.props(ui.label, styles.legCode)}>
                      {`${id} · ${parts[id].code}`}
                    </span>
                    {id === "05" ? t.trip.mapping : t.parts[id].sign}
                  </b>
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
    paddingTop: { default: space.s9, [media.phone]: space.s7 },
    paddingBottom: { default: space.s9, [media.phone]: space.s8 },
  },
  title: {
    margin: 0,
    fontFamily: fonts.text,
    fontSize: type.display,
    fontWeight: 600,
    lineHeight: 1.04,
    letterSpacing: type.trackDisplay,
    textWrap: "balance",
    maxWidth: "13em",
  },
  lead: {
    marginTop: space.s5,
    marginBottom: 0,
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
  box: {
    appearance: { default: "none", [media.forcedColors]: "auto" },
    width: "20px",
    height: "20px",
    marginTop: space.s0,
    marginInline: 0,
    marginBottom: 0,
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: { default: colors.control, ":checked": colors.accent },
    borderRadius: "5px",
    backgroundColor: { default: colors.page, ":checked": colors.accent },
    backgroundImage: {
      default: "none",
      ":checked":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5 10.5l3.2 3L15 6.5' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
    },
    cursor: "pointer",
    outline: { default: "none", ":focus-visible": `2px solid ${colors.accent}` },
    outlineOffset: "3px",
    transitionProperty: "background-color, border-color",
    transitionDuration: motion.fast,
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
    paddingBlock: space.s3,
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
  legName: { fontWeight: 600 },
  legCode: { display: "block", marginBottom: space.s1 },
  legTime: { gridColumn: 1, color: colors.muted, fontSize: type.small },
  legPrice: { gridColumn: 2, gridRow: 1, fontWeight: 600, textAlign: "right", whiteSpace: "nowrap" },
  note: { marginTop: space.s3, marginBottom: 0, color: colors.muted, fontSize: type.small },
  priceNote: { marginTop: space.s3, marginBottom: 0, fontSize: type.small, fontWeight: 600 },
  go: { marginTop: space.s5, display: "flex", flexWrap: "wrap", alignItems: "center", gap: space.s4 },
  reply: { color: colors.muted, fontSize: type.fine },
});
