import type { PartId } from "../content/parts";

type SpecRow = { term: string; detail: string; own?: true };
type PartCopy = {
  name: string;
  /** Short singular name used in the diagram and in screen-reader labels. */
  short: string;
  lead: string;
  specs: readonly SpecRow[];
  diagramDetail: string;
};

/** Icelandic is the source language. `en.ts` must match this shape exactly (see `Dict`). */
export const is = {
  meta: {
    title: "Eggó — hugbúnaður sem vinnur vinnuna",
    description: "Einmanna hugbúnaðarstofa í Reykjavík. Vefsíður, kerfi, AI agents og tengingar.",
  },
  a11y: {
    skip: "Fara í efni",
    mainNav: "Aðalvalmynd",
    language: "Tungumál",
    darkMode: "Myrkur hamur",
    partsNav: "Hlutar",
    partsRegion: "Hlutar 01–05",
    seePart: "sjá lýsingu",
    partWord: "hluti",
  },
  bar: { light: "Ljós", dark: "Myrkur", otherLang: "English", otherLangShort: "EN" },
  hero: {
    eyebrow: "Einmanna hugbúnaðarstofa",
    status: "Laus fyrir ný verkefni",
    titleStart: "Ég smíða hugbúnað sem ",
    titleEm: "vinnur vinnuna.",
    lead: "Vefsíður, innri kerfi, AI agents, tengingar, og vandamál sem passa ekki enn í neinn flokk. Fast verð, vikulegar afhendingar, og þú átt allt sem ég smíða.",
    cta: "Bóka 20 mín. símtal",
    figure: "Mynd 1 — dæmigerð smíði",
    figureCount: "05 hlutar",
    duration: "≈ 1–8 vikur",
    wires: { post: "POST", webhook: "webhook", api: "API" },
  },
  partsSection: {
    label: "Afurðir",
    title: "Fimm hlutar. Fjórir eru vel skilgreindir. Sá fimmti er það sem þú þarft.",
    swipe: "Strjúktu fyrir fleiri hluta",
  },
  parts: {
    "01": {
      name: "Vefsíður",
      short: "Vefsíða",
      lead: "Hröð vefsíða á íslensku og ensku sem þú getur uppfært sjálf/ur.",
      specs: [
        { term: "Inntak", detail: "Hugmynd, efni, vörumerki" },
        { term: "Tími", detail: "2–4 vikur" },
        { term: "Tækni", detail: "React · Cloudflare" },
        { term: "Þú átt", detail: "Kóða, hönnun, lén", own: true },
      ],
      diagramDetail: "eggo.is/bóka",
    },
    "02": {
      name: "Kerfi",
      short: "Kerfi",
      lead: "Excel-skjalið sem varð of stórt, orðið að almennilegu innra kerfi.",
      specs: [
        { term: "Inntak", detail: "Töflureiknar, handvirk ferli" },
        { term: "Tími", detail: "4–8 vikur" },
        { term: "Tækni", detail: "TypeScript · Postgres" },
        { term: "Þú átt", detail: "Kóða, gögn, hýsingu", own: true },
      ],
      diagramDetail: "Pantanir · 1.284 færslur",
    },
    "03": {
      name: "AI agents",
      short: "AI agent",
      lead: "Agent sem vinnur endurteknu verkin og spyr þig þegar hann er óviss.",
      specs: [
        { term: "Inntak", detail: "Tölvupóstar, PDF-reikningar, fyrirspurnir" },
        { term: "Tími", detail: "2–6 vikur" },
        { term: "Tækni", detail: "Claude · MCP" },
        { term: "Þú átt", detail: "Kóða, fyrirmæli, mælingar", own: true },
      ],
      diagramDetail: "Flokkar reikninga → DK",
    },
    "04": {
      name: "Tengingar",
      short: "Tenging",
      lead: "Kerfi sem töluðu ekki saman senda nú gögn sjálfkrafa á réttan stað.",
      specs: [
        { term: "Inntak", detail: "Tvö eða fleiri tól og mikið afrita-líma" },
        { term: "Tími", detail: "1–3 vikur" },
        { term: "Tækni", detail: "API · webhooks · Workers" },
        { term: "Þú átt", detail: "Kóða, skjölun", own: true },
      ],
      diagramDetail: "Slack · Asana · DK",
    },
    "05": {
      name: "Óskilgreint",
      short: "Óskilgreint",
      lead: "Eitthvað er hægt, handvirkt eða pirrandi og þú getur ekki alveg sagt hvað þú þarft. Við byrjum á að kortleggja það.",
      specs: [
        { term: "Inntak", detail: "Vandamál sem þú getur ekki alveg lýst" },
        { term: "Skref 1", detail: "Kortlagning: hver gerir hvað, hvert tíminn fer" },
        { term: "Tími", detail: "1 vika að kortleggja, svo fer það eftir" },
        { term: "Þú átt", detail: "Kortið, jafnvel þótt einhver annar smíði", own: true },
      ],
      diagramDetail: "Óljóst",
    },
  } satisfies Record<PartId, PartCopy>,
  order: {
    title: "Ertu með eitthvað sem ætti að ganga sjálft?",
    form: "Verkbeiðni",
    name: "Nafn",
    namePlaceholder: "Jón Jónsson",
    email: "Netfang",
    emailPlaceholder: "jon@fyrirtaeki.is",
    partsLegend: "Hvaða hluti? (veldu að vild)",
    notSure: "Veit ekki",
    message: "Hvað þarf að leysa?",
    messagePlaceholder: "Í stuttu máli…",
    submit: "Senda verkbeiðni",
    sending: "Sendi…",
    errMissing: "Fylltu út nafn, netfang og hvað þarf að leysa.",
    errEmail: "Netfangið virðist ófullkomið.",
    errServer: "Ekki tókst að senda. Reyndu aftur eða sendu póst á eggo@eggo.is.",
    received: "Verkbeiðni móttekin",
    receivedBody: "Ég svara innan eins virks dags.",
    again: "Ný beiðni",
  },
};

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

/** The shape every language must provide. A missing or extra key in `en.ts` is a type error. */
export type Dict = Widen<typeof is>;
