import * as stylex from "@stylexjs/stylex";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";

/** "Ekkert er of lítið.": small example fixes, so nobody thinks their problem is too minor to ask about. */
export function Small() {
  const { t } = useLang();
  return (
    <section
      id="smatt"
      aria-labelledby="h-small"
      tabIndex={-1}
      {...stylex.props(ui.anchor, ui.section, styles.section)}
    >
      <div {...stylex.props(ui.wrap)}>
        <div {...stylex.props(ui.head)}>
          <h2 id="h-small" {...stylex.props(ui.h2)}>
            {t.small.title}
          </h2>
          <p {...stylex.props(ui.headBody)}>{t.small.body}</p>
        </div>
        <ul {...stylex.props(styles.grid)}>
          {t.small.items.map((item) => (
            <li key={item} {...stylex.props(ui.card, styles.item)}>
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
  section: { paddingTop: 0 },
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
    gap: space.s3,
  },
  item: { paddingBlock: space.s5, paddingInline: space.s5, textWrap: "pretty" },
  note: { marginTop: space.s4, marginBottom: 0, color: colors.muted, fontSize: type.small },
});
