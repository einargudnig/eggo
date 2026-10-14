import type { PartId } from "./parts";

/**
 * Starting prices in ISK, shown on each part and in llms.txt/MCP via the dictionaries.
 * Starting points, not a rate card: every project gets its own fixed price, and these are negotiable.
 * 05 is the price of the mapping week itself.
 */
export const priceFrom = {
  "01": 200_000,
  "02": 400_000,
  "03": 300_000,
  "04": 300_000,
  "05": 290_000,
} as const satisfies Record<PartId, number>;

/** Optional monthly fee for hosting, fixes and small changes after handover. */
export const monthlyFee = 30_000;

/**
 * `200.000 kr.` in Icelandic, `ISK 200,000` in English (docs/DESIGN-SYSTEM.md, number formats).
 * Icelandic grouping comes from `de-DE` (same `.` separator): the prerender runs in workerd, whose ICU
 * has no `is` locale and silently falls back to `200,000`.
 */
export const isk = (lang: "is" | "en", amount: number) =>
  lang === "is"
    ? `${new Intl.NumberFormat("de-DE").format(amount)} kr.`
    : `ISK ${new Intl.NumberFormat("en-US").format(amount)}`;
