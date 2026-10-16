import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";
import { getDict, langFromParam } from "../i18n";

/** Language layout: `/` is Icelandic, `/en` English, anything else a 404. Each page sets its own head (`content/head.ts`). */
export const Route = createFileRoute("/{-$lang}")({
  beforeLoad: ({ params }) => {
    const lang = langFromParam(params.lang);
    if (!lang) throw notFound();
    return { lang, t: getDict(lang) };
  },
  component: Outlet,
});
