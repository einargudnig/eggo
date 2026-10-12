import * as stylex from "@stylexjs/stylex";
import { parts } from "../content/parts";
import { caseIds, cases, clientLabel, type CaseId } from "../content/work";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, motion, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { SectionHead } from "./SectionHead";

/** §2: an index of builds. Each row is a native <details>, so it opens with Enter/Space for free. */
export function WorkIndex() {
  const { t } = useLang();
  return (
    <section id="verk" aria-labelledby="h-verk" tabIndex={-1} {...stylex.props(ui.anchor, styles.section)}>
      <SectionHead id="h-verk" index="§2" label={t.sections.verk} title={t.work.title} aside={t.work.hint} />
      <div {...stylex.props(styles.flush)}>
        <div aria-hidden="true" {...stylex.props(styles.grid, styles.head)}>
          <span {...stylex.props(ui.label)}>{t.work.cols.project}</span>
          <span {...stylex.props(ui.label)}>{t.work.cols.part}</span>
          <span {...stylex.props(ui.label, styles.wide)}>{t.work.cols.client}</span>
          <span {...stylex.props(ui.label, styles.wide)}>{t.work.cols.stack}</span>
          <span />
        </div>
        {caseIds.map((id, i) => (
          <CaseRow key={id} id={id} open={i === 0} />
        ))}
      </div>
    </section>
  );
}

function CaseRow({ id, open }: { id: CaseId; open: boolean }) {
  const { t } = useLang();
  const copy = t.work.cases[id];
  const { part, url } = cases[id];
  const unknown = !parts[part].defined;
  const sep = <span {...stylex.props(ui.srOnly)}>, </span>;
  return (
    <details open={open} {...stylex.props(styles.row, stylex.defaultMarker())}>
      <summary {...stylex.props(styles.grid, styles.summary, ui.focusRing)}>
        <span {...stylex.props(styles.name)}>{copy.name}</span>
        {sep}
        <span {...stylex.props(styles.kind, unknown && styles.kindUnknown)}>
          <span aria-hidden="true">{`${part} · ${parts[part].code}`}</span>
          <span {...stylex.props(ui.srOnly)}>{`${t.a11y.partWord} ${part}, ${t.parts[part].short}`}</span>
        </span>
        {sep}
        <span {...stylex.props(ui.label, styles.ink, styles.wide)}>
          {clientLabel(id, t.work.engagements)}
        </span>
        {sep}
        <span {...stylex.props(ui.label, styles.wide)}>{copy.stack}</span>
        <span aria-hidden="true" {...stylex.props(styles.plus)}>
          +
        </span>
      </summary>
      <div {...stylex.props(styles.case)}>
        <div {...stylex.props(styles.cell)}>
          <span {...stylex.props(ui.label)}>{t.work.problem}</span>
          <p {...stylex.props(styles.text)}>{copy.problem}</p>
        </div>
        <div {...stylex.props(styles.cell)}>
          <span {...stylex.props(ui.label)}>{t.work.built}</span>
          <p {...stylex.props(styles.text)}>{copy.built}</p>
        </div>
        <div {...stylex.props(styles.cell)}>
          <span {...stylex.props(ui.label)}>{t.work.result}</span>
          <span {...stylex.props(styles.metric)}>{copy.metric}</span>
          <p {...stylex.props(styles.text)}>{copy.metricNote}</p>
          <a href={url} {...stylex.props(styles.more, ui.focusRing)}>
            {t.work.readMore}
            <span aria-hidden="true"> →</span>
          </a>
        </div>
      </div>
    </details>
  );
}

const styles = stylex.create({
  section: {
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.ruleStrong,
  },
  flush: { maxWidth: layout.max, marginInline: "auto" },
  more: {
    justifySelf: "start",
    marginTop: space.s2,
    paddingBlock: space.s1,
    fontFamily: fonts.mono,
    fontSize: "12px",
    fontWeight: 500,
    color: colors.ink,
    textDecorationLine: "underline",
    textDecorationThickness: { default: "1px", ":hover": "2px" },
    textUnderlineOffset: "3px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 5fr) minmax(0, 1.5fr) minmax(0, 1.8fr) minmax(0, 2.4fr) 32px",
      [media.tablet]: "minmax(0, 1fr) auto 24px",
      [media.phone]: "minmax(0, 1fr) 24px",
    },
    columnGap: { default: space.s4, [media.phone]: space.s3 },
    rowGap: space.s2,
    alignItems: "baseline",
    paddingInline: { default: space.s5, [media.phone]: space.s4 },
  },
  head: {
    display: { default: "grid", [media.phone]: "none" },
    paddingBlock: space.s3,
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.ruleStrong,
  },
  wide: { display: { default: null, [media.tablet]: "none" } },
  row: { borderBottomWidth: layout.rule, borderBottomStyle: "solid", borderBottomColor: colors.rule },
  summary: {
    position: "relative",
    listStyle: "none",
    cursor: "pointer",
    paddingBlock: { default: space.s5, [media.phone]: space.s4 },
    outlineOffset: "-3px",
    backgroundColor: {
      default: "transparent",
      ":active": colors.surface2,
      [stylex.when.ancestor("[open]")]: colors.surface2,
    },
    transitionProperty: "background-color",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.step,
    "::-webkit-details-marker": { display: "none" },
  },
  name: {
    fontSize: { default: "22px", [media.phone]: "20px" },
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
  },
  kind: {
    position: "relative",
    fontFamily: fonts.mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: type.trackLabel,
    textTransform: "uppercase",
    borderWidth: layout.rule,
    borderStyle: "solid",
    borderColor: colors.ruleStrong,
    paddingBlock: space.s1,
    paddingInline: space.s2,
    whiteSpace: "nowrap",
    justifySelf: "start",
    gridRow: { default: null, [media.phone]: 2 },
    gridColumn: { default: null, [media.phone]: 1 },
  },
  kindUnknown: { borderStyle: "dashed" },
  ink: { color: colors.ink },
  plus: {
    fontFamily: fonts.mono,
    fontSize: "20px",
    lineHeight: 1,
    justifySelf: "end",
    gridRow: { default: null, [media.phone]: "1 / span 2" },
    gridColumn: { default: null, [media.phone]: 2 },
    alignSelf: { default: null, [media.phone]: "center" },
    transform: { default: null, [stylex.when.ancestor("[open]")]: "rotate(45deg)" },
    transitionProperty: "transform",
    transitionDuration: motion.base,
    transitionTimingFunction: motion.step,
  },
  case: {
    display: "grid",
    gridTemplateColumns: { default: "repeat(3, minmax(0, 1fr))", [media.tablet]: "1fr" },
    borderTopWidth: layout.rule,
    borderTopStyle: "solid",
    borderTopColor: colors.rule,
    backgroundColor: colors.surface2,
  },
  cell: {
    display: "grid",
    gap: space.s2,
    alignContent: "start",
    paddingTop: { default: space.s4, [media.phone]: space.s3 },
    paddingInline: { default: space.s5, [media.phone]: space.s4 },
    paddingBottom: { default: space.s5, [media.phone]: space.s4 },
    borderWidth: 0,
    borderLeftWidth: { default: 0, ":not(:first-child)": layout.rule, [media.tablet]: 0 },
    borderTopWidth: { default: 0, [media.tablet]: { default: 0, ":not(:first-child)": layout.rule } },
    borderStyle: "solid",
    borderColor: colors.rule,
  },
  text: { margin: 0, fontSize: type.small, textWrap: "pretty" },
  metric: {
    fontSize: { default: "34px", [media.phone]: "30px" },
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1,
  },
});
