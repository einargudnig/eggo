import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, space, type } from "../design/tokens.stylex";
import { paramFromLang } from "../i18n";
import { useLang } from "../i18n/useLang";

/** Switches to the other language's route. Named in the target language (ACCESSIBILITY.md #10). */
export function LangLink({ large = false }: { large?: boolean }) {
  const { lang, t } = useLang();
  const other = lang === "is" ? "en" : "is";
  return (
    <Link
      to="/{-$lang}"
      params={{ lang: paramFromLang(other) }}
      hrefLang={other}
      lang={other}
      aria-label={t.bar.otherLang}
      {...stylex.props(styles.lang, large && styles.langLarge, ui.focusRing, ui.press)}
    >
      {t.bar.otherLangShort}
    </Link>
  );
}

const styles = stylex.create({
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
    minHeight: "32px",
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: { default: "transparent", [media.hover]: { default: null, ":hover": colors.surface2 } },
  },
  langLarge: { minHeight: "44px", paddingInline: space.s4 },
});
