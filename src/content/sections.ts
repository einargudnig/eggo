/**
 * Homepage sections in page order. The desktop nav, the phone contents sheet and the thumb bar's
 * visibility all read from here, so a new section only needs an entry and a dictionary name.
 */
export const sectionIds = ["smidi", "verk", "bilanaleit", "ferli", "hver", "samband"] as const;
export type SectionId = (typeof sectionIds)[number];

/** Sections linked from the desktop nav. The rest are reachable from the phone contents sheet. */
export const navSections = ["smidi", "verk", "bilanaleit", "samband"] as const satisfies readonly SectionId[];
