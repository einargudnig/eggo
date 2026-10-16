import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import type { Page } from "../content/agent";
import { ui } from "../design/primitives";
import { colors, fonts, space, type } from "../design/tokens.stylex";
import { paramFromLang } from "../i18n";
import { useLang } from "../i18n/useLang";

/** Switches to the same page in the other language. Named in the target language (ACCESSIBILITY.md #10). */
export function LangLink({ page }: { page: Page }) {
  const { lang, t } = useLang();
  const other = lang === "is" ? "en" : "is";
  return (
    <Link
      to={page === "verk" ? "/{-$lang}/verk" : "/{-$lang}"}
      params={{ lang: paramFromLang(other) }}
      hrefLang={other}
      lang={other}
      {...stylex.props(styles.lang, ui.focusRing)}
    >
      {t.bar.otherLang}
    </Link>
  );
}

const styles = stylex.create({
  lang: {
    fontFamily: fonts.text,
    fontWeight: 500,
    fontSize: type.small,
    color: { default: colors.muted, ":hover": colors.ink },
    textDecoration: "none",
    paddingBlock: space.s3,
  },
});
