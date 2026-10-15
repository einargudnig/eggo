import * as stylex from "@stylexjs/stylex";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";

/** How a project runs: four steps in order. */
export function Steps() {
  const { t } = useLang();
  return (
    <section id="ferli" aria-labelledby="h-steps" tabIndex={-1} {...stylex.props(ui.anchor, ui.section)}>
      <div {...stylex.props(ui.wrap)}>
        <div {...stylex.props(ui.head)}>
          <h2 id="h-steps" {...stylex.props(ui.h2)}>
            {t.steps.title}
          </h2>
          <p {...stylex.props(ui.headBody)}>{t.steps.intro}</p>
        </div>
        <ol {...stylex.props(styles.list)}>
          {t.steps.items.map((step) => (
            <li key={step.title} {...stylex.props(styles.step)}>
              <h3 {...stylex.props(styles.title)}>{step.title}</h3>
              <p {...stylex.props(styles.when)}>{step.when}</p>
              <p {...stylex.props(styles.body)}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const styles = stylex.create({
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(4, minmax(0, 1fr))",
      [media.tablet]: "repeat(2, minmax(0, 1fr))",
      [media.phone]: "minmax(0, 1fr)",
    },
    gap: { default: space.s6, [media.phone]: space.s5 },
  },
  step: {
    paddingTop: space.s4,
    borderTopWidth: "2px",
    borderTopStyle: "solid",
    borderTopColor: colors.ink,
  },
  title: { margin: 0, fontSize: type.h3, fontWeight: 600, letterSpacing: type.trackHead },
  when: { marginTop: space.s1, marginBottom: 0, fontSize: type.fine, color: colors.muted },
  body: { marginTop: space.s3, marginBottom: 0, color: colors.muted, textWrap: "pretty" },
});
