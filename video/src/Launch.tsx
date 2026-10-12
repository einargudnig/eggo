import { brand } from "../../src/content/brand";
import { partIds, parts } from "../../src/content/parts";
import { getDict, type Lang } from "../../src/i18n";
import { Body, END_FRAMES, EndCard, Label, Page, PartTag, Reveal, type Scene, Title } from "./kit";
import { colors, FPS, readFrames, space } from "./theme";

const ROW_GAP = 10;

/** Post 1: who Eggó is, the five parts, the promise. */
export const launchScenes = (lang: Lang): Scene[] => {
  const t = getDict(lang);
  const tag = <Label>{t.hero.eyebrow}</Label>;
  const hero = `${t.hero.titleStart}${t.hero.titleEm}`;
  return [
    {
      name: "hero",
      frames: readFrames(hero),
      node: (
        <Page t={t} tag={tag}>
          <Reveal>
            <Title size={120}>
              {t.hero.titleStart}
              <span style={{ color: colors.accent }}>{t.hero.titleEm}</span>
            </Title>
          </Reveal>
        </Page>
      ),
    },
    {
      name: "parts",
      frames: partIds.length * ROW_GAP + readFrames(t.partsSection.title),
      node: (
        <Page t={t} tag={tag}>
          <Reveal>
            <Title size={64}>{t.partsSection.title}</Title>
          </Reveal>
          <div style={{ borderTop: `2px solid ${colors.ruleStrong}` }}>
            {partIds.map((id, i) => (
              <Reveal key={id} at={12 + i * ROW_GAP}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: space.gap,
                    padding: "22px 0",
                    borderBottom: `2px ${parts[id].defined ? "solid" : "dashed"} ${colors.rule}`,
                  }}
                >
                  <PartTag id={id} active={!parts[id].defined} />
                  <div style={{ fontSize: 54, fontWeight: 800, letterSpacing: "-0.035em" }}>
                    {t.parts[id].name}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Page>
      ),
    },
    {
      name: "who",
      frames: readFrames(`${t.who.intro} ${t.who.aside}`),
      node: (
        <Page t={t} tag={<Label>{brand.ownerFullName}</Label>}>
          <Reveal>
            <Title size={72}>{t.who.intro}</Title>
          </Reveal>
          <Reveal at={FPS}>
            <Body>{t.who.aside}</Body>
          </Reveal>
        </Page>
      ),
    },
    { name: "end", frames: END_FRAMES, node: <EndCard t={t} /> },
  ];
};
