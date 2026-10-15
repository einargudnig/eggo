import * as stylex from "@stylexjs/stylex";
import { brand } from "../content/brand";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";

/** "Hver keyrir?": a short signed note from Einar, in the first person. */
export function Who() {
  const { t } = useLang();
  return (
    <section id="hver" aria-labelledby="h-who" tabIndex={-1} {...stylex.props(ui.anchor, ui.section)}>
      <div {...stylex.props(ui.wrap, styles.grid)}>
        <h2 id="h-who" {...stylex.props(ui.h2)}>
          {t.who.title}
        </h2>
        <div {...stylex.props(styles.note)}>
          <p {...stylex.props(styles.lead)}>{t.who.lead}</p>
          <p {...stylex.props(styles.p)}>{t.who.aside}</p>
          <p {...stylex.props(styles.p)}>
            {t.who.sideStart}
            <a href={brand.sideProject} {...stylex.props(ui.link, ui.focusRing)}>
              {t.who.sideLink}
            </a>
            {t.who.sideEnd}
          </p>
          <p {...stylex.props(styles.sign)}>
            <b {...stylex.props(styles.motto)}>{t.who.motto}</b>
            <span {...stylex.props(styles.byline)}>{`${brand.ownerFullName}, ${t.who.place}`}</span>
          </p>
          <p {...stylex.props(styles.links)}>
            {[brand.ownerSite, brand.github].map((href) => (
              <a key={href} href={href} {...stylex.props(ui.link, ui.focusRing)}>
                {href.replace(/^https:\/\//, "")}
              </a>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

const styles = stylex.create({
  grid: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1fr) minmax(0, 1.4fr)", [media.tablet]: "minmax(0, 1fr)" },
    gap: { default: space.s8, [media.tablet]: space.s5 },
    alignItems: "start",
  },
  note: { maxWidth: "36em" },
  lead: { margin: 0, fontSize: "22px", lineHeight: 1.45, textWrap: "pretty" },
  p: { marginTop: space.s4, marginBottom: 0, textWrap: "pretty" },
  sign: { marginTop: space.s7, marginBottom: 0, display: "grid", gap: space.s1 },
  motto: { fontFamily: fonts.sign, fontWeight: 800, fontSize: type.h3 },
  byline: { color: colors.muted, fontSize: type.fine },
  links: { marginTop: space.s5, marginBottom: 0, display: "flex", flexWrap: "wrap", gap: space.s5 },
});
