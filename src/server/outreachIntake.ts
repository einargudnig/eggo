import type { HubEvent } from "./hubLog";
import type { Channel } from "./deliverWorkOrder";
import type { WorkOrder } from "./workOrder";

const DEFAULT_OUTREACH_URL = "https://outreach.einargudni.com";

/**
 * Hands a delivered work order to the outreach app, which makes it a lead (POST /api/intake/work-order).
 * Best-effort: never throws. If it fails, outreach still picks the order up from the inbox email.
 */
export const sendToOutreach = async (
  order: WorkOrder,
  ticket: string,
  channel: Channel,
  env: { OUTREACH_INTAKE_TOKEN?: string; OUTREACH_URL?: string },
  log: (event: HubEvent) => Promise<void>,
): Promise<void> => {
  const { OUTREACH_INTAKE_TOKEN: token, OUTREACH_URL: url = DEFAULT_OUTREACH_URL } = env;
  // Unset locally and on throwaway stages, so test orders never reach the real pipeline.
  if (!token) return;
  try {
    const res = await fetch(`${url}/api/intake/work-order`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...order, ticket, channel }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok)
      await log({ event: "outreach_intake_failed", level: "warn", fields: { ticket, status: res.status } });
  } catch (error) {
    await log({ event: "outreach_intake_failed", level: "warn", fields: { ticket, error: String(error) } });
  }
};
