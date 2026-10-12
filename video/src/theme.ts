import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SchibstedGrotesk";
import { Easing } from "remotion";

/**
 * The light (A1 Pappír) values of `src/design/tokens.stylex.ts`. That file can't be imported here:
 * `defineVars` only works after the StyleX compiler runs. Keep the two in step.
 */
export const colors = {
  surface: "#F2F1EC",
  surface2: "#E9E7E0",
  ink: "#111110",
  muted: "#5F5D57",
  rule: "rgb(17 17 16 / 0.13)",
  ruleStrong: "rgb(17 17 16 / 0.55)",
  grid: "rgb(17 17 16 / 0.07)",
  accent: "#E8501A",
  accentInk: "#B83A0C",
  contactBg: "#111110",
  contactFg: "#F2F1EC",
  contactMuted: "rgb(242 241 236 / 0.66)",
} as const;

const display = loadDisplay("normal", {
  weights: ["400", "500", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});
const mono = loadMono("normal", { weights: ["400", "500", "700"], subsets: ["latin", "latin-ext"] });

export const fonts = { display: display.fontFamily, mono: mono.fontFamily } as const;

/** `--step` from the design system: mechanical, snaps like a switch. No springs. */
export const step = Easing.bezier(0.7, 0, 0.3, 1);

export const FPS = 30;

/** LinkedIn/Facebook feed (4:5) and stories/reels (9:16). */
export const formats = {
  feed: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
} as const;
export type Format = keyof typeof formats;

export const space = { edge: 72, gap: 36, small: 16 } as const;

/** Frames a viewer needs to read `text`: a beat to notice it, then about 20 characters a second. */
export const readFrames = (text: string) => Math.round(FPS * (1 + text.length / 20));
