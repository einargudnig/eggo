import { getDict, type Lang } from "../../src/i18n";
import { Body, Card, END_FRAMES, EndCard, Page, Reveal, type Scene, Title } from "./kit";
import { FPS, readFrames } from "./theme";

const ROW_GAP = 14;

/** "Nothing is too small": the one-day examples, one after another. */
export const smallScenes = (lang: Lang): Scene[] => {
  const t = getDict(lang);
  return [
    {
      name: "hook",
      frames: readFrames(`${t.small.title} ${t.small.body}`),
      node: (
        <Page>
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
        <Page>
          <div style={{ display: "grid", gap: 24 }}>
            {t.small.items.map((item, i) => (
              <Reveal key={item} at={i * ROW_GAP}>
                <Card style={{ fontSize: 40, lineHeight: 1.3, textWrap: "pretty" }}>{item}</Card>
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
        <Page>
          <Reveal>
            <Title size={84}>{t.small.note}</Title>
          </Reveal>
        </Page>
      ),
    },
    { name: "end", frames: END_FRAMES, node: <EndCard t={t} /> },
  ];
};
