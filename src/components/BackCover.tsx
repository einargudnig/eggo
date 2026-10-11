import * as stylex from "@stylexjs/stylex";
import { brand } from "../content/brand";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, layout, space } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";

/** Colophon plus the oversized wordmark that bleeds off the bottom of the page. */
export function BackCover() {
  const { t } = useLang();
  return (
    <footer {...stylex.props(styles.back)}>
      <div {...stylex.props(ui.wrap, styles.colophon)}>
        <span {...stylex.props(ui.label, ui.tabular)}>{`© ${brand.edition.slice(0, 4)} ${brand.name}`}</span>
        <span {...stylex.props(ui.label, ui.tabular)}>
          {`${t.back.edition} ${brand.edition} · ${t.back.builtIn}`}
        </span>
        <span {...stylex.props(ui.label)}>{t.back.setIn}</span>
      </div>
      <p aria-hidden="true" {...stylex.props(styles.bigmark)}>
        {brand.wordmark}
        <span {...stylex.props(styles.dot)}>.</span>
      </p>
    </footer>
  );
}

const styles = stylex.create({
  back: { overflow: "hidden" },
  colophon: {
    display: "flex",
    flexDirection: { default: "row", [media.phone]: "column" },
    flexWrap: "wrap",
    justifyContent: "space-between",
    columnGap: space.s6,
    rowGap: { default: space.s2, [media.phone]: space.s1 },
    paddingTop: space.s5,
    paddingBottom: space.s2,
  },
  bigmark: {
    fontWeight: 900,
    fontSize: "clamp(120px, 30vw, 420px)",
    lineHeight: 0.78,
    letterSpacing: "-0.07em",
    marginBlock: 0,
    marginInline: "auto",
    paddingInline: space.gutter,
    maxWidth: layout.max,
    whiteSpace: "nowrap",
    transform: "translateY(0.1em)",
  },
  dot: { color: colors.accentInk },
});
