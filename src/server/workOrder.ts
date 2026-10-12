import * as z from "zod/mini";
import { partIds } from "../content/parts";

/** Shared by the form (client-side checks) and the server function (the real check). `zod/mini` keeps the client bundle small. */
export const workOrderSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(1), z.maxLength(200)),
  email: z.string().check(z.trim(), z.email(), z.maxLength(320)),
  message: z.string().check(z.trim(), z.minLength(1), z.maxLength(5000)),
  parts: z.array(z.enum(partIds)).check(z.maxLength(partIds.length)),
  lang: z.enum(["is", "en"]),
});

export type WorkOrder = z.infer<typeof workOrderSchema>;
export type WorkOrderField = "name" | "email" | "message";

/** Agents calling the API or MCP tool may leave out `parts` and `lang`; everything else is checked as strictly as the form. */
export const parseAgentWorkOrder = (input: unknown) =>
  workOrderSchema.safeParse(
    typeof input === "object" && input !== null && !Array.isArray(input)
      ? { parts: [], lang: "en", ...input }
      : input,
  );
