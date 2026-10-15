/**
 * The five parts, shown as routes on a road sign. Everything that lists parts (junction sign, direction
 * sign, symptom picker, work log, work-order chips) maps over `partIds`, and every per-part record is typed `Record<PartId, …>`,
 * so adding a part is a type error everywhere it's missing.
 */
export const partIds = ["01", "02", "03", "04", "05"] as const;
export type PartId = (typeof partIds)[number];

export type Direction = "ahead" | "diagonal" | "left" | "right";

type PartMeta = {
  /**
   * Which way the part's arrow points on the signs. The junction sign in the hero draws its road the same way.
   * `null` is the "?" part: no road yet, drawn as a gravel track.
   */
  arrow: Direction | null;
  /** Undefined parts are drawn dashed. */
  defined: boolean;
  /** Three-letter code from the 2026.10 design, still used by the social videos (`video/`). */
  code: string;
};

export const parts = {
  "01": { code: "VEF", arrow: "diagonal", defined: true },
  "02": { code: "KRF", arrow: "ahead", defined: true },
  "03": { code: "AGT", arrow: "left", defined: true },
  "04": { code: "TNG", arrow: "right", defined: true },
  "05": { code: "???", arrow: null, defined: false },
} as const satisfies Record<PartId, PartMeta>;

export const partDomId = (id: PartId) => `leid-${id}`;
