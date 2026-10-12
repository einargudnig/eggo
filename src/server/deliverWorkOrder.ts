import { brand } from "../content/brand";
import type { WorkOrder } from "./workOrder";

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

/** Emails a validated work order to the inbox and returns its ticket number. Throws if sending fails. */
export const deliverWorkOrder = async (order: WorkOrder, channel: Channel) => {
  // Imported lazily: server routes are bundled into every page, and the build prerenders outside workerd.
  const { env } = await import("cloudflare:workers");
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
  if (error) throw new Error(`Resend: ${error.message}`);
  return { ticket };
};
