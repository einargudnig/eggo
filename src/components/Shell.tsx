import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import type { Page } from "../content/agent";
import { brand } from "../content/brand";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { Bar } from "./Bar";

/** Every page: skip link, top bar, the page's own content as <main>, footer. */
export function Shell({ page, children }: { page: Page; children: ReactNode }) {
  const { t } = useLang();
  return (
    <>
      <a href="#top" {...stylex.props(styles.skip)}>
        {t.a11y.skip}
      </a>
      <Bar page={page} />
      <main id="top" tabIndex={-1} {...stylex.props(styles.main)}>
        {children}
      </main>
      <footer {...stylex.props(ui.wrap, styles.footer)}>
        <span>
          {`${brand.name} · ${t.about.place} · ${t.footer.by}`}
          <a href={brand.ownerSite} {...stylex.props(ui.link, ui.focusRing)}>
            {t.footer.byName}
          </a>
        </span>
        <span>{t.footer.setIn}</span>
      </footer>
    </>
  );
}

const styles = stylex.create({
  skip: {
    position: "fixed",
    left: space.s2,
    top: space.s2,
    zIndex: 100,
    transform: { default: "translateY(-160%)", ":focus": "none" },
    backgroundColor: colors.accent,
    color: colors.accentInk,
    paddingBlock: space.s3,
    paddingInline: space.s4,
    borderRadius: "8px",
    fontWeight: 600,
    textDecoration: "none",
    outline: { default: "none", ":focus-visible": `2px solid ${colors.ink}` },
    outlineOffset: "2px",
  },
  main: { outline: "none" },
  footer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: space.s3,
    paddingTop: space.s5,
    paddingBottom: { default: space.s7, [media.phone]: space.s6 },
    color: colors.muted,
    fontSize: type.small,
  },
});
