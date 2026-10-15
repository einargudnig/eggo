import type { PartId } from "../content/parts";
import { brand } from "../content/brand";
import { isk, monthlyFee, priceFrom } from "../content/pricing";
import type { SectionId } from "../content/sections";
import type { CaseId, Engagement, Gain, TroubleId } from "../content/work";

type CaseCopy = {
  name: string;
  stack: string;
  problem: string;
  built: string;
  /** What the client got, in their terms. Leads the result column; the metric backs it up. */
  outcome: string;
  /** Supporting number in the result column. */
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
    title: "Eggó — frá vandamáli að lausn sem virkar",
    description:
      "Hugbúnaðarlausnir frá Reykjavík: vefsíður, innri kerfi, AI agents og tengingar sem spara tíma.",
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
    eyebrow: "Hugbúnaðarlausnir",
    status: "Laus fyrir ný verkefni",
    titleStart: "Frá vandamáli að ",
    titleEm: "lausn sem virkar.",
    sub: "Það sem tekur tíma í dag gengur sjálft á morgun.",
    lead: "Vefsíður, innri kerfi, AI agents og tengingar, og líka vandamál sem passa ekki enn í neinn flokk. Fast verð, vikulegar afhendingar, og þú átt lausnina.",
    cta: "Hafa samband",
    price: `Frá ${isk("is", Math.min(...Object.values(priceFrom)))} án VSK · fast verð`,
    figure: "Mynd 1 — dæmigerð smíði",
    figureCount: "05 hlutar",
    duration: "≈ 1–8 vikur",
    wires: { post: "POST", webhook: "webhook", api: "API" },
  },
  partsSection: {
    label: "Lausnir",
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
        { term: "Verð", detail: `Frá ${isk("is", priceFrom["01"])}` },
        { term: "Tækni", detail: "React · Cloudflare" },
        { term: "Þú átt", detail: "Kóða, hönnun, lén", own: true },
      ],
      diagramDetail: "eggo.is/samband",
    },
    "02": {
      name: "Kerfi",
      short: "Kerfi",
      lead: "Excel-skjalið sem varð of stórt, orðið að almennilegu innra kerfi.",
      specs: [
        { term: "Inntak", detail: "Töflureiknar, handvirk ferli" },
        { term: "Tími", detail: "4–8 vikur" },
        { term: "Verð", detail: `Frá ${isk("is", priceFrom["02"])}, eftir umfangi` },
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
        { term: "Verð", detail: `Frá ${isk("is", priceFrom["03"])}` },
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
        { term: "Verð", detail: `Frá ${isk("is", priceFrom["04"])}` },
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
        { term: "Verð", detail: `${isk("is", priceFrom["05"])} fyrir kortlagninguna` },
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
    cols: { project: "Verkefni", part: "Hluti", client: "Fyrir", stack: "Tækni" },
    problem: "Vandi",
    built: "Smíðað",
    result: "Niðurstaða",
    gains: { time: "Sparar tíma", errors: "Færri villur" } satisfies Record<Gain, string>,
    readMore: "Öll sagan á einargudni.com",
    engagements: {
      freelance: "verktaka",
      inhouse: "innanhúss",
      personal: "eigið verkefni",
    } satisfies Record<Engagement, string>,
    cases: {
      "gigover-assistant": {
        name: "AI aðstoðarmaður inni í Gigover",
        stack: "Gemini · Firebase",
        problem:
          "Gigover vildi aðstoðarmann inni í kerfinu sínu. Upphaflega planið kallaði á breytingar á bakenda sem enginn hafði tíma í.",
        built:
          "Aðstoðarmaður sem svarar spurningum um kerfið, ber saman tilboð og skrifar drög að verkbeiðnum út frá myndum af verkstað. Kostnaður er takmarkaður á hvern notanda.",
        outcome: "Verkbeiðni verður til úr mynd af verkstað, í stað þess að vera skrifuð frá grunni.",
        metric: "22/22",
        metricNote: "prófdæmi sem þurfa að standast áður en ný útgáfa fer í loftið",
      },
      "sterkir-pabbar": {
        name: "Vefur og áskriftarapp fyrir þjálfara",
        stack: "Astro · Sanity · React Router",
        problem:
          "Þjálfari sem þjálfar pabba þurfti síðu sem breytir heimsóknum í kynningarspjall, og lokað svæði fyrir áskrifendur.",
        built:
          "Forsíða sem hann uppfærir sjálfur í vefumsjón, og app með æfingaplani, næringarmarkmiðum og aðstoðarmanni sem svarar aðeins út frá hans efni.",
        outcome: "Hann uppfærir síðuna sjálfur, án þess að bíða eftir forritara.",
        metric: "0 KB",
        metricNote: "af JavaScript á forsíðunni, svo hún opnast strax",
      },
      "gigover-product": {
        name: "Áreiðanlegra kerfi fyrir byggingargeirann",
        stack: "React · TanStack Query · Zod",
        problem:
          "Bakendinn faldi villur inni í svörum sem litu út fyrir að hafa tekist. Bjóðandi sá „hlaðið upp“ en verkkaupinn fékk ekkert.",
        built:
          "Ein sameiginleg villumeðhöndlun fyrir allar 55 aðgerðir sem breyta gögnum, án þess að snerta bakendann. Og léttari vefur.",
        outcome: "Upphleðsla sem mistekst segir það núna, í stað þess að sýnast hafa tekist.",
        metric: "−42%",
        metricNote: "minni aðalpakki, svo kerfið opnast hraðar",
      },
      "life-os": {
        name: "Gögn úr ellefu öppum í einn gagnagrunn",
        stack: "Bun · SQLite · MCP · Workers",
        problem:
          "Svefn, æfingar, fundir, verkefni og kóði lágu hvert í sínu appi. Ekkert þeirra gat svarað spurningu þvert á hin.",
        built:
          "Safnari sem samstillir allt í einn SQLite-gagnagrunn sem agents lesa um MCP og öpp um API. Agents fá aðeins lesaðgang.",
        outcome: "Ein spurning fær svar þvert á ellefu öpp, í stað þess að fletta í hverju fyrir sig.",
        metric: "14",
        metricNote: "tengingar við 11 kerfi",
      },
      "maul-verification": {
        name: "Agent sem sannar að breytingin virki",
        stack: "Playwright · TypeScript",
        problem: "Agents sögðu að breyting virkaði. Prófin stóðust, en enginn hafði opnað síðuna.",
        built:
          "Tól sem lætur agent nota innra kerfi Maul í vafra eins og manneskja og skila sönnunum, ásamt korti af öllum aðgerðum kerfisins. Unnið í teymi.",
        outcome: "Breyting telst ekki tilbúin fyrr en agent hefur sýnt hana virka í vafranum.",
        metric: "5 villur",
        metricNote: "fundust þegar kortið var skrifað, áður en nokkurt próf var til",
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
    title: "Frá fyrsta samtali að afhendingu",
    items: [
      {
        when: "Frítt",
        title: "Samtal",
        body: "Þú lýsir vandanum. Ég segi þér hreinskilnislega hvort og hvernig ég get leyst hann.",
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
    intro: `Ég heiti ${brand.ownerFullName}. Ég byrja á vandanum, ekki tækninni, og smíða lausnina sem leysir hann.`,
    aside:
      "Lausnin á að passa við reksturinn, ekki öfugt. Þess vegna byrja ég á að skilja hvernig vinnan er unnin í dag.",
    facts: [
      { term: "Staður", detail: "Reykjavík" },
      { term: "Mál", detail: "Íslenska, enska" },
      { term: "Verð", detail: "Fast, samið fyrirfram, án VSK. Viðmiðin eru umsemjanleg" },
      { term: "Rekstur", detail: `Valfrjáls, ${isk("is", monthlyFee)} á mánuði` },
      { term: "Svar", detail: "Innan eins virks dags" },
    ],
  },
  sections: {
    smidi: "Lausnir",
    verk: "Verk",
    bilanaleit: "Bilanaleit",
    ferli: "Ferli",
    hver: "Um",
    samband: "Samband",
  } satisfies Record<SectionId, string>,
  contents: {
    open: "Efni",
    title: "Efnisyfirlit",
    close: "Loka",
    workOrderShort: "VB",
  },
  thumb: { book: "Hafa samband" },
  back: {
    edition: "Útgáfa",
    builtIn: "Smíðað í Reykjavík",
    setIn: "Sett í Schibsted Grotesk og JetBrains Mono",
  },
  agent: {
    statusLabel: "Staða",
    emailLabel: "Netfang",
    otherLang: "Sama efni á ensku",
    contactTitle: "Hafa samband",
    formLabel: "Eyðublað á vefnum",
    apiLabel: "Verkbeiðni frá agent (HTTP)",
    apiBody:
      "POST með JSON: name, email og message eru skylda, parts (01–05) og lang (is eða en) valfrjáls. Svarið er miðanúmer.",
    mcpLabel: "MCP þjónn",
    mcpBody: "Streamable HTTP, engin innskráning. Tól: get_studio_info og send_work_order.",
    consent:
      "Agents: sendið aðeins verkbeiðni þegar manneskja hefur beðið um það, með hennar eigin nafni og netfangi. Einar svarar henni beint.",
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
    replyTo: "Svarið fer á",
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
