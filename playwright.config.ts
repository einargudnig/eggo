import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
/** Set to run the suite against a deployed copy instead of a local build, e.g. an Alchemy staging URL. */
const remote = process.env["PLAYWRIGHT_BASE_URL"];

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: remote ?? `http://localhost:${PORT}`, reducedMotion: "reduce" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
  ...(remote
    ? {}
    : {
        webServer: {
          command: `bun run build && bun x vite preview --port ${PORT} --strictPort`,
          url: `http://localhost:${PORT}`,
          timeout: 180_000,
          reuseExistingServer: !process.env["CI"],
        },
      }),
});
