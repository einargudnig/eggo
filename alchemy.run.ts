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
import * as Option from "effect/Option";
import { mailRecords } from "./infra/dns.ts";

export default Alchemy.Stack(
  "eggo",
  { providers: Cloudflare.providers(), state: Cloudflare.state() },
  Effect.gen(function* () {
    const { stage } = yield* Alchemy.Stack;
    // Optional: without it the Worker skips life-os hub logging (src/server/hubLog.ts).
    const hubToken = yield* Config.option(Config.Redacted("LIFEOS_INGEST_TOKEN"));
    // Optional: without it work orders reach outreach only through the inbox email (src/server/outreachIntake.ts).
    const intakeToken = yield* Config.option(Config.Redacted("OUTREACH_INTAKE_TOKEN"));
    // Optional: without both there are no inbox push alerts (inbox/worker.ts).
    const imapPassword = yield* Config.option(Config.Redacted("SPACEMAIL_PASSWORD"));
    const ntfyTopic = yield* Config.option(Config.Redacted("NTFY_TOPIC"));

    const props = {
      compatibility: { date: "2026-10-01", flags: ["nodejs_compat"] },
      observability: { enabled: true },
      // Prerendered pages are en/index.html; serve them at /en (the URL the app links to), not /en/.
      assets: { htmlHandling: "drop-trailing-slash" as const },
      env: {
        CONTACT_TRANSPORT: "resend",
        // Work orders per visitor IP, so a script can't flood the inbox or the Resend quota. Deploy-only: not in wrangler.jsonc.
        ORDER_LIMIT: Cloudflare.Workers.RateLimit("ORDER_LIMIT", {
          namespaceId: 1001,
          simple: { limit: 3, period: 60 },
        }),
        RESEND_API_KEY: Config.Redacted("RESEND_API_KEY"),
        ...(Option.isSome(hubToken) ? { LIFEOS_INGEST_TOKEN: hubToken.value } : {}),
        ...(Option.isSome(intakeToken) && stage === "prod"
          ? { OUTREACH_INTAKE_TOKEN: intakeToken.value }
          : {}),
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

    // Reads the Spacemail inbox once a minute and pushes new mail to ntfy. Never sends or deletes mail.
    if (Option.isSome(imapPassword) && Option.isSome(ntfyTopic)) {
      yield* Cloudflare.Workers.Worker("Inbox", {
        name: "eggo-inbox",
        main: "./inbox/worker.ts",
        compatibility: props.compatibility,
        observability: { enabled: true },
        crons: ["*/10 * * * *"],
        env: {
          IMAP_HOST: "mail.spacemail.com",
          IMAP_USER: "eggo@eggo.is",
          IMAP_PASSWORD: imapPassword.value,
          NTFY_TOPIC: ntfyTopic.value,
        },
      });
    }

    return { url: site.url };
  }),
);
