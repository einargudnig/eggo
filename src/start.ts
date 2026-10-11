import { createMiddleware, createStart } from "@tanstack/react-start";
import { logToHub } from "./server/hubLog";

const hubErrorLogger = createMiddleware().server(async ({ next, pathname }) => {
  try {
    const result = await next();
    if (result.response.status >= 500) {
      await logToHub({
        level: "error",
        event: "request.5xx",
        fields: { path: pathname, status: result.response.status },
      });
    }
    return result;
  } catch (error) {
    await logToHub({
      level: "error",
      event: "server.error",
      fields: { path: pathname, message: error instanceof Error ? error.message : String(error) },
    });
    throw error;
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [hubErrorLogger],
}));
