/**
 * The five parts. Everything that lists parts (diagram, part nav, spec cards, troubleshooting,
 * work-order chips) maps over `partIds`, and every per-part record is typed `Record<PartId, …>`,
 * so adding a part is a type error everywhere it's missing.
 */
export const partIds = ["01", "02", "03", "04", "05"] as const;
export type PartId = (typeof partIds)[number];

type PartMeta = {
  /** Three-letter code shown next to the number: `01 · VEF`. Visual only; screen readers get the name. */
  code: string;
  /** Undefined parts are drawn dashed and hatched. */
  defined: boolean;
};

export const parts = {
  "01": { code: "VEF", defined: true },
  "02": { code: "KRF", defined: true },
  "03": { code: "AGT", defined: true },
  "04": { code: "TNG", defined: true },
  "05": { code: "???", defined: false },
} as const satisfies Record<PartId, PartMeta>;

export const partDomId = (id: PartId) => `part-${id}`;
