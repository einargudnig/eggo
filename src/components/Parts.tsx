import * as stylex from "@stylexjs/stylex";
import { partDomId, partIds, parts, type PartId } from "../content/parts";
import { isk, priceFrom } from "../content/pricing";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, space, type } from "../design/tokens.stylex";
import { PartDrawing } from "./PartDrawing";
import { useLang } from "../i18n/useLang";
import { SectionHead } from "./SectionHead";

/** What Eggó builds: one row per part with time and starting price, then the plain terms. */
export function Parts({ lit }: { lit: readonly PartId[] }) {
  const { lang, t } = useLang();
  return (
    <section id="smidi" aria-labelledby="h-parts" tabIndex={-1} {...stylex.props(ui.anchor, ui.section)}>
      <div {...stylex.props(ui.wrap)}>
        <SectionHead headingId="h-parts" title={t.partsSection.title}>
          {t.partsSection.body}
        </SectionHead>
        <ul {...stylex.props(styles.list)}>
          {partIds.map((id) => {
            const part = t.parts[id];
            return (
              <li key={id} id={partDomId(id)} tabIndex={-1} {...stylex.props(styles.row, ui.anchor)}>
                <div {...stylex.props(styles.id)}>
                  <PartDrawing id={id} on={lit.includes(id)} />
                  <h3 {...stylex.props(styles.name)}>{part.name}</h3>
                </div>
                <div {...stylex.props(styles.text)}>
                  <p {...stylex.props(styles.lead)}>{part.lead}</p>
                  <p {...stylex.props(styles.owns)}>{part.owns}</p>
                </div>
                <p {...stylex.props(styles.dist, ui.tabular)}>
                  <span>{part.time}</span>
                  <span {...stylex.props(styles.price)}>
                    {parts[id].defined
                      ? `${t.trip.from} ${isk(lang, priceFrom[id])}`
                      : isk(lang, priceFrom[id])}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
        <p {...stylex.props(ui.card, styles.deal)}>{t.partsSection.deal}</p>
        <p {...stylex.props(styles.note)}>{t.partsSection.note}</p>
      </div>
    </section>
  );
}

const styles = stylex.create({
  list: { listStyle: "none", margin: 0, padding: 0 },
  row: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1.1fr) minmax(0, 1.6fr) minmax(0, 0.6fr)",
      [media.phone]: "minmax(0, 1fr)",
    },
    gap: { default: space.s6, [media.phone]: space.s2 },
    alignItems: { default: "center", [media.phone]: "start" },
    paddingBlock: { default: space.s6, [media.phone]: space.s5 },
  },
  id: { display: "flex", alignItems: "center", gap: space.s4 },
  name: {
    margin: 0,
    fontSize: type.h3,
    fontWeight: 600,
    letterSpacing: type.trackHead,
  },
  text: { minWidth: 0 },
  lead: { margin: 0, textWrap: "pretty", maxWidth: "34em" },
  owns: { marginTop: space.s2, marginBottom: 0, fontSize: type.small, color: colors.muted },
  dist: {
    margin: 0,
    display: "grid",
    gap: space.s1,
    justifyItems: { default: "end", [media.phone]: "start" },
    fontWeight: 600,
  },
  price: { fontWeight: 400, color: colors.muted, fontSize: type.small, whiteSpace: "nowrap" },
  deal: {
    marginTop: space.s5,
    marginBottom: 0,
    paddingBlock: space.s5,
    paddingInline: { default: space.s6, [media.phone]: space.s5 },
    fontSize: type.lead,
    fontWeight: 500,
    lineHeight: 1.45,
    textWrap: "pretty",
  },
  note: { marginTop: space.s4, marginBottom: 0, color: colors.muted, fontSize: type.small, maxWidth: "46em" },
});
