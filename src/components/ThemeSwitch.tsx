import * as stylex from "@stylexjs/stylex";
import { useSyncExternalStore } from "react";
import { ui } from "../design/primitives";
import { colors, fonts, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";

type Theme = "light" | "dark";
const KEY = "eggo-theme";
const CHANGE = "eggo-theme-change";

const currentTheme = (): Theme => {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const subscribe = (onChange: () => void) => {
  const mq = matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
};

/** A half-filled disc and "Dark". The visible word stays inside the accessible name "Dark mode" (WCAG 2.5.3). */
export function ThemeSwitch() {
  const { t } = useLang();
  const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, () => null);

  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // storage blocked: the switch still works for this page view
    }
    window.dispatchEvent(new Event(CHANGE));
  };

  const dark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={t.a11y.darkMode}
      onClick={toggle}
      {...stylex.props(styles.switch, ui.focusRing)}
    >
      <i aria-hidden="true" {...stylex.props(styles.disc, dark && styles.discDark)} />
      <span>{t.bar.dark}</span>
    </button>
  );
}

const styles = stylex.create({
  switch: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.s2,
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingBlock: space.s3,
    paddingInline: 0,
    cursor: "pointer",
    fontFamily: fonts.sign,
    fontWeight: 600,
    fontSize: type.small,
    color: { default: colors.ink, ":hover": colors.link },
  },
  disc: {
    display: "block",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "currentColor",
    backgroundImage: "linear-gradient(90deg, currentColor 50%, transparent 50%)",
  },
  discDark: { backgroundImage: "linear-gradient(270deg, currentColor 50%, transparent 50%)" },
});
