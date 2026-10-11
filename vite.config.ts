import { cloudflare } from "@cloudflare/vite-plugin";
import stylex from "@stylexjs/unplugin/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // Alchemy injects its own Cloudflare plugin when it deploys (alchemy.run.ts); this one is for dev and preview.
    process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED === "1"
      ? null
      : cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
    }),
    stylex({ useCSSLayers: true, devPersistToDisk: true }),
    viteReact(),
  ],
});
