import { brand } from "../content/brand";
import { logToHub } from "./hubLog";
import { sendToOutreach } from "./outreachIntake";
import { isHoneypotHit, type WorkOrder } from "./workOrder";

/** Any address on eggo.is works: the domain is verified in Resend (DKIM on resend._domainkey, bounces via send.eggo.is). */
const FROM = `${brand.name} <vefur@eggo.is>`;

/** Where the order came from: the site form, the JSON endpoint, or the MCP server. */
export type Channel = "form" | "api" | "mcp";

const ticketNumber = () => {
  const [random = 0] = crypto.getRandomValues(new Uint16Array(1));
  return `VB-${new Date().getFullYear()}-${(random % 9000) + 1000}`;
};

/** Plain text only: user input never goes into HTML. */
const formatBody = (order: WorkOrder, ticket: string, channel: Channel) =>
  [
    `Verkbeiðni ${ticket}`,
    `Nafn: ${order.name}`,
    `Netfang: ${order.email}`,
    `Hlutar: ${order.parts.length ? order.parts.join(", ") : "—"}`,
    `Tungumál: ${order.lang}`,
    `Leið: ${channel}`,
    "",
    order.message,
  ].join("\n");

/** Thrown when one visitor sends too many orders in a minute. Callers turn it into a 429 or a tool error. */
export class RateLimitedError extends Error {}

const withinLimit = async (limiter: RateLimit | undefined) => {
  if (!limiter) return true;
  const { getRequestHeader } = await import("@tanstack/react-start/server");
  // Cloudflare's edge always sets it; only local dev and tests go without, and they shouldn't share one bucket.
  const ip = getRequestHeader("cf-connecting-ip");
  if (!ip) return true;
  const { success } = await limiter.limit({ key: ip });
  return success;
};

/** Emails a validated work order to the inbox, hands it to outreach, and returns its ticket number. Throws if the email fails. */
export const deliverWorkOrder = async (input: WorkOrder, channel: Channel) => {
  // A bot filled the hidden field: answer as if it worked, so it learns nothing, and send nothing.
  if (isHoneypotHit(input)) {
    console.log("Honeypot hit, work order dropped", channel);
    return { ticket: ticketNumber() };
  }
  const { website: _honeypot, ...order } = input;
  // Imported lazily: server routes are bundled into every page, and the build prerenders outside workerd.
  const { env } = await import("cloudflare:workers");
  if (!(await withinLimit(env.ORDER_LIMIT))) throw new RateLimitedError("Too many work orders");
  const ticket = ticketNumber();
  const text = formatBody(order, ticket, channel);
  if (env.CONTACT_TRANSPORT === "log") {
    console.log(text);
    return { ticket };
  }
  const { Resend } = await import("resend");
  const resend = new Resend(env.RESEND_API_KEY);
  const via = channel === "form" ? "" : ` (${channel})`;
  const { error } = await resend.emails.send({
    from: FROM,
    to: brand.email,
    replyTo: order.email,
    subject: `Verkbeiðni ${ticket} frá ${order.name}${via}`,
    text,
  });
  if (error) {
    // Details stay in the Worker logs: a thrown server-function error is serialized back to the browser.
    console.error("Resend failed", ticket, error.message);
    throw new Error("Could not send the work order");
  }
  // After the response, so a slow or broken outreach never delays or fails the visitor's order.
  const { waitUntil } = await import("cloudflare:workers");
  waitUntil(sendToOutreach(order, ticket, channel, env, logToHub));
  return { ticket };
};
