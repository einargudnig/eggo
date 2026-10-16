import * as stylex from "@stylexjs/stylex";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar } from "../../components/Bar";
import { Hero } from "../../components/Hero";
import { Parts } from "../../components/Parts";
import { Small } from "../../components/Small";
import { Steps } from "../../components/Steps";
import { WorkIndex } from "../../components/WorkIndex";
import { WorkOrder, fieldIds } from "../../components/WorkOrder";
import { brand } from "../../content/brand";
import { partIds, type PartId } from "../../content/parts";
import { troubleIds, troubles, type TroubleId } from "../../content/work";
import { media } from "../../design/media.stylex";
import { ui } from "../../design/primitives";
import { colors, space, type } from "../../design/tokens.stylex";
import { useLang } from "../../i18n/useLang";

export const Route = createFileRoute("/{-$lang}/")({
  component: HomePage,
});

const toggle = <T,>(list: readonly T[], item: T) =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

/** The parts that fix the picked symptoms, in part order. */
const routeFor = (picked: readonly TroubleId[]): PartId[] =>
  partIds.filter((id) => picked.some((trouble) => troubles[trouble] === id));

/** "Fá fast verð": scroll to the work order and put the cursor in the first field (ACCESSIBILITY.md: focus follows). */
const onSend = () => {
  const name = document.getElementById(fieldIds.name);
  const instant = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("samband")?.scrollIntoView({ behavior: instant ? "auto" : "smooth" });
  name?.focus({ preventScroll: true });
};

function HomePage() {
  const { t } = useLang();
  const [picked, setPicked] = useState<readonly TroubleId[]>([]);
  // The work order starts from the hero's route, but its destinations can be changed on their own.
  const [chosen, setChosen] = useState<readonly PartId[]>([]);

  const onToggleSymptom = (id: TroubleId) => {
    const next = troubleIds.filter((x) => toggle(picked, id).includes(x));
    setPicked(next);
    setChosen(routeFor(next));
  };

  return (
    <>
      <a href="#top" {...stylex.props(styles.skip)}>
        {t.a11y.skip}
      </a>
      <Bar />
      <main id="top" tabIndex={-1} {...stylex.props(styles.main)}>
        <Hero picked={picked} route={routeFor(picked)} onToggle={onToggleSymptom} onSend={onSend} />
        <Parts lit={routeFor(picked)} />
        <Small />
        <WorkIndex />
        <Steps />
        <WorkOrder
          chosen={chosen}
          onToggle={(id) => setChosen(partIds.filter((x) => toggle(chosen, id).includes(x)))}
        />
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
