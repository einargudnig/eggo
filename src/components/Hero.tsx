import * as stylex from "@stylexjs/stylex";
import { brand } from "../content/brand";
import type { PartId } from "../content/parts";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, layout, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { ButtonLink } from "./Button";
import { Diagram } from "./Diagram";

type Props = { highlighted: PartId | null; onSelect: (id: PartId) => void };

export function Hero({ highlighted, onSelect }: Props) {
  const { t } = useLang();
  return (
    <section aria-labelledby="h1" {...stylex.props(styles.hero)}>
      <div {...stylex.props(ui.wrap)}>
        <div {...stylex.props(styles.meta)}>
          <span {...stylex.props(ui.label)}>
            <b {...stylex.props(ui.labelStrong)}>{brand.name}</b> / {t.hero.eyebrow}
          </span>
          <span {...stylex.props(ui.label, styles.status)}>
            <i aria-hidden="true" {...stylex.props(styles.statusDot)} />
            {t.hero.status}
          </span>
        </div>
        <div {...stylex.props(styles.grid)}>
          <h1 id="h1" {...stylex.props(styles.title)}>
            {t.hero.titleStart}
            <em {...stylex.props(styles.em)}>{t.hero.titleEm}</em>
          </h1>
          <div {...stylex.props(styles.foot)}>
            <p {...stylex.props(styles.lead)}>{t.hero.lead}</p>
            <ButtonLink href="#samband" variant="primary" stretchOnPhone>
              {t.hero.cta}
            </ButtonLink>
          </div>
          <div {...stylex.props(styles.figure)}>
            <Diagram highlighted={highlighted} onSelect={onSelect} />
          </div>
        </div>
      </div>
    </section>
  );
}

const blink = stylex.keyframes({ "50%": { opacity: 0.25 } });

const styles = stylex.create({
  hero: {
    paddingTop: { default: space.s8, [media.phone]: space.s6 },
    paddingBottom: { default: space.s9, [media.phone]: space.s7 },
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.ruleStrong,
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: space.s7,
    rowGap: space.s2,
    marginBottom: { default: space.s7, [media.phone]: space.s5 },
  },
  status: { display: "inline-flex", alignItems: "center", gap: space.s2 },
  statusDot: {
    width: "8px",
    height: "8px",
    backgroundColor: colors.accent,
    animationName: blink,
    animationDuration: "1.6s",
    animationTimingFunction: "steps(2)",
    animationIterationCount: "infinite",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
    columnGap: space.gutter,
    alignItems: "end",
  },
  title: {
    gridColumn: { default: "1 / 8", [media.tablet]: "1 / -1" },
    gridRow: { default: 1, [media.tablet]: "auto" },
    margin: 0,
    fontWeight: 800,
    fontSize: type.display,
    lineHeight: { default: 0.92, [media.phone]: 0.9 },
    letterSpacing: type.trackDisplay,
    textWrap: "balance",
    overflowWrap: "anywhere",
    hyphens: "auto",
  },
  em: { fontStyle: "normal", color: colors.accentInk },
  foot: {
    gridColumn: { default: "1 / 8", [media.tablet]: "1 / -1" },
    gridRow: { default: 2, [media.tablet]: "auto" },
    display: { default: "flex", [media.phone]: "grid" },
    flexWrap: "wrap",
    gap: { default: space.s6, [media.phone]: space.s5 },
    alignItems: "flex-end",
    marginTop: { default: space.s7, [media.phone]: space.s5 },
  },
  lead: { margin: 0, maxWidth: "46ch", fontSize: type.lead, color: colors.muted, textWrap: "pretty" },
  figure: {
    gridColumn: { default: "8 / 13", [media.tablet]: "1 / -1" },
    gridRow: { default: "1 / span 2", [media.tablet]: "auto" },
    alignSelf: "end",
    marginTop: { default: 0, [media.tablet]: space.s7 },
    maxWidth: { default: null, [media.tablet]: "560px", [media.phone]: "none" },
  },
});
