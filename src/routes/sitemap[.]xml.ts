import { createFileRoute } from "@tanstack/react-router";
import { pageUrl } from "../content/agent";
import { langs } from "../i18n";
import { textResponse } from "../server/respond";

const alternates = langs
  .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${pageUrl(l)}"/>`)
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl("is")}"/>`)
  .join("\n");

const sitemap = () =>
  [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...langs.map((l) => `  <url>\n    <loc>${pageUrl(l)}</loc>\n${alternates}\n  </url>`),
    `</urlset>`,
    "",
  ].join("\n");

export const Route = createFileRoute("/sitemap.xml")({
  server: { handlers: { GET: () => textResponse(sitemap(), "application/xml") } },
});
