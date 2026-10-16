import * as stylex from "@stylexjs/stylex";
import { pagePath } from "../content/agent";
import { brand } from "../content/brand";
import { partDomId } from "../content/parts";
import { caseIds, cases, clientLabel } from "../content/work";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { ButtonLink } from "./Button";

/**
 * The work page: every case led by the one number that changed, set larger than anything else on the page.
 * Cases alternate sides down the page with wide gaps between them, then the page closes on an ink field.
 */
export function WorkCases() {
  const { lang, t } = useLang();
  return (
    <>
      <div {...stylex.props(ui.wrap, styles.page)}>
        <header {...stylex.props(styles.head)}>
          <h1 {...stylex.props(styles.title)}>{t.work.title}</h1>
          <p {...stylex.props(ui.headBody)}>
            {t.work.intro}{" "}
            <a href={brand.ownerSite} {...stylex.props(ui.link, ui.focusRing)}>
              {brand.ownerSite.replace(/^https:\/\//, "")}
            </a>
            .
          </p>
        </header>

        <ol {...stylex.props(styles.list)}>
          {caseIds.map((id, i) => {
            const c = t.work.cases[id];
            const { part, url } = cases[id];
            const flip = i % 2 === 1;
            return (
              <li key={id} {...stylex.props(styles.case)}>
                <div {...stylex.props(styles.figure, flip && styles.figureFlip)}>
                  <p {...stylex.props(styles.number, ui.tabular)}>{c.metric}</p>
                  <p {...stylex.props(styles.numberNote)}>{c.metricNote}</p>
                </div>
                <div {...stylex.props(styles.text, flip && styles.textFlip)}>
                  <h2 {...stylex.props(styles.name)}>
                    <a href={url} {...stylex.props(styles.nameLink, ui.focusRing)}>
                      {c.name}
                      <span aria-hidden="true">{" ↗"}</span>
                    </a>
                  </h2>
                  <p {...stylex.props(ui.label, styles.meta)}>
                    {`${clientLabel(id, t.work.engagements)}, `}
                    <a href={`${pagePath(lang)}#${partDomId(part)}`} {...stylex.props(ui.link, ui.focusRing)}>
                      {t.parts[part].name}
                    </a>
                  </p>
                  <dl {...stylex.props(styles.facts)}>
                    <dt {...stylex.props(ui.label)}>{t.work.problem}</dt>
                    <dd {...stylex.props(styles.fact)}>{c.problem}</dd>
                    <dt {...stylex.props(ui.label)}>{t.work.built}</dt>
                    <dd {...stylex.props(styles.fact)}>{c.built}</dd>
                    <dt {...stylex.props(ui.label)}>{t.work.cols.stack}</dt>
                    <dd {...stylex.props(styles.fact)}>{c.stack}</dd>
                    <dt {...stylex.props(ui.label)}>{t.work.result}</dt>
                    <dd {...stylex.props(styles.fact, styles.last, styles.outcome)}>{c.outcome}</dd>
                  </dl>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <section aria-labelledby="h-close" {...stylex.props(styles.close)}>
        <div {...stylex.props(ui.wrap, styles.closeInner)}>
          <h2 id="h-close" {...stylex.props(styles.closeTitle)}>
            {t.workPage.close.title}
          </h2>
          <div {...stylex.props(styles.closeFoot)}>
            <p {...stylex.props(styles.closeBody)}>{t.workPage.close.body}</p>
            <ButtonLink href={`${pagePath(lang)}#samband`} inverse>
              {t.workPage.close.cta}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

const styles = stylex.create({
  page: {
    paddingTop: { default: space.s9, [media.phone]: space.s7 },
    paddingBottom: { default: space.s10, [media.phone]: space.s8 },
  },
  head: {
    display: "grid",
    gap: space.s3,
    maxWidth: "40em",
    marginBottom: { default: space.s9, [media.phone]: space.s7 },
  },
  title: {
    margin: 0,
    fontSize: type.h2,
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: type.trackHead,
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    rowGap: space.s9,
  },
  case: {
    display: "grid",
    gridTemplateColumns: { default: "repeat(12, minmax(0, 1fr))", [media.phone]: "minmax(0, 1fr)" },
    columnGap: space.s6,
    rowGap: space.s5,
    alignItems: "start",
  },
  figure: {
    gridColumn: { default: "1 / span 7", [media.phone]: "1" },
    gridRow: { default: 1, [media.phone]: "auto" },
  },
  figureFlip: {
    gridColumn: { default: "6 / span 7", [media.phone]: "1" },
    textAlign: { default: "right", [media.phone]: "left" },
  },
  number: {
    margin: 0,
    fontSize: type.monument,
    fontWeight: 600,
    lineHeight: 0.85,
    letterSpacing: "-0.05em",
    whiteSpace: "nowrap",
  },
  numberNote: {
    marginTop: space.s4,
    marginBottom: 0,
    color: colors.muted,
    maxWidth: "24em",
    display: "inline-block",
    textWrap: "pretty",
  },
  text: {
    gridColumn: { default: "8 / span 5", [media.phone]: "1" },
    gridRow: { default: 1, [media.phone]: "auto" },
  },
  textFlip: { gridColumn: { default: "1 / span 5", [media.phone]: "1" } },
  name: {
    margin: 0,
    fontSize: type.h3,
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: type.trackHead,
    textWrap: "balance",
  },
  meta: { marginTop: space.s2 },
  facts: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: space.s1,
    marginTop: space.s5,
    marginBottom: 0,
  },
  fact: { margin: 0, marginBottom: space.s3, textWrap: "pretty" },
  last: { marginBottom: 0 },
  outcome: { fontWeight: 600 },
  nameLink: {
    color: "inherit",
    textDecorationLine: "underline",
    textDecorationColor: { default: colors.control, ":hover": "currentColor" },
    textDecorationThickness: "1px",
    textUnderlineOffset: "4px",
  },
  close: { backgroundColor: colors.ink, color: colors.page },
  closeInner: {
    display: "grid",
    alignContent: "space-between",
    gap: space.s8,
    minHeight: { default: "70svh", [media.phone]: "60svh" },
    paddingBlock: { default: space.s9, [media.phone]: space.s8 },
  },
  closeTitle: {
    margin: 0,
    fontSize: type.display,
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: type.trackDisplay,
    textWrap: "balance",
    maxWidth: "10em",
  },
  closeFoot: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "end",
    justifyContent: "space-between",
    gap: space.s5,
  },
  closeBody: { margin: 0, fontSize: type.lead, maxWidth: "28em", textWrap: "pretty" },
});
