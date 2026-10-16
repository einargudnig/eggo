import { parts } from "../../src/content/parts";
import { isk, priceFrom } from "../../src/content/pricing";
import { troubleIds, troubles, type TroubleId } from "../../src/content/work";
import { getDict, type Lang } from "../../src/i18n";
import { Body, END_FRAMES, EndCard, Label, Page, PartCode, Reveal, type Scene, Tick, Title } from "./kit";
import { colors, FPS, readFrames } from "./theme";

/** Which symptoms get ticked, and when (frames into the picker scene). */
const ticks: Partial<Record<TroubleId, number>> = { a: FPS, d: FPS * 2 + 10 };
const ticked = troubleIds.filter((id) => ticks[id] !== undefined);
const SUMMARY_DELAY = 8;

/** The site's symptom picker, played once: tick what's wrong, the suggestion prices it. Post 4. */
export const pickerScenes = (lang: Lang): Scene[] => {
  const t = getDict(lang);
  const q = t.trouble.quote;
  const tag = <Label>{t.trip.title}</Label>;
  const last = Math.max(...ticked.map((id) => ticks[id] ?? 0));
  return [
    {
      name: "hook",
      frames: readFrames(t.trouble.title),
      node: (
        <Page t={t} tag={tag}>
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
        <Page t={t} tag={tag}>
          <Label>{t.ask.legend}</Label>
          <div>
            {troubleIds.map((id) => (
              <div
                key={id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  padding: "18px 0",
                  borderTop: `2px solid ${colors.line}`,
                }}
              >
                <Tick at={ticks[id] ?? null} size={44} />
                <div style={{ fontSize: 34, lineHeight: 1.3, letterSpacing: "-0.01em", textWrap: "pretty" }}>
                  {`${q.open}${t.trouble.rows[id].symptom}${q.close}`}
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: colors.page2, borderRadius: 18, padding: "32px 40px" }}>
            <Label ink>{t.trip.title}</Label>
            {ticked.map((id) => {
              const part = troubles[id];
              return (
                <Reveal key={id} at={(ticks[id] ?? 0) + SUMMARY_DELAY}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      alignItems: "end",
                      gap: 20,
                      paddingTop: 22,
                    }}
                  >
                    <div>
                      <PartCode id={part} size={20} />
                      <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.025em" }}>
                        {t.parts[part].short}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", fontSize: 28, fontVariantNumeric: "tabular-nums" }}>
                      <div style={{ fontWeight: 600 }}>{t.parts[part].time}</div>
                      <div style={{ color: colors.muted }}>
                        {parts[part].defined
                          ? `${t.trip.from} ${isk(lang, priceFrom[part])}`
                          : isk(lang, priceFrom[part])}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
            <Reveal at={last + SUMMARY_DELAY + 12}>
              <div style={{ marginTop: 22, fontSize: 26, color: colors.muted }}>{t.trip.priceNote}</div>
            </Reveal>
          </div>
        </Page>
      ),
    },
    {
      name: "fix",
      frames: readFrames(ticked.map((id) => t.trouble.rows[id].fix).join(" ")),
      node: (
        <Page t={t} tag={tag}>
          {ticked.map((id, i) => (
            <Reveal key={id} at={i * 14}>
              <PartCode id={troubles[id]} size={24} />
              <Body>{t.trouble.rows[id].fix}</Body>
            </Reveal>
          ))}
        </Page>
      ),
    },
    { name: "end", frames: END_FRAMES, node: <EndCard t={t} /> },
  ];
};
