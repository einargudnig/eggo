const CACHE = "public, max-age=300, s-maxage=3600";

/** A cacheable text response for the agent-facing files (llms.txt, Markdown mirrors, sitemap). */
export const textResponse = (body: string, contentType: string) =>
  new Response(body, {
    headers: {
      "content-type": `${contentType}; charset=utf-8`,
      "cache-control": CACHE,
      "access-control-allow-origin": "*",
    },
  });
