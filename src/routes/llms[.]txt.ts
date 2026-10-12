import { createFileRoute } from "@tanstack/react-router";
import { llmsTxt } from "../content/agent";
import { textResponse } from "../server/respond";

export const Route = createFileRoute("/llms.txt")({
  server: { handlers: { GET: () => textResponse(llmsTxt(), "text/plain") } },
});
