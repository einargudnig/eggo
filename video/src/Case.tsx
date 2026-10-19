import { clientLabel, type CaseId } from "../../src/content/work";
import { getDict, type Lang } from "../../src/i18n";
import { videoCopy } from "./copy";
import { Body, END_FRAMES, EndCard, Label, Page, Reveal, type Scene, Title } from "./kit";
import { colors, readFrames } from "./theme";

/** One work row as a short: the case, the problem, what was built, the number. Posts 2, 3, 5 and 7. */
export const caseScenes = (id: CaseId, lang: Lang): Scene[] => {
  const t = getDict(lang);
  const c = t.work.cases[id];
  const tag = <Label>{clientLabel(id, t.work.engagements)}</Label>;

  const step = (name: string, heading: string, text: string): Scene => ({
    name,
    frames: readFrames(text),
    node: (
      <Page tag={tag}>
        <Reveal>
          <Label>{heading}</Label>
        </Reveal>
        <Reveal at={6}>
          <Body>{text}</Body>
        </Reveal>
      </Page>
    ),
  });

  return [
    {
      name: "name",
      frames: readFrames(c.name),
      node: (
        <Page tag={tag}>
          <Reveal>
            <Label>{videoCopy[lang].hookCase}</Label>
          </Reveal>
          <Reveal at={6}>
            <Title size={100}>{c.name}</Title>
          </Reveal>
        </Page>
      ),
    },
    step("problem", t.work.problem, c.problem),
    step("built", t.work.built, c.built),
    {
      name: "result",
      frames: readFrames(`${c.metric} ${c.metricNote}`),
      node: (
        <Page tag={tag}>
          <Reveal>
            <Label>{t.work.result}</Label>
          </Reveal>
          <Reveal at={6}>
            <div
              style={{
                fontSize: 240,
                fontWeight: 600,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                color: colors.accent,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {c.metric}
            </div>
          </Reveal>
          <Reveal at={16}>
            <Title size={56}>{c.metricNote}</Title>
          </Reveal>
          <Reveal at={30}>
            <Body muted>{c.outcome}</Body>
          </Reveal>
        </Page>
      ),
    },
    { name: "end", frames: END_FRAMES, node: <EndCard t={t} /> },
  ];
};
