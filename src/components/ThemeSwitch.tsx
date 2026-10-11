import * as stylex from "@stylexjs/stylex";
import { useSyncExternalStore } from "react";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, fonts, layout, motion, space, type } from "../design/tokens.stylex";
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
      <span aria-hidden="true" {...stylex.props(styles.text, !dark && styles.textOn)}>
        {t.bar.light}
      </span>
      <span aria-hidden="true" {...stylex.props(styles.track)}>
        <span {...stylex.props(styles.knob, dark && styles.knobOn)} />
      </span>
      <span aria-hidden="true" {...stylex.props(styles.text, dark && styles.textOn)}>
        {t.bar.dark}
      </span>
    </button>
  );
}

const styles = stylex.create({
  switch: {
    display: "flex",
    alignItems: "center",
    gap: space.s2,
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingBlock: space.s1,
    paddingInline: 0,
    minHeight: { default: null, [media.phone]: "44px" },
    cursor: "pointer",
    color: colors.muted,
  },
  text: {
    fontFamily: fonts.mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: type.trackLabel,
    textTransform: "uppercase",
    display: { default: null, [media.phone]: "none" },
  },
  textOn: { color: colors.ink },
  track: {
    width: "40px",
    height: "20px",
    borderWidth: layout.rule,
    borderStyle: "solid",
    borderColor: colors.ruleStrong,
    position: "relative",
    flexShrink: 0,
    backgroundImage: `repeating-linear-gradient(90deg, ${colors.rule} 0 1px, transparent 1px 4px)`,
  },
  knob: {
    position: "absolute",
    top: "2px",
    left: "2px",
    width: "16px",
    height: "14px",
    backgroundColor: { default: colors.ink, [media.forcedColors]: "CanvasText" },
    transitionProperty: "transform",
    transitionDuration: motion.base,
    transitionTimingFunction: motion.step,
  },
  knobOn: { transform: "translateX(18px)" },
});
