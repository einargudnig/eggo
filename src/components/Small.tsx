import * as stylex from "@stylexjs/stylex";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";

/** "Ekkert er of lítið.": small fixes as supplementary plates, so nobody thinks their problem is too minor to ask about. */
export function Small() {
  const { t } = useLang();
  return (
    <section id="smatt" aria-labelledby="h-small" tabIndex={-1} {...stylex.props(ui.anchor, ui.section)}>
      <div {...stylex.props(ui.wrap)}>
        <div {...stylex.props(styles.head)}>
          <h2 id="h-small" {...stylex.props(ui.h2)}>
            {t.small.title}
          </h2>
          <p {...stylex.props(styles.body)}>{t.small.body}</p>
        </div>
        <ul {...stylex.props(styles.grid)}>
          {t.small.items.map((item) => (
            <li key={item} {...stylex.props(ui.subPlate, styles.item)}>
              {item}
            </li>
          ))}
        </ul>
        <p {...stylex.props(styles.note)}>{t.small.note}</p>
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
  grid: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(3, minmax(0, 1fr))",
      [media.tablet]: "repeat(2, minmax(0, 1fr))",
      [media.phone]: "minmax(0, 1fr)",
    },
    gap: space.s4,
  },
  item: {
    paddingBlock: space.s5,
    paddingInline: space.s5,
    fontFamily: fonts.sign,
    fontWeight: 700,
    fontSize: "19px",
    lineHeight: 1.3,
    textWrap: "pretty",
  },
  note: { marginTop: space.s5, marginBottom: 0, color: colors.muted, fontSize: type.small },
});
