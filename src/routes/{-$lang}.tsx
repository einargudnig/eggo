import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";
import { getDict, langFromParam } from "../i18n";

export const Route = createFileRoute("/{-$lang}")({
  beforeLoad: ({ params }) => {
    const lang = langFromParam(params.lang);
    if (!lang) throw notFound();
    return { lang, t: getDict(lang) };
  },
  head: ({ params }) => {
    const t = getDict(langFromParam(params.lang) ?? "is");
    return {
      meta: [{ title: t.meta.title }, { name: "description", content: t.meta.description }],
      links: [
        { rel: "alternate", hrefLang: "is", href: "https://eggo.is/" },
        { rel: "alternate", hrefLang: "en", href: "https://eggo.is/en" },
        { rel: "alternate", hrefLang: "x-default", href: "https://eggo.is/" },
      ],
    };
  },
  component: Outlet,
});
