import * as stylex from "@stylexjs/stylex";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackCover } from "../../components/BackCover";
import { Bar } from "../../components/Bar";
import { Hero } from "../../components/Hero";
import { Parts } from "../../components/Parts";
import { Steps } from "../../components/Steps";
import { ThumbBar } from "../../components/ThumbBar";
import { Troubleshooting } from "../../components/Troubleshooting";
import { Who } from "../../components/Who";
import { WorkIndex } from "../../components/WorkIndex";
import { WorkOrder } from "../../components/WorkOrder";
import { partDomId, type PartId } from "../../content/parts";
import { colors, fonts, space } from "../../design/tokens.stylex";
import { useLang } from "../../i18n/useLang";

export const Route = createFileRoute("/{-$lang}/")({
  component: HomePage,
});

const HIGHLIGHT_MS = 1800;

/** Jumping to a part scrolls to it, moves focus to it and highlights it briefly (DESIGN-SYSTEM §8). */
const usePartJump = () => {
  const [highlighted, setHighlighted] = useState<PartId | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const jump = useCallback((id: PartId) => {
    const card = document.getElementById(partDomId(id));
    if (!card) return;
    const instant = matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "nearest", inline: "start" });
    card.focus({ preventScroll: true });
    setHighlighted(id);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setHighlighted(null), HIGHLIGHT_MS);
  }, []);

  return { highlighted, jump };
};

function HomePage() {
  const { t } = useLang();
  const { highlighted, jump } = usePartJump();
  return (
    <>
      <a href="#top" {...stylex.props(styles.skip)}>
        {t.a11y.skip}
      </a>
      <Bar />
      <main id="top" tabIndex={-1}>
        <Hero highlighted={highlighted} onSelect={jump} />
        <Parts highlighted={highlighted} onShow={jump} />
        <WorkIndex />
        <Troubleshooting onShow={jump} />
        <Steps />
        <Who />
        <WorkOrder />
      </main>
      <BackCover />
      <ThumbBar />
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
    backgroundColor: colors.ink,
    color: colors.surface,
    paddingBlock: space.s3,
    paddingInline: space.s3,
    fontFamily: fonts.mono,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    textDecoration: "none",
  },
});
