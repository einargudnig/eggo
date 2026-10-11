import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { Resend } from "resend";
import { workOrderSchema, type WorkOrder } from "./workOrder";

const ticketNumber = () => {
  const [random = 0] = crypto.getRandomValues(new Uint16Array(1));
  return `VB-${new Date().getFullYear()}-${(random % 9000) + 1000}`;
};

/** Plain text only: user input never goes into HTML. */
const formatBody = (order: WorkOrder, ticket: string) =>
  [
    `Verkbeiðni ${ticket}`,
    `Nafn: ${order.name}`,
    `Netfang: ${order.email}`,
    `Hlutar: ${order.parts.length ? order.parts.join(", ") : "—"}`,
    `Tungumál: ${order.lang}`,
    "",
    order.message,
  ].join("\n");

export const sendWorkOrder = createServerFn({ method: "POST" })
  .validator(workOrderSchema)
  .handler(async ({ data }) => {
    const ticket = ticketNumber();
    if (env.CONTACT_TRANSPORT === "log") {
      console.log(formatBody(data, ticket));
      return { ticket };
    }
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Eggó <onboarding@resend.dev>",
      to: "eggo@eggo.is",
      replyTo: data.email,
      subject: `Verkbeiðni ${ticket} frá ${data.name}`,
      text: formatBody(data, ticket),
    });
    if (error) throw new Error(`Resend: ${error.message}`);
    return { ticket };
  });
