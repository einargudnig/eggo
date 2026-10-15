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
      <svg viewBox="0 0 50 44" aria-hidden="true" {...stylex.props(styles.tri)}>
        <path d="M25 0 50 44H0z" {...stylex.props(styles.edge)} />
        <path d="M25 9 42 39H8z" {...stylex.props(styles.fill)} />
        <path d="M23 17h4l-.6 12h-2.8zM25 31.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" {...stylex.props(styles.mark)} />
      </svg>
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
  tri: { width: "72px", height: "64px" },
  edge: { fill: colors.warnEdge },
  fill: { fill: colors.warn },
  mark: { fill: colors.warnInk },
  title: {
    margin: 0,
    fontFamily: fonts.sign,
    fontSize: type.display,
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: type.trackDisplay,
    textWrap: "balance",
  },
  body: { margin: 0, fontSize: type.lead, color: colors.muted, maxWidth: "36ch" },
  home: { marginTop: space.s3, paddingBlock: space.s2, fontFamily: fonts.sign, fontWeight: 700 },
});
