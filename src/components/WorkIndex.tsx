import * as stylex from "@stylexjs/stylex";
import { brand } from "../content/brand";
import { partDomId } from "../content/parts";
import { caseIds, cases, clientLabel } from "../content/work";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";

/** Recent work. Each entry names the kind of work it was, linking back to that row of the services list. */
export function WorkIndex() {
  const { t } = useLang();
  return (
    <section id="verk" aria-labelledby="h-work" tabIndex={-1} {...stylex.props(ui.anchor, ui.section)}>
      <div {...stylex.props(ui.wrap)}>
        <div {...stylex.props(ui.head)}>
          <h2 id="h-work" {...stylex.props(ui.h2)}>
            {t.work.title}
          </h2>
          <p {...stylex.props(ui.headBody)}>
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
                  <a href={`#${partDomId(part)}`} {...stylex.props(styles.kind, ui.focusRing)}>
                    {t.parts[part].name}
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
  kind: {
    fontSize: type.fine,
    fontWeight: 500,
    color: { default: colors.muted, ":hover": colors.accent },
    textDecoration: "none",
  },
  name: {
    marginTop: space.s1,
    marginBottom: 0,
    fontFamily: fonts.text,
    fontSize: type.h3,
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: type.trackHead,
    textWrap: "balance",
  },
  who: { marginTop: space.s1, marginBottom: 0, color: colors.muted, fontSize: type.fine },
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
