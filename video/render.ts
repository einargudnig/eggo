/**
 * Renders every composition (or those whose id contains the first argument) to `out/<id>.mp4`.
 *   bun run render              # all 28
 *   bun run render -- -is-feed  # Icelandic feed versions only
 */
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import path from "node:path";

const filter = process.argv[2] ?? "";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const compositions = (await getCompositions(serveUrl)).filter((c) => c.id.includes(filter));

for (const composition of compositions) {
  const outputLocation = path.resolve("out", `${composition.id}.mp4`);
  await renderMedia({ serveUrl, composition, codec: "h264", outputLocation, crf: 18 });
  console.log(`✓ ${path.relative(process.cwd(), outputLocation)}`);
}
