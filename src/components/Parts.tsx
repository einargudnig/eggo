import * as stylex from "@stylexjs/stylex";
import { partDomId, partIds, parts } from "../content/parts";
import { isk, priceFrom } from "../content/pricing";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { SignArrow } from "./SignArrow";

/** "Hvert viltu komast?": the five parts as one stacked direction sign. Distance is build time. */
export function Parts() {
  const { lang, t } = useLang();
  return (
    <section
      id="smidi"
      aria-labelledby="h-parts"
      tabIndex={-1}
      {...stylex.props(ui.anchor, ui.section, ui.band)}
    >
      <div {...stylex.props(ui.wrap)}>
        <div {...stylex.props(styles.head)}>
          <h2 id="h-parts" {...stylex.props(ui.h2)}>
            {t.partsSection.title}
          </h2>
          <p {...stylex.props(styles.body)}>{t.partsSection.body}</p>
        </div>
        <div {...stylex.props(ui.plate)}>
          <ul {...stylex.props(ui.plateIn, styles.list)}>
            {partIds.map((id) => {
              const part = t.parts[id];
              const gravel = !parts[id].defined;
              return (
                <li
                  key={id}
                  id={partDomId(id)}
                  tabIndex={-1}
                  {...stylex.props(styles.row, ui.anchor, gravel && styles.gravel, stylex.defaultMarker())}
                >
                  <SignArrow part={id} size="sign" nudge />
                  <div {...stylex.props(styles.text)}>
                    <h3 {...stylex.props(styles.name)}>{part.sign}</h3>
                    <p {...stylex.props(styles.lead)}>{part.lead}</p>
                    <p {...stylex.props(styles.owns)}>{part.owns}</p>
                  </div>
                  <p {...stylex.props(styles.dist)}>
                    <b {...stylex.props(styles.time)}>{part.time}</b>
                    <span {...stylex.props(styles.price, ui.tabular)}>
                      {parts[id].defined
                        ? `${t.trip.from} ${isk(lang, priceFrom[id])}`
                        : isk(lang, priceFrom[id])}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
        <p {...stylex.props(styles.note)}>{t.partsSection.note}</p>
      </div>
    </section>
  );
}

const styles = stylex.create({
  head: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1fr) minmax(0, 1.4fr)", [media.tablet]: "minmax(0, 1fr)" },
    gap: { default: space.s8, [media.tablet]: space.s3 },
    alignItems: "end",
    marginBottom: space.s7,
  },
  body: { margin: 0, color: colors.muted, maxWidth: "34em", textWrap: "pretty" },
  list: { listStyle: "none", margin: 0, padding: 0 },
  row: {
    display: "grid",
    gridTemplateColumns: { default: "64px minmax(0, 1fr) auto", [media.phone]: "34px minmax(0, 1fr)" },
    columnGap: { default: space.s5, [media.phone]: space.s3 },
    rowGap: space.s2,
    alignItems: { default: "center", [media.phone]: "start" },
    paddingBlock: { default: space.s6, [media.phone]: space.s5 },
    paddingInline: { default: space.s6, [media.phone]: space.s4 },
    borderTopWidth: { default: layout.signBorder, ":first-child": 0 },
    borderTopStyle: "solid",
    borderTopColor: colors.signInk,
    backgroundColor: { default: null, ":focus": colors.signHighlight },
    transitionProperty: "background-color",
    transitionDuration: "1.2s",
  },
  /** "Veit ekki enn" has no road yet: its divider is a dashed gravel line. */
  gravel: {
    borderTopWidth: 0,
    backgroundImage: `repeating-linear-gradient(90deg, ${colors.signInk} 0 14px, transparent 14px 24px)`,
    backgroundSize: "100% 3px",
    backgroundRepeat: "no-repeat",
  },
  text: { minWidth: 0 },
  name: { margin: 0, fontFamily: fonts.sign, fontSize: type.signName, fontWeight: 800, lineHeight: 1.05 },
  lead: { marginTop: space.s2, marginBottom: 0, fontSize: "17px", color: colors.signSoft, maxWidth: "36em" },
  owns: { marginTop: space.s2, marginBottom: 0, fontSize: type.fine },
  dist: {
    margin: 0,
    gridColumn: { default: "auto", [media.phone]: "2" },
    display: { default: "block", [media.phone]: "flex" },
    alignItems: "baseline",
    gap: space.s3,
    textAlign: { default: "right", [media.phone]: "left" },
    fontFamily: fonts.sign,
  },
  time: {
    display: "block",
    fontSize: { default: "clamp(26px, 2.6vw, 34px)", [media.phone]: "24px" },
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  price: {
    display: "block",
    marginTop: { default: space.s1, [media.phone]: 0 },
    fontSize: type.small,
    color: colors.signSoft,
    whiteSpace: "nowrap",
  },
  note: { marginTop: space.s5, marginBottom: 0, color: colors.muted, fontSize: type.small, maxWidth: "46em" },
});
