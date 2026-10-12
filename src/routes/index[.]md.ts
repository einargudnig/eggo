import { createFileRoute } from "@tanstack/react-router";
import { siteMarkdown } from "../content/agent";
import { textResponse } from "../server/respond";

export const Route = createFileRoute("/index.md")({
  server: { handlers: { GET: () => textResponse(siteMarkdown("is"), "text/markdown") } },
});
