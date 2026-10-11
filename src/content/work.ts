import type { PartId } from "./parts";

/** Rows in the work index (§2). Copy lives in the dictionaries under `work.cases`. */
export const caseIds = [
  "dk-invoices",
  "order-map",
  "restaurant-orders",
  "architect-site",
  "slack-asana",
] as const;
export type CaseId = (typeof caseIds)[number];

export const cases = {
  "dk-invoices": { part: "03", year: 2026 },
  "order-map": { part: "05", year: 2026 },
  "restaurant-orders": { part: "02", year: 2026 },
  "architect-site": { part: "01", year: 2025 },
  "slack-asana": { part: "04", year: 2025 },
} as const satisfies Record<CaseId, { part: PartId; year: number }>;

/** Rows in the troubleshooting table (§3), each pointing at the part that fixes it. */
export const troubleIds = ["a", "b", "c", "d", "e"] as const;
export type TroubleId = (typeof troubleIds)[number];

export const troubles = {
  a: "03",
  b: "01",
  c: "02",
  d: "04",
  e: "05",
} as const satisfies Record<TroubleId, PartId>;
