import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Hero } from "../../components/Hero";
import { Parts } from "../../components/Parts";
import { Shell } from "../../components/Shell";
import { Small } from "../../components/Small";
import { Steps } from "../../components/Steps";
import { WorkIndex } from "../../components/WorkIndex";
import { WorkOrder, fieldIds } from "../../components/WorkOrder";
import { pageHead } from "../../content/head";
import { partIds, type PartId } from "../../content/parts";
import { troubleIds, troubles, type TroubleId } from "../../content/work";
import { langFromParam } from "../../i18n";

export const Route = createFileRoute("/{-$lang}/")({
  head: ({ params }) => pageHead(langFromParam(params.lang) ?? "is", "home"),
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
  const [picked, setPicked] = useState<readonly TroubleId[]>([]);
  // The work order starts from the hero's route, but its destinations can be changed on their own.
  const [chosen, setChosen] = useState<readonly PartId[]>([]);

  const onToggleSymptom = (id: TroubleId) => {
    const next = troubleIds.filter((x) => toggle(picked, id).includes(x));
    setPicked(next);
    setChosen(routeFor(next));
  };

  return (
    <Shell page="home">
      <Hero picked={picked} route={routeFor(picked)} onToggle={onToggleSymptom} onSend={onSend} />
      <Parts lit={routeFor(picked)} />
      <Small />
      <WorkIndex />
      <Steps />
      <WorkOrder
        chosen={chosen}
        onToggle={(id) => setChosen(partIds.filter((x) => toggle(chosen, id).includes(x)))}
      />
    </Shell>
  );
}
