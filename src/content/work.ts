import type { PartId } from "./parts";

/** Rows in the work index (§2). Copy lives in the dictionaries under `work.cases`. */
export const caseIds = [
  "gigover-assistant",
  "sterkir-pabbar",
  "gigover-product",
  "life-os",
  "maul-verification",
] as const;
export type CaseId = (typeof caseIds)[number];

/** Freelance work names the client; in-house and personal work are labelled as such (`work.engagements`). */
export type Engagement = "freelance" | "inhouse" | "personal";

type Case = {
  part: PartId;
  engagement: Engagement;
  /** Proper noun, so it isn't translated. */
  client: string;
  /** The long write-up on Einar's own site. */
  url: string;
};

const writeUp = (slug: string) => `https://einargudni.com/use-cases/${slug}`;

export const cases = {
  "gigover-assistant": {
    part: "03",
    engagement: "freelance",
    client: "Gigover",
    url: writeUp("gigover-assistant"),
  },
  "sterkir-pabbar": {
    part: "01",
    engagement: "freelance",
    client: "Sterkir pabbar",
    url: writeUp("sterkir-pabbar"),
  },
  "gigover-product": {
    part: "02",
    engagement: "freelance",
    client: "Gigover",
    url: writeUp("gigover-product"),
  },
  "life-os": { part: "04", engagement: "personal", client: "life-os", url: writeUp("life-os") },
  "maul-verification": {
    part: "03",
    engagement: "inhouse",
    client: "Maul",
    url: writeUp("maul-admin-verification"),
  },
} as const satisfies Record<CaseId, Case>;

/** What the "For" column shows: the client's name, the employer marked in-house, or "own project". */
export const clientLabel = (id: CaseId, engagements: Record<Engagement, string>) => {
  const { engagement, client } = cases[id];
  if (engagement === "freelance") return client;
  if (engagement === "inhouse") return `${client} · ${engagements.inhouse}`;
  return engagements.personal;
};

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
