/**
 * The five parts. Everything that lists parts (services list, symptom summary, work log, work-order chips) maps over `partIds`, and every per-part record is typed `Record<PartId, …>`,
 * so adding a part is a type error everywhere it's missing.
 */
export const partIds = ["01", "02", "03", "04", "05"] as const;
export type PartId = (typeof partIds)[number];

type PartMeta = {
  /** The "not sure yet" part is priced as a fixed mapping week, not "from". */
  defined: boolean;
  /** Three-letter code from the 2026.10 design, still used by the social videos (`video/`). */
  code: string;
};

export const parts = {
  "01": { code: "VEF", defined: true },
  "02": { code: "KRF", defined: true },
  "03": { code: "AGT", defined: true },
  "04": { code: "TNG", defined: true },
  "05": { code: "???", defined: false },
} as const satisfies Record<PartId, PartMeta>;

export const partDomId = (id: PartId) => `hluti-${id}`;
