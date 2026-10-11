import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { brand } from "../content/brand";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, space, type } from "../design/tokens.stylex";
import { paramFromLang } from "../i18n";
import { useLang } from "../i18n/useLang";
import { ThemeSwitch } from "./ThemeSwitch";

export function Bar() {
  const { lang, t } = useLang();
  const other = lang === "is" ? "en" : "is";
  return (
    <header {...stylex.props(styles.bar)}>
      <div {...stylex.props(ui.wrap, styles.row)}>
        <Link
          to="/{-$lang}"
          params={{ lang: paramFromLang(lang) }}
          {...stylex.props(styles.logo, ui.focusRing)}
        >
          {brand.wordmark}
          <span {...stylex.props(styles.dot)}>.</span>
        </Link>
        <div {...stylex.props(styles.controls)}>
          <Link
            to="/{-$lang}"
            params={{ lang: paramFromLang(other) }}
            hrefLang={other}
            lang={other}
            aria-label={t.bar.otherLang}
            {...stylex.props(styles.lang, ui.focusRing, ui.press)}
          >
            {t.bar.otherLangShort}
          </Link>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}

const styles = stylex.create({
  bar: {
    position: "sticky",
    top: 0,
    zIndex: 30,
    backgroundColor: `color-mix(in srgb, ${colors.surface} 92%, transparent)`,
    backdropFilter: "blur(6px)",
    borderBottomWidth: layout.rule,
    borderBottomStyle: "solid",
    borderBottomColor: colors.ruleStrong,
  },
  row: { display: "flex", alignItems: "center", gap: space.s5, height: layout.barHeight },
  logo: {
    fontWeight: 900,
    fontSize: "22px",
    letterSpacing: "-0.03em",
    textDecoration: "none",
    color: colors.ink,
    marginRight: "auto",
  },
  dot: { color: colors.accentInk },
  controls: { display: "flex", alignItems: "center", gap: space.s4 },
  lang: {
    fontFamily: fonts.mono,
    fontSize: type.label,
    fontWeight: 700,
    letterSpacing: type.trackLabel,
    color: colors.ink,
    textDecoration: "none",
    borderWidth: layout.rule,
    borderStyle: "solid",
    borderColor: colors.ruleStrong,
    paddingInline: space.s3,
    minHeight: { default: "32px", [media.phone]: "44px" },
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: { default: "transparent", [media.hover]: { default: null, ":hover": colors.surface2 } },
  },
});
