import * as stylex from "@stylexjs/stylex";
import { brand } from "../content/brand";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";

/** §5: who you'd be working with. The heading is styled as a label but stays an h2 (ACCESSIBILITY.md #4). */
export function Who() {
  const { t } = useLang();
  return (
    <section id="hver" aria-labelledby="h-who" tabIndex={-1} {...stylex.props(ui.anchor, styles.section)}>
      <div {...stylex.props(ui.wrap, styles.grid)}>
        <h2 id="h-who" {...stylex.props(ui.label, styles.label)}>
          <b {...stylex.props(ui.labelStrong)}>§5</b> {t.sections.hver}
        </h2>
        <div {...stylex.props(styles.body)}>
          <p {...stylex.props(styles.p)}>{t.who.intro}</p>
          <p {...stylex.props(styles.p, styles.muted)}>{t.who.aside}</p>
          <span aria-hidden="true" {...stylex.props(styles.sig)}>
            {`— ${brand.owner}`}
          </span>
        </div>
        <dl {...stylex.props(styles.facts)}>
          {t.who.facts.map((fact) => (
            <div key={fact.term} {...stylex.props(styles.fact)}>
              <dt {...stylex.props(ui.label, styles.dt)}>{fact.term}</dt>
              <dd {...stylex.props(styles.dd)}>{fact.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const styles = stylex.create({
  section: {
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.ruleStrong,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
    columnGap: space.gutter,
    paddingTop: { default: space.s7, [media.phone]: space.s6 },
    paddingBottom: { default: space.s8, [media.phone]: space.s7 },
  },
  label: { gridColumn: { default: "1 / 4", [media.tablet]: "1 / -1" } },
  body: {
    gridColumn: { default: "4 / 10", [media.tablet]: "1 / -1" },
    marginTop: { default: 0, [media.tablet]: space.s3 },
  },
  p: {
    marginTop: 0,
    marginBottom: space.s4,
    fontSize: "clamp(21px, 2.1vw, 28px)",
    lineHeight: 1.3,
    letterSpacing: "-0.015em",
    textWrap: "pretty",
    maxWidth: "34ch",
  },
  muted: { color: colors.muted },
  sig: {
    display: "inline-block",
    marginTop: space.s1,
    fontFamily: fonts.hand,
    fontSize: "46px",
    lineHeight: 1,
    color: colors.accentInk,
    transform: "rotate(-4deg)",
  },
  facts: {
    gridColumn: { default: "10 / 13", [media.tablet]: "1 / -1" },
    alignSelf: "start",
    marginBottom: 0,
    marginTop: { default: space.s2, [media.tablet]: space.s5 },
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    columnGap: space.s3,
    borderTopWidth: layout.rule,
    borderTopStyle: "solid",
    borderTopColor: colors.rule,
  },
  fact: { display: "contents" },
  dt: {
    paddingTop: space.s3,
    paddingBottom: space.s2,
    fontSize: type.label,
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.rule,
  },
  dd: {
    margin: 0,
    paddingBlock: space.s2,
    fontSize: "14px",
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.rule,
  },
});
