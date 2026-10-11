import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { media } from "../design/media.stylex";
import { colors, layout, motion, space } from "../design/tokens.stylex";
import { useLang } from "../i18n/useLang";
import { ButtonLink } from "./Button";

/** The bar hides while either of these is on screen: they already show the same actions. */
const COVERING = ["hero", "samband"] as const;

/** Phone-only booking bar. Off-screen means `inert`, so it never takes focus while hidden (ACCESSIBILITY.md #5). */
export function ThumbBar() {
  const { t } = useLang();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const targets = COVERING.map((id) => document.getElementById(id)).filter((el) => el !== null);
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setHidden(visible.size > 0);
    });
    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div inert={hidden} data-hidden={hidden} {...stylex.props(styles.thumb, hidden && styles.hidden)}>
      <div {...stylex.props(styles.grow)}>
        <ButtonLink href="#samband" variant="primary" stretchOnPhone>
          {t.thumb.book}
        </ButtonLink>
      </div>
      <ButtonLink href="#order" variant="ghost">
        {t.order.form}
      </ButtonLink>
    </div>
  );
}

const styles = stylex.create({
  thumb: {
    display: { default: "none", [media.phone]: "flex" },
    gap: space.s2,
    position: "fixed",
    insetInline: 0,
    bottom: 0,
    zIndex: 40,
    paddingTop: space.s3,
    paddingInline: space.gutter,
    paddingBottom: `calc(${space.s3} + env(safe-area-inset-bottom, 0px))`,
    backgroundColor: `color-mix(in srgb, ${colors.surface} 94%, transparent)`,
    backdropFilter: "blur(8px)",
    borderTopWidth: layout.rule,
    borderTopStyle: "solid",
    borderTopColor: colors.ruleStrong,
    transitionProperty: "transform",
    transitionDuration: motion.slow,
    transitionTimingFunction: motion.step,
  },
  hidden: { transform: "translateY(110%)" },
  grow: { flex: 1 },
});
