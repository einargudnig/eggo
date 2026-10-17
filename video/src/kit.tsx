import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, interpolate, Series, useCurrentFrame } from "remotion";
import { brand } from "../../src/content/brand";
import { partIds, parts, type PartId } from "../../src/content/parts";
import { sectionIds, type SectionId } from "../../src/content/sections";
import { wordmark } from "../../src/design/wordmark";
import type { Dict } from "../../src/i18n/is";
import { colors, ease, fonts, FPS, space } from "./theme";

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

/** A start frame that never comes: `interpolate` needs finite input. */
const NEVER = 1e9;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 over `frames`, starting at `at`, on the house expo-out. */
export const useProgress = (at: number, frames: number) =>
  interpolate(useCurrentFrame(), [at, at + frames], [0, 1], { ...clamp, easing: ease });

/**
 * The site's one entrance: unroll from the top edge while settling 12px (the summary lines, 320ms).
 * Nothing fades or floats in.
 */
export const Reveal = ({
  at = 0,
  children,
  style,
}: {
  at?: number;
  children: ReactNode;
  style?: CSSProperties;
}) => {
  const p = useProgress(at, 10);
  return (
    <div
      style={{
        clipPath: `inset(-10% -10% ${(1 - p) * 110 - 10}% -10%)`,
        transform: `translateY(${(1 - p) * -12}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Monospace typing, for terminal lines. */
export const Typed = ({ text, at = 0, cps = 28 }: { text: string; at?: number; cps?: number }) => {
  const frame = useCurrentFrame();
  const shown = Math.max(0, Math.floor(((frame - at) / FPS) * cps));
  if (shown === 0) return null;
  return <>{text.slice(0, shown)}</>;
};

export const label: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 24,
  fontWeight: 500,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: colors.muted,
};

export const Label = ({
  children,
  ink = false,
  style,
}: {
  children: ReactNode;
  ink?: boolean;
  style?: CSSProperties;
}) => (
  <div style={{ ...label, ...(ink ? { color: colors.ink, fontWeight: 700 } : {}), ...style }}>{children}</div>
);

/** `03 · AGT`, the number in ink, as on the site. */
export const PartCode = ({ id, size = 24 }: { id: PartId; size?: number }) => (
  <span style={{ ...label, fontSize: size }}>
    <b style={{ color: colors.ink, fontWeight: 700 }}>{id}</b>
    {` · ${parts[id].code}`}
  </span>
);

/** The drawn "eggó" from the site's top bar. */
export const Wordmark = ({ height, color = colors.ink }: { height: number; color?: string }) => (
  <svg
    viewBox={`0 0 ${wordmark.width} ${wordmark.height}`}
    style={{
      height,
      width: (height * wordmark.width) / wordmark.height,
      display: "block",
      overflow: "visible",
    }}
  >
    {wordmark.letters.map((d) => (
      <path key={d} d={d} fill={color} />
    ))}
    <polygon points={wordmark.accent} fill={colors.accent} />
  </svg>
);

/** The favicon: a 2×2 of boxes, one filled. */
export const Boxes = ({ size = 28 }: { size?: number }) => {
  const cell = size * 0.42;
  const gap = size - cell * 2;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(2, ${cell}px)`, gap }}>
      {[0, 1, 2, 3].map((i) => (
        <i
          key={i}
          style={{
            height: cell * 0.72,
            border: `${Math.max(2, size / 14)}px solid ${i === 3 ? colors.accent : colors.ink}`,
            background: i === 3 ? colors.accent : "transparent",
          }}
        />
      ))}
    </div>
  );
};

export const host = new URL(brand.url).host;

/** White page, wordmark top left, hairline footer with the address. Every video and image sits in this frame. */
export const Page = ({ t, tag, children }: { t: Dict; tag?: ReactNode; children: ReactNode }) => (
  <AbsoluteFill style={{ background: colors.page, color: colors.ink, fontFamily: fonts.text }}>
    <AbsoluteFill style={{ padding: space.edge, display: "flex", flexDirection: "column" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Wordmark height={64} />
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
          paddingTop: space.gap * 0.6,
          borderTop: `2px solid ${colors.line}`,
        }}
      >
        <Label ink>{host}</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Boxes size={26} />
          <Label>{t.hero.status}</Label>
        </div>
      </footer>
    </AbsoluteFill>
  </AbsoluteFill>
);

/** The site's headline is two short sentences; like the hero, each gets its own line. */
export const heroTitle = (t: Dict) => (
  <>
    {t.hero.titleStart.trim()}
    <br />
    {t.hero.titleEm}
  </>
);

export const Title = ({ children, size = 88 }: { children: ReactNode; size?: number }) => (
  <div
    style={{
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1.04,
      letterSpacing: "-0.035em",
      textWrap: "balance",
    }}
  >
    {children}
  </div>
);

export const Body = ({ children, muted = false }: { children: ReactNode; muted?: boolean }) => (
  <div
    style={{
      fontSize: 44,
      lineHeight: 1.36,
      letterSpacing: "-0.01em",
      textWrap: "pretty",
      color: muted ? colors.muted : colors.ink,
    }}
  >
    {children}
  </div>
);

/** `§n · Section` over a heading, as on the site. */
export const Section = ({ t, id }: { t: Dict; id: SectionId }) => (
  <Label>
    <b style={{ color: colors.ink, fontWeight: 700 }}>{`§${sectionIds.indexOf(id) + 1}`}</b>
    {` · ${t.sections[id]}`}
  </Label>
);

/** The picker's checkbox: the tick draws itself in (180ms on the site). */
export const Tick = ({ at, size = 48 }: { at: number | null; size?: number }) => {
  const p = useProgress(at ?? NEVER, 6);
  const on = at !== null && p > 0;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none" }}>
      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="5"
        fill={on ? colors.accent : colors.page}
        stroke={on ? colors.accent : colors.muted}
        strokeWidth="2"
      />
      <path
        d="M6 12.5l4 4 8-9"
        fill="none"
        stroke={colors.accentInk}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
    </svg>
  );
};

/** A filled button in the accent, ending in →. */
export const Button = ({ children, size = 34 }: { children: ReactNode; size?: number }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.6,
      alignSelf: "flex-start",
      padding: `${size * 0.6}px ${size * 0.9}px`,
      borderRadius: 14,
      background: colors.accent,
      color: colors.accentInk,
      fontSize: size,
      fontWeight: 600,
      letterSpacing: "-0.01em",
    }}
  >
    {children}
    <span>→</span>
  </div>
);

type Box = { x: number; y: number; w: number; h: number };
const desk: Record<PartId, Box> = {
  "01": { x: 10, y: 22, w: 216, h: 96 },
  "02": { x: 294, y: 22, w: 216, h: 96 },
  "03": { x: 294, y: 212, w: 216, h: 96 },
  "04": { x: 10, y: 212, w: 216, h: 96 },
  "05": { x: 196, y: 140, w: 128, h: 50 },
};

const NONE_LIT: Partial<Record<PartId, number>> = {};

const Wire = ({ d, at }: { d: string; at: number }) => {
  const p = useProgress(at, 20);
  return (
    <path
      d={d}
      stroke={colors.ink}
      strokeWidth={1}
      fill="none"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
  );
};

/**
 * The hero's "Mynd 1": five parts wired together. Wires draw in from `at`; `lit` parts get the accent outline
 * at their frame, and once anything is lit the rest step back to 32%.
 */
export const Figure = ({
  t,
  at = 0,
  lit = NONE_LIT,
  dim = true,
}: {
  t: Dict;
  at?: number;
  lit?: Partial<Record<PartId, number>>;
  /** Step the unlit parts back, as the hero does for a suggestion. Off when lighting parts in turn. */
  dim?: boolean;
}) => {
  const frame = useCurrentFrame();
  const isLit = (id: PartId) => (lit[id] ?? NEVER) <= frame;
  const anyLit = dim && partIds.some(isLit);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Label>{t.figure.caption}</Label>
        <Label>{t.figure.count}</Label>
      </div>
      <svg viewBox="0 0 520 330" style={{ width: "100%", display: "block", overflow: "visible" }}>
        <Wire d="M226 70 H294" at={at} />
        <Wire d="M398 118 V212" at={at + 8} />
        <Wire d="M294 260 H226" at={at + 16} />
        <path
          d="M196 146 L170 118 M324 146 L350 118 M324 184 L350 212 M196 184 L170 212"
          stroke={colors.muted}
          strokeWidth={1}
          strokeDasharray="3 3"
          fill="none"
        />
        {(
          [
            [260, 60, "middle", t.figure.wires.post],
            [408, 169, "start", t.figure.wires.webhook],
            [260, 250, "middle", t.figure.wires.api],
          ] as const
        ).map(([x, y, anchor, text]) => (
          <text
            key={text}
            x={x}
            y={y}
            textAnchor={anchor}
            fontFamily={fonts.mono}
            fontSize={10}
            fill={colors.muted}
          >
            {text}
          </text>
        ))}
        {partIds.map((id) => {
          const b = desk[id];
          const unknown = !parts[id].defined;
          const on = isLit(id);
          return (
            <g key={id} opacity={anyLit && !on ? 0.32 : 1}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                fill={colors.page}
                stroke={on ? colors.accent : colors.ink}
                strokeWidth={on ? 2.5 : 1}
                strokeDasharray={unknown ? "4 3" : undefined}
              />
              <text
                x={b.x + 14}
                y={b.y + 22}
                fontFamily={fonts.mono}
                fontSize={11}
                fontWeight={600}
                fill={colors.muted}
              >
                {`${id} · ${parts[id].code}`}
              </text>
              {unknown ? (
                <>
                  <text x={b.x + 14} y={b.y + 40} fontFamily={fonts.mono} fontSize={11.5} fill={colors.muted}>
                    {t.parts[id].detail}
                  </text>
                  <text
                    x={b.x + b.w - 22}
                    y={b.y + 38}
                    textAnchor="middle"
                    fontFamily={fonts.text}
                    fontSize={24}
                    fontWeight={700}
                    fill={colors.accent}
                  >
                    ?
                  </text>
                </>
              ) : (
                <>
                  <text
                    x={b.x + 14}
                    y={b.y + 54}
                    fontFamily={fonts.text}
                    fontSize={21}
                    fontWeight={600}
                    letterSpacing="-0.4"
                    fill={colors.ink}
                  >
                    {t.parts[id].short}
                  </text>
                  <text x={b.x + 14} y={b.y + 78} fontFamily={fonts.mono} fontSize={11.5} fill={colors.muted}>
                    {t.parts[id].detail}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/** Closing card shared by every video: the promise, the price note, the next action. */
export const EndCard = ({ t }: { t: Dict }) => (
  <Page t={t} tag={<Label>{t.hero.eyebrow}</Label>}>
    <Reveal>
      <Title size={96}>{heroTitle(t)}</Title>
    </Reveal>
    <Reveal at={8}>
      <Body muted>{t.trip.priceNote}</Body>
    </Reveal>
    <Reveal at={16}>
      <Button>{`${t.hero.cta} · ${host}`}</Button>
    </Reveal>
  </Page>
);

export const END_FRAMES = FPS * 4;
