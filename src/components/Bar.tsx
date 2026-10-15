import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { brand } from "../content/brand";
import { navSections } from "../content/sections";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, space, type } from "../design/tokens.stylex";
import { paramFromLang } from "../i18n";
import { useLang } from "../i18n/useLang";
import { LangLink } from "./LangLink";
import { ThemeSwitch } from "./ThemeSwitch";

/** Top of the page: wordmark, section links, language and theme. Not sticky. */
export function Bar() {
  const { lang, t } = useLang();
  return (
    <header {...stylex.props(ui.wrap, styles.bar)}>
      <Link
        to="/{-$lang}"
        params={{ lang: paramFromLang(lang) }}
        aria-label={t.a11y.home}
        {...stylex.props(styles.mark, ui.focusRing)}
      >
        {brand.wordmark}
      </Link>
      <nav aria-label={t.a11y.mainNav} {...stylex.props(styles.nav)}>
        {navSections.map((id) => (
          <a key={id} href={`#${id}`} {...stylex.props(styles.link, ui.focusRing)}>
            {t.sections[id]}
          </a>
        ))}
      </nav>
      <div {...stylex.props(styles.controls)}>
        <LangLink />
        <ThemeSwitch />
      </div>
    </header>
  );
}

const styles = stylex.create({
  bar: {
    display: "flex",
    alignItems: "center",
    gap: { default: space.s6, [media.phone]: space.s4 },
    paddingBlock: space.s5,
  },
  mark: {
    marginRight: "auto",
    fontFamily: fonts.text,
    fontWeight: 700,
    fontSize: "22px",
    letterSpacing: type.trackDisplay,
    color: colors.ink,
    textDecoration: "none",
    paddingBlock: space.s1,
  },
  nav: { display: { default: "flex", [media.tablet]: "none" }, gap: space.s6 },
  link: {
    fontFamily: fonts.text,
    fontWeight: 500,
    fontSize: type.small,
    color: { default: colors.muted, ":hover": colors.ink },
    textDecoration: "none",
    paddingBlock: space.s1,
  },
  controls: { display: "flex", alignItems: "center", gap: { default: space.s6, [media.phone]: space.s4 } },
});
