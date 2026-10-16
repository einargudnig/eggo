import { getDict, type Lang } from "../../src/i18n";
import { Body, END_FRAMES, EndCard, Label, Page, Reveal, type Scene, Section, Title } from "./kit";
import { colors, FPS, readFrames } from "./theme";

const ROW_GAP = 14;

/** "Nothing is too small": the six one-day examples, one after another. */
export const smallScenes = (lang: Lang): Scene[] => {
  const t = getDict(lang);
  const tag = <Section t={t} id="smatt" />;
  return [
    {
      name: "hook",
      frames: readFrames(`${t.small.title} ${t.small.body}`),
      node: (
        <Page t={t} tag={tag}>
          <Reveal>
            <Title size={128}>{t.small.title}</Title>
          </Reveal>
          <Reveal at={FPS}>
            <Body muted>{t.small.body}</Body>
          </Reveal>
        </Page>
      ),
    },
    {
      name: "examples",
      frames: t.small.items.length * ROW_GAP + Math.round(readFrames(t.small.items.join(" ")) / 2),
      node: (
        <Page t={t} tag={tag}>
          <div>
            {t.small.items.map((item, i) => (
              <Reveal key={item} at={i * ROW_GAP}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "56px 1fr",
                    alignItems: "baseline",
                    padding: "22px 0",
                    borderTop: `2px solid ${colors.line}`,
                  }}
                >
                  <Label ink>{String(i + 1).padStart(2, "0")}</Label>
                  <div
                    style={{ fontSize: 38, lineHeight: 1.3, letterSpacing: "-0.015em", textWrap: "pretty" }}
                  >
                    {item}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Page>
      ),
    },
    {
      name: "price",
      frames: readFrames(t.small.note),
      node: (
        <Page t={t} tag={tag}>
          <Reveal>
            <Title size={84}>{t.small.note}</Title>
          </Reveal>
        </Page>
      ),
    },
    { name: "end", frames: END_FRAMES, node: <EndCard t={t} /> },
  ];
};
