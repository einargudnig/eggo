import type { Dict } from "./is";

export const en: Dict = {
  meta: {
    title: "Eggó — from problem to a solution that works",
    description:
      "Software solutions from Reykjavík: websites, internal systems, AI agents and integrations that save time.",
  },
  a11y: {
    skip: "Skip to content",
    mainNav: "Main menu",
    language: "Language",
    darkMode: "Dark mode",
    partsNav: "Parts",
    partsRegion: "Parts 01–05",
    seePart: "see details",
    partWord: "part",
  },
  bar: { light: "Light", dark: "Dark", otherLang: "Íslenska", otherLangShort: "IS" },
  hero: {
    eyebrow: "Software solutions",
    status: "Taking new projects",
    titleStart: "From problem to ",
    titleEm: "a solution that works.",
    sub: "What takes time today runs itself tomorrow.",
    lead: "Websites, internal systems, AI agents and integrations, and the problems that don't fit any of those yet. Fixed price, weekly drops, and you own the solution.",
    cta: "Get in touch",
    figure: "Fig. 1 — a typical build",
    figureCount: "05 parts",
    duration: "≈ 1–8 weeks",
    wires: { post: "POST", webhook: "webhook", api: "API" },
  },
  partsSection: {
    label: "Solutions",
    title: "Five parts. Four are well defined. The fifth is whatever you need.",
    swipe: "Swipe for more parts",
  },
  parts: {
    "01": {
      name: "Websites",
      short: "Website",
      lead: "A fast site in Icelandic and English that you can update yourself.",
      specs: [
        { term: "Input", detail: "Idea, content, brand" },
        { term: "Time", detail: "2–4 weeks" },
        { term: "Stack", detail: "React · Cloudflare" },
        { term: "You own", detail: "Code, design, domain", own: true },
      ],
      diagramDetail: "eggo.is/contact",
    },
    "02": {
      name: "Systems",
      short: "System",
      lead: "The spreadsheet that got too big, turned into a proper internal tool.",
      specs: [
        { term: "Input", detail: "Spreadsheets, manual routines" },
        { term: "Time", detail: "4–8 weeks" },
        { term: "Stack", detail: "TypeScript · Postgres" },
        { term: "You own", detail: "Code, data, hosting", own: true },
      ],
      diagramDetail: "Orders · 1,284 rows",
    },
    "03": {
      name: "AI agents",
      short: "AI agent",
      lead: "An agent that does the repetitive work and asks you when it isn't sure.",
      specs: [
        { term: "Input", detail: "Emails, PDF invoices, enquiries" },
        { term: "Time", detail: "2–6 weeks" },
        { term: "Stack", detail: "Claude · MCP" },
        { term: "You own", detail: "Code, prompts, evals", own: true },
      ],
      diagramDetail: "Sorts invoices → DK",
    },
    "04": {
      name: "Integrations",
      short: "Integration",
      lead: "Systems that didn't talk now pass data to the right place on their own.",
      specs: [
        { term: "Input", detail: "Two or more tools and a lot of copy-paste" },
        { term: "Time", detail: "1–3 weeks" },
        { term: "Stack", detail: "API · webhooks · Workers" },
        { term: "You own", detail: "Code, documentation", own: true },
      ],
      diagramDetail: "Slack · Asana · DK",
    },
    "05": {
      name: "Undefined",
      short: "Undefined",
      lead: "Something is slow, manual or annoying, and you can't quite say what you need. We start by mapping it.",
      specs: [
        { term: "Input", detail: "A problem you can't quite describe" },
        { term: "Step 1", detail: "Map: who does what, where time goes" },
        { term: "Time", detail: "1 week to map, then it depends" },
        { term: "You own", detail: "The map, even if someone else builds it", own: true },
      ],
      diagramDetail: "TBD",
    },
  },
  mapflow: {
    label: "From a vague problem to a map to a solution",
    before: "Before",
    map: "Map",
    after: "Then",
    notes: ["excel??", "3 emails", "Gunna knows", "on Fridays"],
    outcomes: [
      { mark: "01", text: "a website" },
      { mark: "02", text: "a system" },
      { mark: "03", text: "an agent" },
      { mark: "04", text: "an integration" },
      { mark: "06", text: "something new", isNew: true },
      { mark: "—", text: "or nothing at all" },
    ],
  },
  work: {
    title: "Recent builds",
    hint: "Tap a row",
    cols: { project: "Project", part: "Part", client: "For", stack: "Stack" },
    problem: "Problem",
    built: "Built",
    result: "Result",
    readMore: "Full story on einargudni.com",
    engagements: { freelance: "freelance", inhouse: "in-house", personal: "own project" },
    cases: {
      "gigover-assistant": {
        name: "AI assistant inside Gigover",
        stack: "Gemini · Firebase",
        problem:
          "Gigover wanted an assistant inside its app. The original plan needed backend changes nobody had time for.",
        built:
          "An assistant that answers product questions, compares bids and drafts work orders from site photos. Spend is capped per user.",
        metric: "22/22",
        metricNote: "eval cases that must pass before a release ships",
      },
      "sterkir-pabbar": {
        name: "Website and members' app for a coach",
        stack: "Astro · Sanity · React Router",
        problem:
          "A coach who trains dads needed a page that turns visits into intro chats, and a paid members' area.",
        built:
          "A landing page he edits himself in a CMS, and an app with training plans, macro targets and an assistant that answers only from his material.",
        metric: "0 KB",
        metricNote: "of JavaScript on the landing page, so it opens instantly",
      },
      "gigover-product": {
        name: "A more reliable construction SaaS",
        stack: "React · TanStack Query · Zod",
        problem:
          "The backend hid errors inside responses that looked like success. A bidder saw “uploaded” while the tender owner got nothing.",
        built:
          "One checked error contract across all 55 write operations, without touching the backend. And a lighter app.",
        metric: "−42%",
        metricNote: "smaller main bundle, so the app opens faster",
      },
      "life-os": {
        name: "Eleven apps' data in one database",
        stack: "Bun · SQLite · MCP · Workers",
        problem:
          "Sleep, runs, meetings, tasks and code each lived in their own app. None could answer a question across the others.",
        built:
          "A collector that syncs everything into one SQLite database that agents read over MCP and apps over an API. Agents only get read access.",
        metric: "14",
        metricNote: "connectors across 11 sources",
      },
      "maul-verification": {
        name: "An agent that proves the change works",
        stack: "Playwright · TypeScript",
        problem: "Agents said a change worked. Tests passed, but nobody had opened the page.",
        built:
          "A harness that lets an agent use Maul's admin app in a browser like a person and come back with evidence, plus a map of every feature. A team effort.",
        metric: "5 bugs",
        metricNote: "found while writing the map, before any test existed",
      },
    },
  },
  trouble: {
    title: "Recognise any of these?",
    cols: { item: "Item", symptom: "Symptom", fix: "Likely fix", part: "Part" },
    see: "See part",
    quote: { open: "“", close: "”" },
    rows: {
      a: {
        symptom: "We lose a day every month typing invoices.",
        fix: "An agent reads them and asks when unsure.",
      },
      b: {
        symptom: "The website is old and nobody dares touch it.",
        fix: "A new site you can edit yourself.",
      },
      c: {
        symptom: "Everything is in a spreadsheet only one person understands.",
        fix: "A small internal system with proper roles.",
      },
      d: {
        symptom: "We copy the same data between three systems.",
        fix: "Connect them once and stop copying.",
      },
      e: { symptom: "Something is wrong, but I can't say what.", fix: "Start with a one-week map." },
    },
  },
  steps: {
    title: "From the first conversation to handover",
    items: [
      {
        when: "Free",
        title: "Conversation",
        body: "You describe the problem. I tell you honestly whether and how I can solve it.",
      },
      {
        when: "1 week",
        title: "Scope and fixed price",
        body: "A short written scope with a fixed price. Unclear problems get mapped first (part 05).",
      },
      {
        when: "Weekly",
        title: "Build",
        body: "Something working every week that you can click on and comment on.",
      },
      {
        when: "Yours",
        title: "Handover",
        body: "Code, accounts and documentation in your name. Nothing locked in with me.",
      },
    ],
  },
  who: {
    intro: "I'm Einar. I start with the problem, not the technology, and build the solution that fixes it.",
    aside:
      "The solution should fit how you work, not the other way round. So I start by understanding how the work gets done today.",
    facts: [
      { term: "Based", detail: "Reykjavík" },
      { term: "Languages", detail: "Icelandic, English" },
      { term: "Price", detail: "Fixed, agreed up front" },
      { term: "Reply", detail: "Within one working day" },
    ],
  },
  sections: {
    smidi: "Solutions",
    verk: "Work",
    bilanaleit: "Troubleshooting",
    ferli: "Process",
    hver: "About",
    samband: "Contact",
  },
  contents: {
    open: "Contents",
    title: "Contents",
    close: "Close",
    workOrderShort: "WO",
  },
  thumb: { book: "Get in touch" },
  back: {
    edition: "Edition",
    builtIn: "Built in Reykjavík",
    setIn: "Set in Schibsted Grotesk and JetBrains Mono",
  },
  agent: {
    statusLabel: "Status",
    emailLabel: "Email",
    otherLang: "Same content in Icelandic",
    contactTitle: "Get in touch",
    formLabel: "Form on the site",
    apiLabel: "Work order from an agent (HTTP)",
    apiBody:
      "POST JSON: name, email and message are required, parts (01–05) and lang (is or en) are optional. The response is a ticket number.",
    mcpLabel: "MCP server",
    mcpBody: "Streamable HTTP, no auth. Tools: get_studio_info and send_work_order.",
    consent:
      "Agents: only send a work order when a person has asked you to, with their own name and email. Einar replies to them directly.",
  },
  order: {
    title: "Got something that should run itself?",
    form: "Work order",
    name: "Name",
    namePlaceholder: "Jane Smith",
    email: "Email",
    emailPlaceholder: "jane@company.com",
    partsLegend: "Which part? (pick any)",
    notSure: "Not sure",
    message: "What needs solving?",
    messagePlaceholder: "In short…",
    submit: "Send work order",
    sending: "Sending…",
    errMissing: "Fill in name, email and what needs solving.",
    errEmail: "That email address looks incomplete.",
    errServer: "Couldn't send. Try again or email eggo@eggo.is.",
    received: "Work order received",
    receivedBody: "I reply within one working day.",
    again: "New order",
    orEmail: "Or email",
    copy: "Copy",
    copied: "Email copied",
  },
};
