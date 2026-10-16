import { createFileRoute } from "@tanstack/react-router";
import { pageUrl, type Page } from "../content/agent";
import { langs } from "../i18n";
import { textResponse } from "../server/respond";

const pages: readonly Page[] = ["home", "verk"];

const alternates = (page: Page) =>
  langs
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${pageUrl(l, page)}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl("is", page)}"/>`)
    .join("\n");

const sitemap = () =>
  [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...pages.flatMap((page) =>
      langs.map((l) => `  <url>\n    <loc>${pageUrl(l, page)}</loc>\n${alternates(page)}\n  </url>`),
    ),
    `</urlset>`,
    "",
  ].join("\n");

export const Route = createFileRoute("/sitemap.xml")({
  server: { handlers: { GET: () => textResponse(sitemap(), "application/xml") } },
});
