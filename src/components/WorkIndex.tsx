import * as stylex from "@stylexjs/stylex";
import { brand } from "../content/brand";
import { partDomId } from "../content/parts";
import { caseIds, cases, clientLabel } from "../content/work";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { SignArrow } from "./SignArrow";

/** Recent work as a trip log. Each entry carries the small sign of the route it took, linking back to it. */
export function WorkIndex() {
  const { t } = useLang();
  return (
    <section id="verk" aria-labelledby="h-work" tabIndex={-1} {...stylex.props(ui.anchor, ui.section)}>
      <div {...stylex.props(ui.wrap)}>
        <div {...stylex.props(styles.head)}>
          <h2 id="h-work" {...stylex.props(ui.h2)}>
            {t.work.title}
          </h2>
          <p {...stylex.props(styles.intro)}>
            {t.work.intro}{" "}
            <a href={brand.ownerSite} {...stylex.props(ui.link, ui.focusRing)}>
              {brand.ownerSite.replace(/^https:\/\//, "")}
            </a>
            .
          </p>
        </div>
        <ul {...stylex.props(styles.log)}>
          {caseIds.map((id) => {
            const c = t.work.cases[id];
            const { part, url } = cases[id];
            return (
              <li key={id} {...stylex.props(styles.entry)}>
                <div>
                  <a href={`#${partDomId(part)}`} {...stylex.props(styles.chip, ui.focusRing)}>
                    <span {...stylex.props(styles.chipIn)}>
                      <SignArrow part={part} size="chip" />
                      {t.parts[part].sign}
                    </span>
                  </a>
                  <h3 {...stylex.props(styles.name)}>{c.name}</h3>
                  <p {...stylex.props(styles.who)}>{clientLabel(id, t.work.engagements)}</p>
                </div>
                <p {...stylex.props(styles.what)}>
                  {c.outcome}{" "}
                  <a href={url} {...stylex.props(ui.link, ui.focusRing, styles.story)}>
                    {t.work.story}
                    <span {...stylex.props(ui.srOnly)}>{`: ${c.name}`}</span>
                  </a>
                </p>
                <p {...stylex.props(styles.num, ui.tabular)}>
                  {c.metric}
                  <small {...stylex.props(styles.numNote)}>{c.metricNote}</small>
                </p>
              </li>
            );
          })}
        </ul>
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
  intro: { margin: 0, color: colors.muted, maxWidth: "34em" },
  log: { listStyle: "none", margin: 0, padding: 0 },
  entry: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1.25fr) minmax(0, 1.5fr) minmax(0, 0.8fr)",
      [media.phone]: "minmax(0, 1fr)",
    },
    gap: { default: space.s7, [media.phone]: space.s3 },
    alignItems: "start",
    paddingBlock: { default: space.s6, [media.phone]: space.s5 },
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colors.line,
    borderBottomWidth: { default: 0, ":last-child": "1px" },
    borderBottomStyle: "solid",
    borderBottomColor: colors.line,
  },
  chip: {
    display: "inline-flex",
    backgroundColor: colors.sign,
    color: colors.signInk,
    borderRadius: "6px",
    padding: space.s0,
    textDecoration: "none",
  },
  chipIn: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.s2,
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: colors.signInk,
    borderRadius: "4px",
    paddingTop: space.s1,
    paddingBottom: space.s0,
    paddingInline: space.s2,
    fontFamily: fonts.sign,
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: 1,
  },
  name: {
    marginTop: space.s3,
    marginBottom: 0,
    fontFamily: fonts.sign,
    fontSize: type.h3,
    fontWeight: 700,
    lineHeight: 1.2,
    textWrap: "balance",
  },
  who: { marginTop: space.s2, marginBottom: 0, color: colors.muted, fontSize: type.fine },
  what: { margin: 0, fontSize: "17px", textWrap: "pretty" },
  story: { whiteSpace: "nowrap" },
  num: {
    margin: 0,
    fontFamily: fonts.sign,
    fontWeight: 800,
    fontSize: { default: "44px", [media.phone]: "34px" },
    lineHeight: 1,
    textAlign: { default: "right", [media.phone]: "left" },
  },
  numNote: {
    display: "block",
    marginTop: space.s2,
    fontFamily: fonts.text,
    fontWeight: 400,
    fontSize: type.fine,
    lineHeight: 1.35,
    color: colors.muted,
  },
});
