import * as z from "zod/mini";
import { partIds } from "../content/parts";

/** Shared by the form (client-side checks) and the server function (the real check). `zod/mini` keeps the client bundle small. */
export const workOrderSchema = z.object({
  // Control characters (newlines included) go: the name ends up in the email subject and the push alert title.
  name: z.string().check(
    z.overwrite((s) => s.replace(/\p{Cc}+/gu, " ")),
    z.trim(),
    z.minLength(1),
    z.maxLength(200),
  ),
  email: z.string().check(z.trim(), z.email(), z.maxLength(320)),
  message: z.string().check(z.trim(), z.minLength(1), z.maxLength(5000)),
  parts: z.array(z.enum(partIds)).check(z.maxLength(partIds.length)),
  lang: z.enum(["is", "en"]),
  /** Honeypot: the form hides it from people and assistive tech, so anything in it came from a bot. */
  website: z.optional(z.string().check(z.maxLength(2000))),
});

export type WorkOrder = z.infer<typeof workOrderSchema>;
export type WorkOrderField = "name" | "email" | "message";

/** True when the hidden honeypot field was filled in. */
export const isHoneypotHit = (order: WorkOrder) => Boolean(order.website?.trim());

/** Agents calling the API or MCP tool may leave out `parts` and `lang`; everything else is checked as strictly as the form. */
export const parseAgentWorkOrder = (input: unknown) =>
  workOrderSchema.safeParse(
    typeof input === "object" && input !== null && !Array.isArray(input)
      ? { parts: [], lang: "en", ...input }
      : input,
  );
