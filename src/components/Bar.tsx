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

/** Top of the page: the wordmark on a small sign plate, section links, language and theme. Not sticky. */
export function Bar() {
  const { lang, t } = useLang();
  return (
    <header {...stylex.props(ui.wrap, styles.bar)}>
      <Link
        to="/{-$lang}"
        params={{ lang: paramFromLang(lang) }}
        aria-label={t.a11y.home}
        {...stylex.props(styles.plate, ui.focusRing)}
      >
        <span {...stylex.props(styles.plateIn)}>{brand.wordmark}</span>
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
  plate: {
    display: "inline-block",
    backgroundColor: colors.sign,
    color: colors.signInk,
    textDecoration: "none",
    borderRadius: "9px",
    padding: space.s1,
    marginRight: "auto",
  },
  plateIn: {
    display: "block",
    borderWidth: "2.5px",
    borderStyle: "solid",
    borderColor: colors.signInk,
    borderRadius: "6px",
    fontFamily: fonts.sign,
    fontWeight: 800,
    fontSize: "23px",
    lineHeight: 1,
    paddingTop: space.s2,
    paddingBottom: space.s1,
    paddingInline: space.s3,
  },
  nav: {
    display: { default: "flex", [media.tablet]: "none" },
    gap: space.s6,
  },
  link: {
    fontFamily: fonts.sign,
    fontWeight: 600,
    fontSize: type.small,
    color: { default: colors.ink, ":hover": colors.link },
    textDecoration: "none",
    paddingBlock: space.s1,
  },
  controls: { display: "flex", alignItems: "center", gap: { default: space.s6, [media.phone]: space.s4 } },
});
