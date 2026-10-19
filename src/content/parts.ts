/**
 * The five parts. Everything that lists parts (services list, symptom summary, work log, work-order chips) maps over `partIds`, and every per-part record is typed `Record<PartId, …>`,
 * so adding a part is a type error everywhere it's missing.
 */
export const partIds = ["01", "02", "03", "04", "05"] as const;
export type PartId = (typeof partIds)[number];

type PartMeta = {
  /** The "not sure yet" part is priced as a fixed mapping week, not "from". */
  defined: boolean;
};

export const parts = {
  "01": { defined: true },
  "02": { defined: true },
  "03": { defined: true },
  "04": { defined: true },
  "05": { defined: false },
} as const satisfies Record<PartId, PartMeta>;

export const partDomId = (id: PartId) => `hluti-${id}`;
