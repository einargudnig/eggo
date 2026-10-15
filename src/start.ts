import { createMiddleware, createStart } from "@tanstack/react-start";
import { logToHub, type HubEvent } from "./server/hubLog";

/** After the response: a slow or unreachable hub must never hold up the visitor (it has a 3s timeout). */
const logAfterResponse = async (event: HubEvent) => {
  // Imported lazily: this module loads on every page, and the build prerenders outside workerd.
  const { waitUntil } = await import("cloudflare:workers");
  waitUntil(logToHub(event));
};

const hubErrorLogger = createMiddleware().server(async ({ next, pathname }) => {
  try {
    const result = await next();
    if (result.response.status >= 500) {
      await logAfterResponse({
        level: "error",
        event: "request.5xx",
        fields: { path: pathname, status: result.response.status },
      });
    }
    return result;
  } catch (error) {
    await logAfterResponse({
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
