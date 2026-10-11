// Optional secrets that `wrangler types` can't see: set only in prod, via alchemy.run.ts.
declare namespace Cloudflare {
  interface Env {
    LIFEOS_INGEST_TOKEN?: string;
    LIFEOS_HUB_URL?: string;
  }
}
