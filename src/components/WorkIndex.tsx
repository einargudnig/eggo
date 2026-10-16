import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { brand } from "../content/brand";
import { partDomId } from "../content/parts";
import { cases, clientLabel, featuredCaseIds } from "../content/work";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, space, type } from "../design/tokens.stylex";
import { paramFromLang } from "../i18n";
import { useLang } from "../i18n/useLang";
import { SectionHead } from "./SectionHead";

/** Recent work: the two featured cases, then a link to all of them on `/verk`. */
export function WorkIndex() {
  const { lang, t } = useLang();
  return (
    <section id="verk" aria-labelledby="h-work" tabIndex={-1} {...stylex.props(ui.anchor, ui.section)}>
      <div {...stylex.props(ui.wrap)}>
        <SectionHead headingId="h-work" title={t.work.title}>
          {t.work.intro}{" "}
          <a href={brand.ownerSite} {...stylex.props(ui.link, ui.focusRing)}>
            {brand.ownerSite.replace(/^https:\/\//, "")}
          </a>
          .
        </SectionHead>
        <ul {...stylex.props(styles.log)}>
          {featuredCaseIds.map((id) => {
            const c = t.work.cases[id];
            const { part, url } = cases[id];
            return (
              <li key={id} {...stylex.props(styles.entry)}>
                <div>
                  <a href={`#${partDomId(part)}`} {...stylex.props(ui.label, styles.kind, ui.focusRing)}>
                    {t.parts[part].name}
                  </a>
                  <h3 {...stylex.props(styles.name)}>{c.name}</h3>
                  <p {...stylex.props(ui.label, styles.who)}>{clientLabel(id, t.work.engagements)}</p>
                </div>
                <p {...stylex.props(styles.what)}>
                  {c.outcome}{" "}
                  <a href={url} {...stylex.props(ui.link, ui.focusRing, styles.story)}>
                    {t.work.story}
                    <span {...stylex.props(ui.srOnly)}>{`: ${c.name}`}</span>
                  </a>
                </p>
                <div {...stylex.props(styles.stat)}>
                  <p {...stylex.props(styles.num, ui.tabular)}>{c.metric}</p>
                  <p {...stylex.props(styles.numNote)}>{c.metricNote}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <Link
          to="/{-$lang}/verk"
          params={{ lang: paramFromLang(lang) }}
          {...stylex.props(ui.link, ui.focusRing, styles.all)}
        >
          {`${t.work.all} →`}
        </Link>
      </div>
    </section>
  );
}

const styles = stylex.create({
  log: { listStyle: "none", margin: 0, padding: 0 },
  entry: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1.2fr) minmax(0, 1.5fr) minmax(0, 0.8fr)",
      [media.phone]: "minmax(0, 1fr)",
    },
    gap: { default: space.s6, [media.phone]: space.s3 },
    alignItems: "start",
    paddingBlock: { default: space.s6, [media.phone]: space.s5 },
  },
  kind: { textDecoration: { default: "none", ":hover": "underline" }, textUnderlineOffset: "3px" },
  name: {
    marginTop: space.s2,
    marginBottom: 0,
    fontFamily: fonts.text,
    fontSize: type.h3,
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: type.trackHead,
    textWrap: "balance",
  },
  who: { marginTop: space.s2 },
  what: { margin: 0, textWrap: "pretty" },
  all: { display: "inline-block", marginTop: space.s5, fontWeight: 600, fontSize: type.lead },
  story: { whiteSpace: "nowrap" },
  stat: { textAlign: { default: "right", [media.phone]: "left" } },
  num: {
    margin: 0,
    fontWeight: 600,
    fontSize: type.h2,
    letterSpacing: type.trackDisplay,
    lineHeight: 1,
  },
  numNote: {
    marginTop: space.s2,
    marginBottom: 0,
    fontSize: type.small,
    lineHeight: 1.4,
    color: colors.muted,
  },
});
