import { partIds, parts } from "../../src/content/parts";
import { isk, priceFrom } from "../../src/content/pricing";
import { getDict, type Lang } from "../../src/i18n";
import {
  Body,
  END_FRAMES,
  EndCard,
  Figure,
  heroTitle,
  Label,
  Page,
  PartCode,
  Reveal,
  type Scene,
  Section,
  Title,
} from "./kit";
import { colors, FPS, readFrames } from "./theme";

const ROW_GAP = 8;

/** Post 1: what Eggó builds, the five parts with time and price, and that nothing is too small. */
export const launchScenes = (lang: Lang): Scene[] => {
  const t = getDict(lang);
  const tag = <Label>{t.hero.eyebrow}</Label>;
  const hero = `${t.hero.titleStart}${t.hero.titleEm} ${t.hero.sub}`;
  return [
    {
      name: "hero",
      frames: readFrames(hero),
      node: (
        <Page t={t} tag={tag}>
          <Reveal>
            <Title size={112}>{heroTitle(t)}</Title>
          </Reveal>
          <Reveal at={FPS}>
            <Body muted>{t.hero.sub}</Body>
          </Reveal>
        </Page>
      ),
    },
    {
      name: "figure",
      frames: readFrames(t.partsSection.body) + FPS,
      node: (
        <Page t={t} tag={tag}>
          <Figure t={t} at={6} dim={false} lit={{ "01": 30, "02": 38, "03": 46, "04": 54 }} />
          <Reveal at={FPS}>
            <Body>{t.partsSection.body}</Body>
          </Reveal>
        </Page>
      ),
    },
    {
      name: "parts",
      frames: partIds.length * ROW_GAP + readFrames(`${t.partsSection.title} ${t.trip.priceNote}`),
      node: (
        <Page t={t} tag={tag}>
          <Reveal>
            <Section t={t} id="smidi" />
          </Reveal>
          <Reveal at={4}>
            <Title size={80}>{t.partsSection.title}</Title>
          </Reveal>
          <div>
            {partIds.map((id, i) => (
              <Reveal key={id} at={12 + i * ROW_GAP}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "end",
                    gap: 24,
                    padding: "22px 0",
                    borderTop: `2px ${parts[id].defined ? "solid" : "dashed"} ${colors.line}`,
                  }}
                >
                  <div>
                    <PartCode id={id} size={22} />
                    <div style={{ marginTop: 6, fontSize: 48, fontWeight: 600, letterSpacing: "-0.03em" }}>
                      {t.parts[id].name}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    <div style={{ fontSize: 30, fontWeight: 600 }}>{t.parts[id].time}</div>
                    <div style={{ fontSize: 28, color: colors.muted }}>
                      {parts[id].defined
                        ? `${t.trip.from} ${isk(lang, priceFrom[id])}`
                        : isk(lang, priceFrom[id])}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal at={12 + partIds.length * ROW_GAP + 6}>
            <Label>{t.trip.priceNote}</Label>
          </Reveal>
        </Page>
      ),
    },
    {
      name: "small",
      frames: readFrames(`${t.small.title} ${t.small.note}`),
      node: (
        <Page t={t} tag={tag}>
          <Reveal>
            <Section t={t} id="smatt" />
          </Reveal>
          <Reveal at={4}>
            <Title size={120}>{t.small.title}</Title>
          </Reveal>
          <Reveal at={FPS}>
            <Body muted>{t.small.note}</Body>
          </Reveal>
        </Page>
      ),
    },
    { name: "end", frames: END_FRAMES, node: <EndCard t={t} /> },
  ];
};
