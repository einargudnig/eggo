/** Homepage sections in page order. The nav reads from here, so a new section only needs an entry and a dictionary name. */
export const sectionIds = ["smidi", "verk", "ferli", "hver", "samband"] as const;
export type SectionId = (typeof sectionIds)[number];

/** Sections linked from the nav. On phones the nav collapses to the language and theme controls. */
export const navSections = ["smidi", "verk", "ferli", "samband"] as const satisfies readonly SectionId[];
