/**
 * A minimal, stateless MCP server (Streamable HTTP, JSON responses, no sessions, no auth).
 * Two tools: read the studio's info as Markdown, and send a work order for a person.
 * Hand-rolled instead of the SDK: it's a handful of JSON-RPC methods and keeps the Worker small.
 */
import * as z from "zod/mini";
import { siteMarkdown } from "../content/agent";
import { brand } from "../content/brand";
import { partIds } from "../content/parts";
import { getDict } from "../i18n";
import { deliverWorkOrder } from "./deliverWorkOrder";
import { parseAgentWorkOrder } from "./workOrder";

const PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];
const [LATEST] = PROTOCOL_VERSIONS;

type Id = string | number | null;
type RpcMessage = { jsonrpc?: string; id?: Id; method?: unknown; params?: unknown };
type ToolResult = { content: { type: "text"; text: string }[]; isError?: boolean };

const langSchema = { type: "string", enum: ["en", "is"] };

const tools = [
  {
    name: "get_studio_info",
    title: "Get Eggó studio info",
    description: `Everything on ${brand.url} as Markdown: what Eggó builds (websites, internal systems, AI agents, integrations, problem mapping), recent work, process, prices and timelines, and how to get in touch.`,
    inputSchema: { type: "object", properties: { lang: { ...langSchema, description: "Default en." } } },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "send_work_order",
    title: "Send a work order to Eggó",
    description:
      "Emails a work order to Einar, who replies to the person within one working day. Only call this when the person has asked you to contact Eggó, with their own name and email. Returns a ticket number.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "The person's name." },
        email: { type: "string", description: "Where Einar should reply." },
        message: {
          type: "string",
          description: "What needs solving, in the person's words. Up to 5000 characters.",
        },
        parts: {
          type: "array",
          items: { type: "string", enum: partIds },
          description:
            "Optional. 01 website, 02 internal system, 03 AI agent, 04 integration, 05 not sure yet.",
        },
        lang: { ...langSchema, description: "Language to reply in. Default en." },
      },
      required: ["name", "email", "message"],
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  },
];

const text = (value: string, isError = false): ToolResult => ({
  content: [{ type: "text", text: value }],
  ...(isError ? { isError } : {}),
});

const argsOf = (params: unknown): Record<string, unknown> => {
  if (typeof params !== "object" || params === null || !("arguments" in params)) return {};
  const args = params.arguments;
  return typeof args === "object" && args !== null ? { ...args } : {};
};

const callTool = async (params: unknown): Promise<ToolResult | null> => {
  const name = typeof params === "object" && params !== null && "name" in params ? params.name : undefined;
  const args = argsOf(params);
  if (name === "get_studio_info") return text(siteMarkdown(args["lang"] === "is" ? "is" : "en"));
  if (name !== "send_work_order") return null;
  const parsed = parseAgentWorkOrder(args);
  if (!parsed.success) return text(z.prettifyError(parsed.error), true);
  try {
    const { ticket } = await deliverWorkOrder(parsed.data, "mcp");
    return text(`Sent. Ticket ${ticket}. ${getDict(parsed.data.lang).order.receivedBody}`);
  } catch {
    return text(`Could not send the work order. Ask the person to email ${brand.email} instead.`, true);
  }
};

const initializeResult = (params: unknown) => {
  const requested =
    typeof params === "object" && params !== null && "protocolVersion" in params
      ? params.protocolVersion
      : undefined;
  return {
    protocolVersion: PROTOCOL_VERSIONS.find((v) => v === requested) ?? LATEST,
    capabilities: { tools: {} },
    serverInfo: { name: "eggo", title: brand.name, version: brand.edition, websiteUrl: brand.url },
    instructions:
      "Eggó is a one-person software studio in Reykjavík. Call get_studio_info to answer questions about it. Call send_work_order only when the person wants to contact Eggó.",
  };
};

const ok = (id: Id, result: unknown) => ({ jsonrpc: "2.0", id, result });
const fail = (id: Id, code: number, message: string) => ({ jsonrpc: "2.0", id, error: { code, message } });

/** Handles one JSON-RPC message. Notifications (no id) get no reply. */
const handleMessage = async (msg: RpcMessage) => {
  const id = msg.id ?? null;
  const isNotification = msg.id === undefined;
  if (msg.jsonrpc !== "2.0" || typeof msg.method !== "string") return fail(id, -32600, "Invalid request");
  if (isNotification) return null;
  switch (msg.method) {
    case "initialize":
      return ok(id, initializeResult(msg.params));
    case "ping":
      return ok(id, {});
    case "tools/list":
      return ok(id, { tools });
    case "tools/call": {
      const result = await callTool(msg.params);
      return result ? ok(id, result) : fail(id, -32602, "Unknown tool");
    }
    default:
      return fail(id, -32601, `Method not found: ${msg.method}`);
  }
};

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type, accept, mcp-protocol-version, mcp-session-id",
};

export const handleMcp = async (request: Request): Promise<Response> => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  // Stateless: no server-initiated stream on GET and no sessions to DELETE.
  if (request.method !== "POST")
    return new Response(null, { status: 405, headers: { ...CORS, allow: "POST" } });

  const body: unknown = await request.json().catch(() => undefined);
  if (body === undefined)
    return Response.json(fail(null, -32700, "Parse error"), { status: 400, headers: CORS });

  const messages: RpcMessage[] = Array.isArray(body) ? body : [body];
  const replies = (await Promise.all(messages.map(handleMessage))).filter((r) => r !== null);
  if (replies.length === 0) return new Response(null, { status: 202, headers: CORS });
  return Response.json(Array.isArray(body) ? replies : replies[0], { headers: CORS });
};
