import type { PartId } from "../content/parts";
import type { SectionId } from "../content/sections";
import type { CaseId, TroubleId } from "../content/work";

type CaseCopy = {
  name: string;
  stack: string;
  problem: string;
  built: string;
  /** Big number in the result column. */
  metric: string;
  metricNote: string;
};

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
  mapflow: {
    label: "Frá óljósu vandamáli að korti að lausn",
    before: "Fyrir",
    map: "Kort",
    after: "Svo",
    notes: ["excel??", "3 tölvupóstar", "Gunna veit", "á föstudögum"],
    outcomes: [
      { mark: "01", text: "vefsíða" },
      { mark: "02", text: "kerfi" },
      { mark: "03", text: "agent" },
      { mark: "04", text: "tenging" },
      { mark: "06", text: "eitthvað nýtt", isNew: true },
      { mark: "—", text: "eða ekki neitt" },
    ] as readonly { mark: string; text: string; isNew?: true }[],
  },
  work: {
    title: "Nýleg smíði",
    hint: "Smelltu á línu",
    note: "Dæmi. Raunveruleg verkefni koma hér.",
    cols: { project: "Verkefni", part: "Hluti", year: "Ár", stack: "Tækni" },
    problem: "Vandi",
    built: "Smíðað",
    result: "Niðurstaða",
    cases: {
      "dk-invoices": {
        name: "Agent sem færir reikninga í DK",
        stack: "Claude · DK API",
        problem: "Einn dagur í mánuði fór í að lesa reikninga frá birgjum og slá þá inn í DK.",
        built: "Agent les hvert PDF, velur bókhaldslykil og spyr í Slack þegar hann er óviss.",
        metric: "8 klst → 25 mín",
        metricNote: "á mánuði, dæmitala",
      },
      "order-map": {
        name: "Kortlagning á pantanaferli hjá heildsölu",
        stack: "Tafla → 04",
        problem: "„Pantanir týnast einhvers staðar.“ Enginn gat sagt hvar.",
        built:
          "Vikulöng kortlagning á flæðinu milli tölvupósts, síma og tveggja kerfa. Þrjár handsendingar fundust.",
        metric: "1 kort, 2 lagfæringar",
        metricNote: "varð að hluta 04, dæmi",
      },
      "restaurant-orders": {
        name: "Pantanakerfi fyrir veitingahús",
        stack: "React Router · Postgres",
        problem: "Pantanir voru í sameiginlegu Excel-skjali sem bara ein manneskja skildi.",
        built: "Innra kerfi með innskráningu, hlutverkum og daglegri skýrslu í tölvupósti.",
        metric: "0 Excel-skjöl",
        metricNote: "dæmitala",
      },
      "architect-site": {
        name: "Vefur fyrir arkitektastofu",
        stack: "Astro · Cloudflare",
        problem: "Vefur frá 2014 sem enginn þorði að snerta.",
        built: "Tvítyngdur vefur þar sem þau bæta sjálf við verkefnum.",
        metric: "0,8 s",
        metricNote: "hleðslutími, dæmitala",
      },
      "slack-asana": {
        name: "Slack ↔ Asana samstilling",
        stack: "Workers · webhooks",
        problem: "Beiðnir komu í Slack og gleymdust áður en þær rötuðu í Asana.",
        built: "Viðbragð með emoji býr til verkefni og þráðurinn uppfærist þegar því er lokið.",
        metric: "1 vika",
        metricNote: "frá símtali í keyrslu, dæmi",
      },
    } satisfies Record<CaseId, CaseCopy>,
  },
  trouble: {
    title: "Kannastu við eitthvað af þessu?",
    cols: { item: "Liður", symptom: "Einkenni", fix: "Líkleg lausn", part: "Hluti" },
    see: "Sjá hluta",
    quote: { open: "„", close: "“" },
    rows: {
      a: {
        symptom: "Við eyðum degi í hverjum mánuði í að slá inn reikninga.",
        fix: "Agent les þá og spyr þegar hann er óviss.",
      },
      b: {
        symptom: "Vefsíðan er gömul og enginn þorir að snerta hana.",
        fix: "Ný síða sem þú getur breytt sjálf/ur.",
      },
      c: {
        symptom: "Allt er í Excel-skjali sem bara ein manneskja skilur.",
        fix: "Lítið innra kerfi með almennilegum réttindum.",
      },
      d: {
        symptom: "Við afritum sömu gögnin á milli þriggja kerfa.",
        fix: "Tengja þau einu sinni og hætta að afrita.",
      },
      e: {
        symptom: "Eitthvað er að, en ég veit ekki alveg hvað.",
        fix: "Byrja á vikulangri kortlagningu.",
      },
    } satisfies Record<TroubleId, { symptom: string; fix: string }>,
  },
  steps: {
    title: "Frá fyrsta símtali að afhendingu",
    items: [
      {
        when: "20 mín · frítt",
        title: "Símtal",
        body: "Þú lýsir vandanum. Ég segi þér hreinskilnislega hvort ég sé rétti maðurinn í það.",
      },
      {
        when: "1 vika",
        title: "Umfang og fast verð",
        body: "Stutt skriflegt umfang með föstu verði. Óljós vandamál eru kortlögð fyrst (hluti 05).",
      },
      {
        when: "Vikulega",
        title: "Smíði",
        body: "Eitthvað sem virkar í hverri viku, sem þú getur prófað og gert athugasemdir við.",
      },
      {
        when: "Þitt",
        title: "Afhending",
        body: "Kóði, aðgangar og skjölun á þínu nafni. Ekkert læst inni hjá mér.",
      },
    ],
  },
  who: {
    intro: "Ég heiti Einar. Eggó er bara ég. Sá sem þú talar við í fyrsta símtali er sá sem skrifar kóðann.",
    aside: "Engir verkefnastjórar, engin framsending, engir lærlingar að læra á verkefninu þínu.",
    facts: [
      { term: "Staður", detail: "Reykjavík" },
      { term: "Mál", detail: "Íslenska, enska" },
      { term: "Rými", detail: "1–2 verkefni í einu" },
      { term: "Svar", detail: "Innan eins virks dags" },
    ],
  },
  sections: {
    smidi: "Smíði",
    verk: "Verk",
    bilanaleit: "Bilanaleit",
    ferli: "Ferli",
    hver: "Hver",
    samband: "Samband",
  } satisfies Record<SectionId, string>,
  contents: {
    open: "Efni",
    title: "Efnisyfirlit",
    close: "Loka",
    workOrderShort: "VB",
  },
  thumb: { book: "Bóka símtal" },
  back: {
    edition: "Útgáfa",
    builtIn: "Smíðað í Reykjavík",
    setIn: "Sett í Schibsted Grotesk og JetBrains Mono",
  },
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
    orEmail: "Eða tölvupóstur",
    copy: "Afrita",
    copied: "Netfang afritað",
  },
};

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

/** The shape every language must provide. A missing or extra key in `en.ts` is a type error. */
export type Dict = Widen<typeof is>;
