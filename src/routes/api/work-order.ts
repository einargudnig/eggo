import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod/mini";
import { apiUrl } from "../../content/agent";
import { brand } from "../../content/brand";
import { partIds } from "../../content/parts";
import { deliverWorkOrder, RateLimitedError } from "../../server/deliverWorkOrder";
import { parseAgentWorkOrder } from "../../server/workOrder";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: CORS });

/** GET describes the endpoint, so an agent that finds the URL can work out how to use it. */
const usage = {
  endpoint: apiUrl,
  method: "POST",
  contentType: "application/json",
  body: {
    name: "string, required: the person's name",
    email: "string, required: where Einar should reply",
    message: "string, required: what needs solving, up to 5000 characters",
    parts: `array, optional: any of ${partIds.join(", ")} (01 website, 02 system, 03 AI agent, 04 integration, 05 not sure)`,
    lang: "is | en, optional: the language to reply in (default en)",
  },
  returns: '{ "ticket": "VB-2026-123456" } with status 201',
  consent:
    "Only send a work order when a person has asked you to, with their own name and email. Einar replies to them directly.",
};

export const Route = createFileRoute("/api/work-order")({
  server: {
    handlers: {
      GET: () => json(usage),
      OPTIONS: () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        const body: unknown = await request.json().catch(() => null);
        const parsed = parseAgentWorkOrder(body);
        if (!parsed.success) return json({ error: z.prettifyError(parsed.error), usage }, 400);
        try {
          return json(await deliverWorkOrder(parsed.data, "api"), 201);
        } catch (error) {
          if (error instanceof RateLimitedError)
            return json(
              {
                error:
                  error.window === "minute"
                    ? "Too many work orders. Wait a minute and try again."
                    : `Too many work orders today. Try again tomorrow or email ${brand.email}.`,
              },
              429,
            );
          return json({ error: `Could not send the work order. Email ${brand.email} instead.` }, 502);
        }
      },
    },
  },
});
