import * as stylex from "@stylexjs/stylex";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { SectionHead } from "./SectionHead";

/** §4: the process. Step titles are h3 under the section h2 (ACCESSIBILITY.md #4). */
export function Steps() {
  const { t } = useLang();
  return (
    <section id="ferli" aria-labelledby="h-ferli" tabIndex={-1} {...stylex.props(ui.anchor, styles.section)}>
      <SectionHead id="h-ferli" index="§4" label={t.sections.ferli} title={t.steps.title} />
      <ol {...stylex.props(styles.steps)}>
        {t.steps.items.map((step, i) => (
          <li key={step.title} {...stylex.props(styles.step)}>
            <span aria-hidden="true" {...stylex.props(styles.n)}>
              {i + 1}
            </span>
            <span {...stylex.props(ui.label, styles.when, styles.col2)}>{step.when}</span>
            <h3 {...stylex.props(styles.title, styles.col2)}>{step.title}</h3>
            <p {...stylex.props(styles.body, styles.col2)}>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

const styles = stylex.create({
  section: {
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.ruleStrong,
  },
  steps: {
    listStyle: "none",
    marginBlock: 0,
    marginInline: "auto",
    paddingInline: 0,
    maxWidth: layout.max,
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(4, minmax(0, 1fr))",
      [media.tablet]: "repeat(2, minmax(0, 1fr))",
      [media.phone]: "1fr",
    },
    borderTopWidth: layout.rule,
    borderTopStyle: "solid",
    borderTopColor: colors.ruleStrong,
  },
  step: {
    display: "grid",
    gridTemplateColumns: { default: null, [media.phone]: "56px minmax(0, 1fr)" },
    columnGap: space.s3,
    rowGap: { default: space.s3, [media.phone]: space.s1 },
    alignContent: "start",
    paddingTop: { default: space.s5, [media.phone]: space.s4 },
    paddingInline: { default: space.s5, [media.phone]: space.s4 },
    paddingBottom: { default: space.s7, [media.phone]: space.s5 },
    borderStyle: "solid",
    borderColor: colors.ruleStrong,
    borderWidth: 0,
    borderRightWidth: {
      default: layout.rule,
      ":last-child": 0,
      [media.tablet]: { default: layout.rule, ":nth-child(even)": 0 },
      [media.phone]: 0,
    },
    borderBottomWidth: {
      default: 0,
      [media.tablet]: { default: 0, ":nth-child(-n+2)": layout.rule },
      [media.phone]: { default: layout.rule, ":last-child": 0 },
    },
  },
  n: {
    fontFamily: fonts.display,
    fontSize: { default: "56px", [media.phone]: "44px" },
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: "-0.05em",
    color: "transparent",
    WebkitTextStroke: `1px ${colors.ink}`,
    gridRow: { default: null, [media.phone]: "1 / span 3" },
  },
  col2: { gridColumn: { default: null, [media.phone]: 2 } },
  when: { color: colors.accentInk },
  title: { margin: 0, fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em" },
  body: { margin: 0, color: colors.muted, fontSize: type.small, textWrap: "pretty" },
});
