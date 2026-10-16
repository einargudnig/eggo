import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadText } from "@remotion/google-fonts/PublicSans";
import { Easing } from "remotion";

/**
 * The "Minimal" values of `src/design/tokens.stylex.ts` (light, plus the dark ones for the terminal panel).
 * That file can't be imported here: `defineVars` only works after the StyleX compiler runs. Keep the two in step.
 */
export const colors = {
  page: "#FFFFFF",
  page2: "#F3F4F2",
  ink: "#1A1D1C",
  muted: "#5E6562",
  line: "#E2E5E2",
  accent: "#2F5D50",
  accentInk: "#FFFFFF",
  darkPage: "#121413",
  darkInk: "#E4E7E5",
  darkMuted: "#9BA29F",
  darkAccent: "#8FBFAE",
} as const;

const publicSans = loadText("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
});
const mono = loadMono("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });

export const fonts = { text: publicSans.fontFamily, mono: mono.fontFamily } as const;

/** `motion.ease` from the design system: expo-out. Things unroll from their top edge, no springs. */
export const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const FPS = 30;

/** LinkedIn/Facebook feed (4:5) and stories/reels (9:16). */
export const formats = {
  feed: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
} as const;
export type Format = keyof typeof formats;

/** Still images: the feed post, plus the LinkedIn and Facebook header banners. */
export const stillFormats = {
  post: { width: 1080, height: 1350 },
  linkedin: { width: 1584, height: 396 },
  facebook: { width: 1640, height: 624 },
} as const;

export const space = { edge: 80, gap: 40, small: 16 } as const;

/** Frames a viewer needs to read `text`: a beat to notice it, then about 20 characters a second. */
export const readFrames = (text: string) => Math.round(FPS * (1 + text.length / 20));
