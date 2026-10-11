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
import { mailRecords } from "./infra/dns.ts";

export default Alchemy.Stack(
  "eggo",
  { providers: Cloudflare.providers(), state: Cloudflare.state() },
  Effect.gen(function* () {
    const { stage } = yield* Alchemy.Stack;

    const props = {
      compatibility: { date: "2026-10-01", flags: ["nodejs_compat"] },
      observability: { enabled: true },
      // Prerendered pages are en/index.html; serve them at /en (the URL the app links to), not /en/.
      assets: { htmlHandling: "drop-trailing-slash" as const },
      env: {
        CONTACT_TRANSPORT: "resend",
        RESEND_API_KEY: Config.Redacted("RESEND_API_KEY"),
      },
    };

    // Other stages are throwaway copies on workers.dev with Alchemy's stage-suffixed name.
    if (stage !== "prod") {
      const site = yield* Cloudflare.Website.Vite("Website", props);
      return { url: site.url };
    }

    const zone = yield* Cloudflare.Zone.Zone("Zone", { name: "eggo.is" });
    for (const { id, ...record } of mailRecords) {
      yield* Cloudflare.DNS.Record(id, { zoneId: zone.zoneId, ttl: 1, proxied: false, ...record });
    }

    const site = yield* Cloudflare.Website.Vite("Website", {
      ...props,
      name: "eggo",
      // Apex is canonical; www 301s to it. Alchemy manages the DNS records and certificates for both.
      domain: { name: "eggo.is", redirects: ["www.eggo.is"], zoneId: zone.zoneId },
    });

    return { url: site.url };
  }),
);
