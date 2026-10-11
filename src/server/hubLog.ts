import { env } from "cloudflare:workers";

const DEFAULT_HUB_URL = "https://einars-macbook-pro.tail5588b1.ts.net";
const PROJECT = "eggo";

type Level = "info" | "warn" | "error";

export interface HubEvent {
  event: string;
  level?: Level;
  ts?: number;
  fields?: Record<string, unknown>;
}

/** Ships structured events to the life-os log hub (POST /v1/logs). Best-effort: never throws. */
export const logToHub = async (events: HubEvent | HubEvent[]): Promise<void> => {
  const { LIFEOS_INGEST_TOKEN: token, LIFEOS_HUB_URL: hubUrl = DEFAULT_HUB_URL } = env;
  // Unset locally and on throwaway stages, where logging is a no-op.
  if (!token) return;
  const list = (Array.isArray(events) ? events : [events]).map(({ event, level, ts, fields }) => ({
    event,
    level: level ?? "info",
    ts: ts ?? Date.now(),
    fields,
  }));
  try {
    await fetch(`${hubUrl}/v1/logs`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ project: PROJECT, events: list }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Logging must never break a request.
  }
};
