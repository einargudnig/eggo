/**
 * Deploys eggo.is to Cloudflare Workers: `bun run deploy` (stage `prod`) or
 * `bun alchemy deploy --stage <name>` for a throwaway copy.
 * Secrets are read from `.env` at deploy time. wrangler.jsonc still drives local dev and
 * `vite preview`; keep its compatibility date, flags and asset handling in step with this file.
 */
import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import { bridgeRecords, mailRecords } from "./infra/dns.ts";

export default Alchemy.Stack(
  "eggo",
  { providers: Cloudflare.providers(), state: Cloudflare.state() },
  Effect.gen(function* () {
    const { stage } = yield* Alchemy.Stack;

    const site = yield* Cloudflare.Website.Vite("Website", {
      // Production keeps the plain name; other stages get Alchemy's stage-suffixed default.
      ...(stage === "prod" ? { name: "eggo" } : {}),
      compatibility: { date: "2026-10-01", flags: ["nodejs_compat"] },
      observability: { enabled: true },
      // Prerendered pages are en/index.html; serve them at /en (the URL the app links to), not /en/.
      assets: { htmlHandling: "drop-trailing-slash" },
      env: {
        CONTACT_TRANSPORT: "resend",
        RESEND_API_KEY: Config.Redacted("RESEND_API_KEY"),
      },
    });

    if (stage !== "prod") return { url: site.url };

    // The zone only does anything once eggo.is's nameservers (set at ISNIC) point at Cloudflare.
    const zone = yield* Cloudflare.Zone.Zone("Zone", { name: "eggo.is" });
    for (const { id, ...record } of [...mailRecords, ...bridgeRecords]) {
      yield* Cloudflare.DNS.Record(id, { zoneId: zone.zoneId, ttl: 1, proxied: false, ...record });
    }

    return { url: site.url, zoneStatus: zone.status, nameServers: zone.nameServers };
  }),
);
