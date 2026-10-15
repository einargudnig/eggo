import * as stylex from "@stylexjs/stylex";
import { brand } from "../content/brand";
import { partDomId, parts } from "../content/parts";
import { caseIds, cases, clientLabel } from "../content/work";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { SectionHead } from "./SectionHead";

/** Recent work. Each entry names the kind of work it was, linking back to that row of the services list. */
export function WorkIndex() {
  const { t } = useLang();
  return (
    <section id="verk" aria-labelledby="h-work" tabIndex={-1} {...stylex.props(ui.anchor, ui.section)}>
      <div {...stylex.props(ui.wrap)}>
        <SectionHead section="verk" headingId="h-work" title={t.work.title}>
          {t.work.intro}{" "}
          <a href={brand.ownerSite} {...stylex.props(ui.link, ui.focusRing)}>
            {brand.ownerSite.replace(/^https:\/\//, "")}
          </a>
          .
        </SectionHead>
        <ul {...stylex.props(styles.log)}>
          {caseIds.map((id) => {
            const c = t.work.cases[id];
            const { part, url } = cases[id];
            return (
              <li key={id} {...stylex.props(styles.entry)}>
                <div>
                  <a href={`#${partDomId(part)}`} {...stylex.props(ui.label, styles.kind, ui.focusRing)}>
                    <b
                      aria-hidden="true"
                      {...stylex.props(ui.labelStrong)}
                    >{`${part} · ${parts[part].code}`}</b>
                    <span aria-hidden="true">{" · "}</span>
                    {t.parts[part].name}
                  </a>
                  <h3 {...stylex.props(styles.name)}>{c.name}</h3>
                  <p {...stylex.props(ui.label, styles.who)}>
                    {`${clientLabel(id, t.work.engagements)} · ${t.work.gains[cases[id].gain]}`}
                  </p>
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
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colors.line,
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
  story: { whiteSpace: "nowrap" },
  num: {
    margin: 0,
    fontWeight: 600,
    fontSize: { default: "36px", [media.phone]: "30px" },
    letterSpacing: type.trackDisplay,
    lineHeight: 1,
    textAlign: { default: "right", [media.phone]: "left" },
  },
  numNote: {
    display: "block",
    marginTop: space.s2,
    fontWeight: 400,
    fontSize: type.fine,
    lineHeight: 1.4,
    letterSpacing: 0,
    color: colors.muted,
  },
});
