import * as stylex from "@stylexjs/stylex";
import { Link, useParams } from "@tanstack/react-router";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, space, type } from "../design/tokens.stylex";
import { getDict, langFromParam, paramFromLang } from "../i18n";

/** Any unknown URL. Reads the language from the URL itself: `/nope` never reaches the `/{-$lang}` context. */
export function NotFound() {
  const { lang: param } = useParams({ strict: false });
  const lang = langFromParam(param) ?? "is";
  const t = getDict(lang);
  return (
    <main lang={lang} {...stylex.props(ui.wrap, styles.main)}>
      <h1 {...stylex.props(styles.title)}>{t.notFound.title}</h1>
      <p {...stylex.props(styles.body)}>{t.notFound.body}</p>
      <Link
        to="/{-$lang}"
        params={{ lang: paramFromLang(lang) }}
        {...stylex.props(ui.link, ui.focusRing, styles.home)}
      >
        {t.notFound.home}
        <span aria-hidden="true"> →</span>
      </Link>
    </main>
  );
}

const styles = stylex.create({
  main: {
    display: "grid",
    gap: space.s4,
    justifyItems: "start",
    paddingTop: { default: space.s10, [media.phone]: space.s8 },
    paddingBottom: space.s10,
  },
  title: {
    margin: 0,
    fontFamily: fonts.text,
    fontSize: type.display,
    fontWeight: 600,
    lineHeight: 1.05,
    letterSpacing: type.trackDisplay,
    textWrap: "balance",
  },
  body: { margin: 0, fontSize: type.lead, color: colors.muted, maxWidth: "36ch" },
  home: { marginTop: space.s3, paddingBlock: space.s2, fontWeight: 600 },
});
