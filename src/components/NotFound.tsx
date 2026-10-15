import * as stylex from "@stylexjs/stylex";
import { Link, useParams } from "@tanstack/react-router";
import { brand } from "../content/brand";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { space, type } from "../design/tokens.stylex";
import { getDict, langFromParam, paramFromLang } from "../i18n";

/** Any unknown URL. Reads the language from the URL itself: `/nope` never reaches the `/{-$lang}` context. */
export function NotFound() {
  const { lang: param } = useParams({ strict: false });
  const lang = langFromParam(param) ?? "is";
  const t = getDict(lang);
  return (
    <main lang={lang} {...stylex.props(ui.wrap, styles.main)}>
      <p {...stylex.props(ui.label)}>
        <b {...stylex.props(ui.labelStrong)}>{brand.name}</b> / 404
      </p>
      <h1 {...stylex.props(styles.title)}>{t.notFound.title}</h1>
      <p {...stylex.props(styles.body)}>{t.notFound.body}</p>
      <Link
        to="/{-$lang}"
        params={{ lang: paramFromLang(lang) }}
        {...stylex.props(ui.label, ui.focusRing, styles.home)}
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
    paddingTop: { default: space.s9, [media.phone]: space.s7 },
    paddingBottom: space.s9,
  },
  title: {
    margin: 0,
    fontSize: type.display,
    fontWeight: 800,
    lineHeight: 0.92,
    letterSpacing: type.trackDisplay,
  },
  body: { margin: 0, fontSize: type.lead, maxWidth: "40ch" },
  home: {
    marginTop: space.s4,
    paddingBlock: space.s2,
    textDecorationLine: "underline",
    textUnderlineOffset: "3px",
  },
});
