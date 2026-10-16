import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { pagePath, type Page } from "../content/agent";
import { navSections, type SectionId } from "../content/sections";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, space, type } from "../design/tokens.stylex";
import { paramFromLang } from "../i18n";
import { useLang } from "../i18n/useLang";
import { LangLink } from "./LangLink";
import { ThemeSwitch } from "./ThemeSwitch";
import { Wordmark } from "./Wordmark";

/** Top of the page: wordmark, section links, language and theme. Not sticky. */
export function Bar({ page }: { page: Page }) {
  const { lang, t } = useLang();
  // "Verk" is its own page; the other links are homepage sections, reached from any page.
  const href = (id: SectionId) => {
    if (id === "verk") return pagePath(lang, "verk");
    return page === "home" ? `#${id}` : `${pagePath(lang)}#${id}`;
  };
  return (
    <header {...stylex.props(ui.wrap, styles.bar)}>
      <Link
        to="/{-$lang}"
        params={{ lang: paramFromLang(lang) }}
        aria-label={t.a11y.home}
        {...stylex.props(styles.mark, ui.focusRing)}
      >
        <Wordmark style={styles.word} />
      </Link>
      <nav aria-label={t.a11y.mainNav} {...stylex.props(styles.nav)}>
        {navSections.map((id) => (
          <a
            key={id}
            href={href(id)}
            aria-current={id === page ? "page" : undefined}
            {...stylex.props(styles.link, ui.focusRing)}
          >
            {t.sections[id]}
          </a>
        ))}
      </nav>
      <div {...stylex.props(styles.controls)}>
        <LangLink page={page} />
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
  mark: { marginRight: "auto", color: colors.ink, paddingBlock: space.s1 },
  word: { height: { default: "26px", [media.phone]: "24px" } },
  nav: { display: { default: "flex", [media.tablet]: "none" }, gap: space.s6 },
  link: {
    fontFamily: fonts.text,
    fontWeight: 500,
    fontSize: type.small,
    color: { default: colors.muted, ":hover": colors.ink, "[aria-current=page]": colors.ink },
    textDecoration: "none",
    paddingBlock: space.s1,
  },
  controls: { display: "flex", alignItems: "center", gap: { default: space.s6, [media.phone]: space.s4 } },
});
