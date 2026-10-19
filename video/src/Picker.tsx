import { parts } from "../../src/content/parts";
import { isk, priceFrom } from "../../src/content/pricing";
import { troubleIds, troubles, type TroubleId } from "../../src/content/work";
import { getDict, type Lang } from "../../src/i18n";
import {
  Body,
  Card,
  END_FRAMES,
  EndCard,
  Heading,
  Label,
  Page,
  Reveal,
  type Scene,
  Tick,
  Title,
} from "./kit";
import { FPS, readFrames, track } from "./theme";

/** Which symptoms get ticked, and when (frames into the picker scene). */
const ticks: Partial<Record<TroubleId, number>> = { a: FPS, d: FPS * 2 + 10 };
const ticked = troubleIds.filter((id) => ticks[id] !== undefined);
const SUMMARY_DELAY = 8;

/** The site's symptom picker, played once: tick what's wrong, the suggestion prices it. Post 4. */
export const pickerScenes = (lang: Lang): Scene[] => {
  const t = getDict(lang);
  const q = t.trouble.quote;
  const last = Math.max(...ticked.map((id) => ticks[id] ?? 0));
  return [
    {
      name: "hook",
      frames: readFrames(t.trouble.title),
      node: (
        <Page>
          <Reveal>
            <Title size={112}>{t.trouble.title}</Title>
          </Reveal>
        </Page>
      ),
    },
    {
      name: "picker",
      frames: last + SUMMARY_DELAY + readFrames(t.trip.priceNote) + FPS * 2,
      node: (
        <Page>
          <Heading>{t.ask.legend}</Heading>
          <div>
            {troubleIds.map((id) => (
              <div
                key={id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  padding: "14px 0",
                }}
              >
                <Tick at={ticks[id] ?? null} size={44} />
                <div style={{ fontSize: 34, lineHeight: 1.3, letterSpacing: "-0.01em", textWrap: "pretty" }}>
                  {`${q.open}${t.trouble.rows[id].symptom}${q.close}`}
                </div>
              </div>
            ))}
          </div>
          <Card>
            <Heading size={44}>{t.trip.title}</Heading>
            {ticked.map((id) => {
              const part = troubles[id];
              return (
                <Reveal key={id} at={(ticks[id] ?? 0) + SUMMARY_DELAY}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      columnGap: 20,
                      paddingTop: 22,
                      fontSize: 36,
                    }}
                  >
                    <div style={{ fontWeight: 600, letterSpacing: track.head }}>{t.parts[part].sign}</div>
                    <div style={{ fontWeight: 600, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {parts[part].defined
                        ? `${t.trip.from} ${isk(lang, priceFrom[part])}`
                        : isk(lang, priceFrom[part])}
                    </div>
                    <Label>{t.parts[part].time}</Label>
                  </div>
                </Reveal>
              );
            })}
            <Reveal at={last + SUMMARY_DELAY + 12}>
              <Label ink style={{ marginTop: 22 }}>
                {t.trip.priceNote}
              </Label>
            </Reveal>
          </Card>
        </Page>
      ),
    },
    {
      name: "fix",
      frames: readFrames(ticked.map((id) => t.trouble.rows[id].fix).join(" ")),
      node: (
        <Page>
          {ticked.map((id, i) => (
            <Reveal key={id} at={i * 14}>
              <Label ink>{t.parts[troubles[id]].short}</Label>
              <Body>{t.trouble.rows[id].fix}</Body>
            </Reveal>
          ))}
        </Page>
      ),
    },
    { name: "end", frames: END_FRAMES, node: <EndCard t={t} /> },
  ];
};
