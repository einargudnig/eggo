import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";
import { markdownUrl, pageUrl, structuredData } from "../content/agent";
import { brand } from "../content/brand";
import { getDict, langFromParam } from "../i18n";

const ogLocale = { is: "is_IS", en: "en_GB" } as const;

export const Route = createFileRoute("/{-$lang}")({
  beforeLoad: ({ params }) => {
    const lang = langFromParam(params.lang);
    if (!lang) throw notFound();
    return { lang, t: getDict(lang) };
  },
  head: ({ params }) => {
    const lang = langFromParam(params.lang) ?? "is";
    const other = lang === "is" ? "en" : "is";
    const t = getDict(lang);
    const image = `${brand.url}/og-${lang}.png`;
    return {
      meta: [
        { title: t.meta.title },
        { name: "description", content: t.meta.description },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: brand.name },
        { property: "og:title", content: t.meta.title },
        { property: "og:description", content: t.meta.description },
        { property: "og:url", content: pageUrl(lang) },
        { property: "og:image", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: `${t.hero.titleStart}${t.hero.titleEm}` },
        { property: "og:locale", content: ogLocale[lang] },
        { property: "og:locale:alternate", content: ogLocale[other] },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: t.meta.title },
        { name: "twitter:description", content: t.meta.description },
        { name: "twitter:image", content: image },
        { "script:ld+json": structuredData(lang) },
      ],
      links: [
        { rel: "canonical", href: pageUrl(lang) },
        { rel: "alternate", hrefLang: "is", href: pageUrl("is") },
        { rel: "alternate", hrefLang: "en", href: pageUrl("en") },
        { rel: "alternate", hrefLang: "x-default", href: pageUrl("is") },
        { rel: "alternate", type: "text/markdown", href: markdownUrl(lang) },
      ],
    };
  },
  component: Outlet,
});
