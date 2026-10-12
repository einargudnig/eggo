import { createFileRoute } from "@tanstack/react-router";
import { llmsFullTxt } from "../content/agent";
import { textResponse } from "../server/respond";

export const Route = createFileRoute("/llms-full.txt")({
  server: { handlers: { GET: () => textResponse(llmsFullTxt(), "text/plain") } },
});
