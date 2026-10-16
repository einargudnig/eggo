/**
 * Renders every composition (or those whose id contains the first argument): videos to `out/<id>.mp4`,
 * stills to `out/images/<id>.png`.
 *   bun run render              # everything
 *   bun run render -- -is-feed  # Icelandic feed videos only
 *   bun run render -- image-    # stills only
 */
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, renderStill } from "@remotion/renderer";
import path from "node:path";

const filter = process.argv[2] ?? "";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const compositions = (await getCompositions(serveUrl)).filter((c) => c.id.includes(filter));

for (const composition of compositions) {
  const still = composition.durationInFrames === 1;
  const output = still
    ? path.resolve("out", "images", `${composition.id.replace(/^image-/, "")}.png`)
    : path.resolve("out", `${composition.id}.mp4`);
  await (still
    ? renderStill({ serveUrl, composition, output, imageFormat: "png" })
    : renderMedia({ serveUrl, composition, codec: "h264", outputLocation: output, crf: 18 }));
  console.log(`✓ ${path.relative(process.cwd(), output)}`);
}
