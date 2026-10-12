import { createServerFn } from "@tanstack/react-start";
import { deliverWorkOrder } from "./deliverWorkOrder";
import { workOrderSchema } from "./workOrder";

export const sendWorkOrder = createServerFn({ method: "POST" })
  .validator(workOrderSchema)
  .handler(({ data }) => deliverWorkOrder(data, "form"));
