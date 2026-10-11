import { en } from "./en";
import { is, type Dict } from "./is";

export const langs = ["is", "en"] as const;
export type Lang = (typeof langs)[number];

const dicts: Record<Lang, Dict> = { is, en };

export const getDict = (lang: Lang): Dict => dicts[lang];

/** `/` is Icelandic, `/en` is English. The URL segment is the optional `{-$lang}` route param. */
export const langFromParam = (param: string | undefined): Lang | null => {
  if (param === undefined) return "is";
  if (param === "en") return "en";
  return null;
};

export const paramFromLang = (lang: Lang) => (lang === "is" ? undefined : lang);
