/**
 * The site as Markdown, for agents and LLM crawlers. Built from the same dictionaries as the
 * pages, so `/index.md`, `/en.md` and `/llms.txt` never drift from what people see.
 */
import { getDict, type Lang } from "../i18n";
import { brand } from "./brand";
import { partIds } from "./parts";
import { caseIds, cases, clientLabel, troubleIds, troubles } from "./work";

export const pageUrl = (lang: Lang) => (lang === "is" ? `${brand.url}/` : `${brand.url}/en`);
export const markdownUrl = (lang: Lang) => `${brand.url}${lang === "is" ? "/index.md" : "/en.md"}`;
export const apiUrl = `${brand.url}/api/work-order`;
export const mcpUrl = `${brand.url}/mcp`;

const list = (items: readonly string[]) => items.map((item) => `- ${item}`).join("\n");

export const siteMarkdown = (lang: Lang) => {
  const t = getDict(lang);
  const other: Lang = lang === "is" ? "en" : "is";

  const parts = partIds.map((id) => {
    const part = t.parts[id];
    const specs = part.specs.map((s) => `${s.term}: ${s.detail}`);
    return `### ${id} · ${part.name}\n\n${part.lead}\n\n${list(specs)}`;
  });

  const work = caseIds.map((id) => {
    const c = t.work.cases[id];
    const part = cases[id].part;
    return [
      `### ${c.name}`,
      "",
      list([
        `${t.work.cols.client}: ${clientLabel(id, t.work.engagements)}`,
        `${t.work.cols.part}: ${part} · ${t.parts[part].name}`,
        `${t.work.cols.stack}: ${c.stack}`,
        `${t.work.problem}: ${c.problem}`,
        `${t.work.built}: ${c.built}`,
        `${t.work.result}: ${c.metric} (${c.metricNote})`,
        `${t.work.readMore}: ${cases[id].url}`,
      ]),
    ].join("\n");
  });

  const trouble = troubleIds.map((id) => {
    const row = t.trouble.rows[id];
    const part = troubles[id];
    return `${t.trouble.quote.open}${row.symptom}${t.trouble.quote.close} → ${row.fix} (${part} · ${t.parts[part].name})`;
  });

  const steps = t.steps.items.map((s, i) => `${i + 1}. **${s.title}** (${s.when}): ${s.body}`);
  const facts = t.who.facts.map((f) => `${f.term}: ${f.detail}`);

  return [
    `# ${t.meta.title}`,
    "",
    `> ${t.meta.description}`,
    "",
    t.hero.lead,
    "",
    list([
      `${t.agent.statusLabel}: ${t.hero.status}`,
      `${t.agent.emailLabel}: ${brand.email}`,
      ...facts,
      `${t.agent.otherLang}: ${markdownUrl(other)}`,
    ]),
    "",
    `## ${t.sections.smidi}`,
    "",
    t.partsSection.title,
    "",
    parts.join("\n\n"),
    "",
    `## ${t.work.title}`,
    "",
    work.join("\n\n"),
    "",
    `## ${t.trouble.title}`,
    "",
    list(trouble),
    "",
    `## ${t.steps.title}`,
    "",
    steps.join("\n"),
    "",
    `## ${t.sections.hver}`,
    "",
    `${t.who.intro} ${t.who.aside}`,
    "",
    `## ${t.agent.contactTitle}`,
    "",
    list([
      `${t.agent.emailLabel}: ${brand.email}`,
      `${t.agent.formLabel}: ${pageUrl(lang)}#order`,
      `${t.agent.apiLabel}: \`POST ${apiUrl}\`. ${t.agent.apiBody}`,
      `${t.agent.mcpLabel}: \`${mcpUrl}\`. ${t.agent.mcpBody}`,
    ]),
    "",
    t.agent.consent,
    "",
  ].join("\n");
};

/** https://llmstxt.org: a short index pointing agents at the Markdown pages and the ways to act. */
export const llmsTxt = () => {
  const t = getDict("en");
  return [
    `# ${brand.name}`,
    "",
    `> ${t.meta.description} Run by ${brand.ownerFullName}: the person you talk to is the person who writes the code.`,
    "",
    t.hero.lead,
    "",
    list([
      `${t.agent.statusLabel}: ${t.hero.status}`,
      `${t.agent.emailLabel}: ${brand.email}`,
      ...t.who.facts.map((f) => `${f.term}: ${f.detail}`),
      `Services: ${partIds.map((id) => `${id} ${t.parts[id].name}`).join(", ")}`,
    ]),
    "",
    "## Pages",
    "",
    list([
      `[Eggó in English](${markdownUrl("en")}): services, recent work, process, contact`,
      `[Eggó á íslensku](${markdownUrl("is")}): the same content in Icelandic (the source language)`,
    ]),
    "",
    "## Acting for a person",
    "",
    list([
      `[Work order API](${apiUrl}): \`POST\` JSON \`{ "name", "email", "message", "parts"?, "lang"? }\`. Returns \`{ "ticket" }\`.`,
      `[MCP server](${mcpUrl}): Streamable HTTP, no auth. Tools: \`get_studio_info\`, \`send_work_order\`.`,
    ]),
    "",
    t.agent.consent,
    "",
    "## Optional",
    "",
    list([`[Full text, both languages](${brand.url}/llms-full.txt)`, `[Sitemap](${brand.url}/sitemap.xml)`]),
    "",
  ].join("\n");
};

/** schema.org graph for search engines and agents: the studio, its owner, the site and the five services. */
export const structuredData = (lang: Lang) => {
  const t = getDict(lang);
  const studio = `${brand.url}/#studio`;
  const owner = `${brand.url}/#owner`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": studio,
        name: brand.name,
        url: pageUrl(lang),
        description: t.meta.description,
        slogan: `${t.hero.titleStart}${t.hero.titleEm}`,
        email: brand.email,
        image: `${brand.url}/og-${lang}.png`,
        logo: `${brand.url}/logo-social.png`,
        founder: { "@id": owner },
        address: { "@type": "PostalAddress", addressLocality: "Reykjavík", addressCountry: "IS" },
        areaServed: [{ "@type": "Country", name: "Iceland" }, "Worldwide"],
        knowsLanguage: ["is", "en"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: t.sections.smidi,
          itemListElement: partIds.map((id) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: t.parts[id].name, description: t.parts[id].lead },
          })),
        },
        potentialAction: {
          "@type": "CommunicateAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: apiUrl,
            httpMethod: "POST",
            contentType: "application/json",
          },
        },
      },
      {
        "@type": "Person",
        "@id": owner,
        name: brand.ownerFullName,
        url: brand.ownerSite,
        sameAs: [brand.ownerSite, brand.github],
        worksFor: { "@id": studio },
      },
      {
        "@type": "WebSite",
        "@id": `${brand.url}/#website`,
        url: `${brand.url}/`,
        name: brand.name,
        inLanguage: ["is", "en"],
        publisher: { "@id": studio },
      },
    ],
  };
};

export const llmsFullTxt = () => `${siteMarkdown("en")}\n---\n\n${siteMarkdown("is")}`;
