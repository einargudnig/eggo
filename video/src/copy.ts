import type { Lang } from "../../src/i18n";

/** Copy that only exists in the videos. Everything else comes from the site's dictionaries. */
export const videoCopy = {
  is: {
    hookCase: "Nýleg smíði",
    agentsHook: "Það les fleira en fólk vefsíðuna þína.",
    agentsBody:
      "Á eggo.is getur agent lesið allt efnið sem hreinan texta, og sent mér verkbeiðni ef manneskja biður hann um það.",
    agentsAsk: "Viltu að agents finni þig líka? Sendu mér slóðina.",
    agentsTag: "llms.txt · MCP",
  },
  en: {
    hookCase: "Recent build",
    agentsHook: "Your website has a new reader.",
    agentsBody:
      "On eggo.is an agent can read everything as plain text, and send me a work order when a person asks it to.",
    agentsAsk: "Want agents to find you too? Send me your URL.",
    agentsTag: "llms.txt · MCP",
  },
} as const satisfies Record<Lang, Record<string, string>>;
