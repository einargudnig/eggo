import { getDict, type Lang } from "../i18n";
import { markdownUrl, pageUrl, structuredData, type Page } from "./agent";
import { brand } from "./brand";

const ogLocale = { is: "is_IS", en: "en_GB" } as const;

/** Title, description, share card, canonical and language alternates for one page in one language. */
export const pageHead = (lang: Lang, page: Page) => {
  const other = lang === "is" ? "en" : "is";
  const t = getDict(lang);
  const { title, description } = page === "home" ? t.meta : t.workPage.meta;
  const image = `${brand.url}/og-${lang}.png`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: brand.name },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: pageUrl(lang, page) },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${t.hero.titleStart}${t.hero.titleEm}` },
      { property: "og:locale", content: ogLocale[lang] },
      { property: "og:locale:alternate", content: ogLocale[other] },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { "script:ld+json": structuredData(lang) },
    ],
    links: [
      { rel: "canonical", href: pageUrl(lang, page) },
      { rel: "alternate", hrefLang: "is", href: pageUrl("is", page) },
      { rel: "alternate", hrefLang: "en", href: pageUrl("en", page) },
      { rel: "alternate", hrefLang: "x-default", href: pageUrl("is", page) },
      { rel: "alternate", type: "text/markdown", href: markdownUrl(lang) },
    ],
  };
};
