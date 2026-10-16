/**
 * Prerender can swallow render errors and still write a 200 page (seen with an uncompiled StyleX call).
 * This fails the build if a prerendered page is missing its content or carries a React error marker.
 */
import { readFileSync } from "node:fs";

const pages: Record<string, { lang: string; h1: string }> = {
  "dist/client/index.html": { lang: "is", h1: "Hugbúnaður fyrir" },
  "dist/client/en/index.html": { lang: "en", h1: "Software for" },
};

let failed = false;
for (const [file, expect] of Object.entries(pages)) {
  const html = readFileSync(file, "utf8");
  const problems = [
    !html.includes(`<html lang="${expect.lang}"`) && `missing <html lang="${expect.lang}">`,
    !html.includes(expect.h1) && `missing hero heading "${expect.h1}"`,
    html.includes("<!--$!-->") && "React error boundary marker (a component threw during render)",
    !/rel="stylesheet" href="\/assets\/[^"]+\.css"/.test(html) && "missing built stylesheet link",
  ].filter(Boolean);
  for (const p of problems) console.error(`${file}: ${p}`);
  if (problems.length) failed = true;
}
if (failed) process.exit(1);
console.log(`prerender ok: ${Object.keys(pages).length} pages`);
