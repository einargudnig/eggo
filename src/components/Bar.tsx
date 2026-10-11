import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { brand } from "../content/brand";
import { partIds } from "../content/parts";
import { navSections, type SectionId } from "../content/sections";
import { caseIds } from "../content/work";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, space, type } from "../design/tokens.stylex";
import { paramFromLang } from "../i18n";
import { useLang } from "../i18n/useLang";
import { Clock } from "./Clock";
import { ContentsSheet } from "./ContentsSheet";
import { LangLink } from "./LangLink";
import { ThemeSwitch } from "./ThemeSwitch";

/** Item counts shown as superscripts in the nav: "Verk (5)". */
const navCounts: Partial<Record<SectionId, number>> = { smidi: partIds.length, verk: caseIds.length };

export function Bar() {
  const { lang, t } = useLang();
  const [sheetOpen, setSheetOpen] = useState(false);
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
        <nav aria-label={t.a11y.mainNav} {...stylex.props(styles.nav)}>
          {navSections.map((id) => (
            <a key={id} href={`#${id}`} {...stylex.props(styles.navLink, ui.focusRing)}>
              {t.sections[id]}
              {navCounts[id] === undefined ? null : (
                <sup {...stylex.props(styles.sup)}>{`(${navCounts[id]})`}</sup>
              )}
            </a>
          ))}
        </nav>
        <Clock />
        <div {...stylex.props(styles.controls)}>
          <LangLink />
          <ThemeSwitch />
        </div>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-controls="contents"
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen(true)}
          {...stylex.props(styles.menu, ui.focusRing, ui.press)}
        >
          <i aria-hidden="true" {...stylex.props(styles.burger)} />
          {t.contents.open}
        </button>
      </div>
      <ContentsSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
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
  row: {
    display: "flex",
    alignItems: "center",
    gap: { default: space.s5, [media.phone]: space.s3 },
    height: layout.barHeight,
  },
  logo: {
    fontWeight: 900,
    fontSize: "22px",
    letterSpacing: "-0.03em",
    textDecoration: "none",
    color: colors.ink,
    marginRight: { default: null, [media.tablet]: "auto" },
  },
  dot: { color: colors.accentInk },
  nav: {
    display: { default: "flex", [media.tablet]: "none" },
    gap: space.s5,
    marginRight: "auto",
  },
  navLink: {
    fontFamily: fonts.mono,
    fontSize: "12px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    textDecoration: "none",
    color: { default: colors.muted, [media.hover]: { default: null, ":hover": colors.ink } },
    paddingBlock: space.s1,
  },
  sup: { fontSize: "9px", marginLeft: "0.2em", color: colors.accentInk },
  controls: { display: { default: "flex", [media.phone]: "none" }, alignItems: "center", gap: space.s4 },
  menu: {
    display: { default: "none", [media.phone]: "inline-flex" },
    alignItems: "center",
    gap: space.s2,
    height: "40px",
    paddingBlock: 0,
    paddingInline: space.s3,
    fontFamily: fonts.mono,
    fontSize: type.label,
    fontWeight: 700,
    letterSpacing: type.trackLabel,
    textTransform: "uppercase",
    backgroundColor: colors.ink,
    color: colors.surface,
    borderWidth: 0,
    cursor: "pointer",
  },
  burger: {
    display: "block",
    width: "12px",
    height: "6px",
    borderBlockWidth: "1.5px",
    borderBlockStyle: "solid",
    borderBlockColor: "currentColor",
  },
});
