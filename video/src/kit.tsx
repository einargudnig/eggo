import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, interpolate, Series, useCurrentFrame } from "remotion";
import { brand } from "../../src/content/brand";
import { parts, type PartId } from "../../src/content/parts";
import type { Dict } from "../../src/i18n/is";
import { colors, fonts, FPS, space, step } from "./theme";

/** `name` labels the scene in the Studio timeline. */
export type Scene = { name: string; frames: number; node: ReactNode };

export const totalFrames = (scenes: readonly Scene[]) => scenes.reduce((sum, s) => sum + s.frames, 0);

export const Scenes = ({ scenes }: { scenes: readonly Scene[] }) => (
  <Series>
    {scenes.map((s) => (
      <Series.Sequence key={s.name} name={s.name} durationInFrames={s.frames}>
        {s.node}
      </Series.Sequence>
    ))}
  </Series>
);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** A left-to-right wipe on the house `--step` curve. The only entrance used: things switch on, they don't float in. */
export const Reveal = ({
  at = 0,
  children,
  style,
}: {
  at?: number;
  children: ReactNode;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 9], [0, 1], { ...clamp, easing: step });
  return <div style={{ clipPath: `inset(-10% ${(1 - p) * 100}% -10% 0)`, ...style }}>{children}</div>;
};

/** Monospace typing, for terminal lines. */
export const Typed = ({ text, at = 0, cps = 28 }: { text: string; at?: number; cps?: number }) => {
  const frame = useCurrentFrame();
  const shown = Math.max(0, Math.floor(((frame - at) / FPS) * cps));
  if (shown === 0) return null;
  return <>{text.slice(0, shown)}</>;
};

/** 1.6s on/off, `steps(2)`: never a fade. */
const useBlink = () => useCurrentFrame() % Math.round(FPS * 1.6) < Math.round(FPS * 0.8);

export const label: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 26,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: colors.muted,
};

export const Label = ({ children, ink = false }: { children: ReactNode; ink?: boolean }) => (
  <div style={{ ...label, ...(ink ? { color: colors.ink, fontWeight: 700 } : {}) }}>{children}</div>
);

/** `03 · AGT` in an outlined box; 05 is dashed because it is undefined. */
export const PartTag = ({ id, active = false }: { id: PartId; active?: boolean }) => (
  <span
    style={{
      ...label,
      color: colors.ink,
      display: "inline-block",
      padding: "8px 14px",
      border: `2px ${parts[id].defined ? "solid" : "dashed"} ${colors.ink}`,
      background: active ? colors.accent : "transparent",
    }}
  >
    {`${id} · ${parts[id].code}`}
  </span>
);

const host = new URL(brand.url).host;

/** Paper, visible grid, top and bottom bars. Every video sits in this frame. */
export const Page = ({ t, tag, children }: { t: Dict; tag: ReactNode; children: ReactNode }) => {
  const on = useBlink();
  return (
    <AbsoluteFill style={{ background: colors.surface, color: colors.ink, fontFamily: fonts.display }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.grid} 2px, transparent 2px)`,
          backgroundSize: "25% 100%",
        }}
      />
      <AbsoluteFill style={{ padding: space.edge, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: space.gap / 2,
            borderBottom: `2px solid ${colors.ruleStrong}`,
          }}
        >
          <div
            style={{ fontWeight: 900, fontSize: 56, letterSpacing: "-0.045em" }}
          >{`${brand.wordmark}.`}</div>
          {tag}
        </header>
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: space.gap,
          }}
        >
          {children}
        </main>
        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: space.gap / 2,
            borderTop: `2px solid ${colors.ruleStrong}`,
          }}
        >
          <Label ink>{host}</Label>
          <Label>
            <span style={{ color: colors.accent, visibility: on ? "visible" : "hidden" }}>{"■ "}</span>
            {t.hero.status}
          </Label>
        </footer>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Title = ({ children, size = 84 }: { children: ReactNode; size?: number }) => (
  <div
    style={{
      fontWeight: 800,
      fontSize: size,
      lineHeight: 0.98,
      letterSpacing: "-0.04em",
      textWrap: "balance",
    }}
  >
    {children}
  </div>
);

export const Body = ({ children }: { children: ReactNode }) => (
  <div style={{ fontSize: 46, lineHeight: 1.3, letterSpacing: "-0.01em", textWrap: "pretty" }}>
    {children}
  </div>
);

/** Closing card shared by every video: the promise, the address, the next action. */
export const EndCard = ({ t }: { t: Dict }) => (
  <Page t={t} tag={<Label>{t.hero.eyebrow}</Label>}>
    <Reveal>
      <Title size={104}>
        {t.hero.titleStart}
        <span style={{ color: colors.accent }}>{t.hero.titleEm}</span>
      </Title>
    </Reveal>
    <Reveal at={14}>
      <div
        style={{
          ...label,
          fontSize: 34,
          color: colors.ink,
          fontWeight: 700,
          display: "inline-flex",
          gap: 24,
          padding: "26px 34px",
          background: colors.accent,
        }}
      >
        <span>{t.hero.cta}</span>
        <span>{`→ ${host}`}</span>
      </div>
    </Reveal>
  </Page>
);

export const END_FRAMES = FPS * 4;
