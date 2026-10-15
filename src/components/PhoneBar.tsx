import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { partIds, type PartId } from "../content/parts";
import { media } from "../design/media.stylex";
import { ui } from "../design/primitives";
import { colors, motion, space, type } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { Button } from "./Button";

/** Elements that already show the suggestion: while either is on screen the bar isn't needed. */
const watched = ["tillaga", "samband"];

/**
 * Phones only: once something is ticked, a bar at the bottom keeps the suggestion and "Fá fast verð" in
 * reach while the summary card is scrolled out of view. It unmounts rather than hides, so it never sits in
 * the tab order off-screen.
 */
export function PhoneBar({ route, onSend }: { route: readonly PartId[]; onSend: () => void }) {
  const { t } = useLang();
  const [covered, setCovered] = useState(true);

  useEffect(() => {
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      setCovered(seen.size > 0);
    });
    for (const id of watched) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  if (route.length === 0 || covered) return null;
  const names = partIds.filter((id) => route.includes(id)).map((id) => t.parts[id].sign);

  return (
    <aside aria-label={t.a11y.tripBar} {...stylex.props(styles.bar)}>
      <a href="#tillaga" {...stylex.props(styles.what, ui.focusRing)}>
        <span {...stylex.props(ui.label)}>{`${t.trip.title} · ${route.length}`}</span>
        <span {...stylex.props(styles.names)}>{names.join(" · ")}</span>
      </a>
      <Button type="button" onClick={onSend}>
        {t.trip.sendShort}
      </Button>
    </aside>
  );
}

const rise = stylex.keyframes({ from: { transform: "translateY(100%)" }, to: { transform: "none" } });

const styles = stylex.create({
  bar: {
    display: { default: "none", [media.phone]: "flex" },
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    alignItems: "center",
    gap: space.s4,
    paddingTop: space.s3,
    paddingBottom: `max(${space.s3}, env(safe-area-inset-bottom))`,
    paddingLeft: `max(${space.gutter}, env(safe-area-inset-left))`,
    paddingRight: `max(${space.gutter}, env(safe-area-inset-right))`,
    backgroundColor: colors.page,
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colors.line,
    boxShadow: `0 -8px 24px ${colors.shadow}`,
    animationName: rise,
    animationDuration: "280ms",
    animationTimingFunction: motion.ease,
  },
  what: { flex: 1, minWidth: 0, display: "grid", gap: space.s0, color: colors.ink, textDecoration: "none" },
  names: {
    fontSize: type.small,
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});
