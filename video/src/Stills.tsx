import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { llmsTxt } from "../../src/content/agent";
import { partIds, parts } from "../../src/content/parts";
import { isk, priceFrom } from "../../src/content/pricing";
import { caseIds, cases, clientLabel, troubleIds, troubles, type CaseId } from "../../src/content/work";
import { getDict, type Lang } from "../../src/i18n";
import type { Dict } from "../../src/i18n/is";
import { videoCopy } from "./copy";
import {
  Body,
  Button,
  Figure,
  heroTitle,
  host,
  Label,
  Page,
  PartCode,
  Section,
  Title,
  Wordmark,
} from "./kit";
import { colors, fonts, type stillFormats } from "./theme";

type Still = { format: keyof typeof stillFormats; node: (t: Dict, lang: Lang) => ReactNode };

const Row = ({ children, dashed = false }: { children: ReactNode; dashed?: boolean }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "end",
      gap: 24,
      padding: "20px 0",
      borderTop: `2px ${dashed ? "dashed" : "solid"} ${colors.line}`,
    }}
  >
    {children}
  </div>
);

const price = (t: Dict, lang: Lang, id: (typeof partIds)[number]) =>
  parts[id].defined ? `${t.trip.from} ${isk(lang, priceFrom[id])}` : isk(lang, priceFrom[id]);

const caseStill = (id: CaseId): Still => ({
  format: "post",
  node: (t, lang) => {
    const c = t.work.cases[id];
    return (
      <Page
        t={t}
        tag={
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Label ink>{clientLabel(id, t.work.engagements)}</Label>
            <Label>·</Label>
            <PartCode id={cases[id].part} />
          </div>
        }
      >
        <Label>{videoCopy[lang].hookCase}</Label>
        <Title size={76}>{c.name}</Title>
        <div
          style={{
            fontSize: 220,
            fontWeight: 600,
            lineHeight: 0.95,
            letterSpacing: "-0.05em",
            color: colors.accent,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {c.metric}
        </div>
        <Body>{c.metricNote}</Body>
        <Body muted>{c.outcome}</Body>
      </Page>
    );
  },
});

/**
 * A header banner: wordmark and promise from a third of the way in (clear of the profile picture at bottom left),
 * the four parts as boxes on the right, 03 in the accent like the OG image.
 */
const Banner = ({ t, scale }: { t: Dict; scale: number }) => (
  <AbsoluteFill
    style={{
      background: colors.page,
      color: colors.ink,
      fontFamily: fonts.text,
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
      gap: 64 * scale,
      padding: `0 ${80 * scale}px 0 31%`,
    }}
  >
    <div style={{ display: "grid", gap: 20 * scale }}>
      <Wordmark height={40 * scale} />
      <Title size={46 * scale}>{heroTitle(t)}</Title>
      <Label style={{ fontSize: 19 * scale }}>
        <b style={{ color: colors.ink }}>{host}</b>
        {` · ${t.hero.status}`}
      </Label>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 * scale }}>
      {partIds
        .filter((id) => parts[id].defined)
        .map((id) => (
          <div
            key={id}
            style={{
              width: 190 * scale,
              padding: `${14 * scale}px ${16 * scale}px`,
              border:
                id === "03"
                  ? `${3 * scale}px solid ${colors.accent}`
                  : `${1.5 * scale}px solid ${colors.ink}`,
            }}
          >
            <PartCode id={id} size={14 * scale} />
            <div
              style={{
                marginTop: 4 * scale,
                fontSize: 24 * scale,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {t.parts[id].short}
            </div>
          </div>
        ))}
    </div>
  </AbsoluteFill>
);

export const stills: Record<string, Still> = {
  launch: {
    format: "post",
    node: (t) => (
      <Page t={t} tag={<Label>{t.hero.eyebrow}</Label>}>
        <Title size={92}>{heroTitle(t)}</Title>
        <Figure t={t} lit={{ "03": 0 }} />
      </Page>
    ),
  },
  prices: {
    format: "post",
    node: (t, lang) => (
      <Page t={t} tag={<Section t={t} id="smidi" />}>
        <Title size={76}>{t.partsSection.title}</Title>
        <div>
          {partIds.map((id) => (
            <Row key={id} dashed={!parts[id].defined}>
              <div>
                <PartCode id={id} size={20} />
                <div style={{ marginTop: 4, fontSize: 40, fontWeight: 600, letterSpacing: "-0.025em" }}>
                  {t.parts[id].name}
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: 26, fontVariantNumeric: "tabular-nums" }}>
                <div style={{ fontWeight: 600 }}>{t.parts[id].time}</div>
                <div style={{ color: colors.muted }}>{price(t, lang, id)}</div>
              </div>
            </Row>
          ))}
        </div>
        <div
          style={{
            background: colors.page2,
            borderRadius: 18,
            padding: "28px 34px",
            fontSize: 30,
            lineHeight: 1.4,
          }}
        >
          {t.partsSection.deal}
        </div>
      </Page>
    ),
  },
  picker: {
    format: "post",
    node: (t) => (
      <Page t={t} tag={<Label>{t.trip.title}</Label>}>
        <Title size={80}>{t.trouble.title}</Title>
        <div>
          {troubleIds.map((id) => (
            <div key={id} style={{ padding: "20px 0", borderTop: `2px solid ${colors.line}` }}>
              <div style={{ fontSize: 34, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                {`${t.trouble.quote.open}${t.trouble.rows[id].symptom}${t.trouble.quote.close}`}
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 14, alignItems: "baseline" }}>
                <span style={{ fontFamily: fonts.mono, color: colors.accent, fontSize: 22 }}>→</span>
                <PartCode id={troubles[id]} size={20} />
                <span style={{ fontSize: 26, color: colors.muted }}>{t.trouble.rows[id].fix}</span>
              </div>
            </div>
          ))}
        </div>
      </Page>
    ),
  },
  small: {
    format: "post",
    node: (t) => (
      <Page t={t} tag={<Section t={t} id="smatt" />}>
        <Title size={100}>{t.small.title}</Title>
        <div>
          {t.small.items.map((item, i) => (
            <div
              key={item}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr",
                alignItems: "baseline",
                padding: "16px 0",
                borderTop: `2px solid ${colors.line}`,
              }}
            >
              <Label ink>{String(i + 1).padStart(2, "0")}</Label>
              <div style={{ fontSize: 32, lineHeight: 1.3 }}>{item}</div>
            </div>
          ))}
        </div>
        <Body muted>{t.small.note}</Body>
      </Page>
    ),
  },
  process: {
    format: "post",
    node: (t) => (
      <Page t={t} tag={<Section t={t} id="ferli" />}>
        <Title size={88}>{t.steps.title}</Title>
        <Body muted>{t.steps.intro}</Body>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "36px 40px" }}>
          {t.steps.items.map((s, i) => (
            <div key={s.title} style={{ borderTop: `2px solid ${colors.ink}`, paddingTop: 20 }}>
              <Label>
                <b style={{ color: colors.ink }}>{String(i + 1).padStart(2, "0")}</b>
                {` · ${s.when}`}
              </Label>
              <div style={{ marginTop: 8, fontSize: 42, fontWeight: 600, letterSpacing: "-0.025em" }}>
                {s.title}
              </div>
              <div style={{ marginTop: 8, fontSize: 27, lineHeight: 1.4, color: colors.muted }}>{s.body}</div>
            </div>
          ))}
        </div>
      </Page>
    ),
  },
  agents: {
    format: "post",
    node: (t, lang) => (
      <Page t={t} tag={<Label>{videoCopy[lang].agentsTag}</Label>}>
        <Title size={92}>{videoCopy[lang].agentsHook}</Title>
        <div
          style={{
            background: colors.darkPage,
            color: colors.darkMuted,
            borderRadius: 18,
            padding: 40,
            fontFamily: fonts.mono,
            fontSize: 26,
            lineHeight: 1.6,
            whiteSpace: "pre",
            overflow: "hidden",
          }}
        >
          <div style={{ color: colors.darkInk }}>{`$ curl ${host}/llms.txt`}</div>
          {llmsTxt()
            .split("\n")
            .filter((line) => line.trim() !== "")
            .slice(0, 4)
            .map((line) => (
              <div key={line}>{line.length > 52 ? `${line.slice(0, 51)}…` : line}</div>
            ))}
        </div>
        <Body muted>{videoCopy[lang].agentsAsk}</Body>
      </Page>
    ),
  },
  cta: {
    format: "post",
    node: (t) => (
      <Page t={t} tag={<Label>{t.hero.eyebrow}</Label>}>
        <Title size={104}>{heroTitle(t)}</Title>
        <Body muted>{t.hero.lead}</Body>
        <Button>{`${t.trip.send} · ${host}`}</Button>
        <Label>{t.trip.priceNote}</Label>
      </Page>
    ),
  },
  ...Object.fromEntries(caseIds.map((id) => [id, caseStill(id)])),
  "banner-linkedin": { format: "linkedin", node: (t) => <Banner t={t} scale={1} /> },
  "banner-facebook": { format: "facebook", node: (t) => <Banner t={t} scale={1.15} /> },
};

export const StillImage = ({ still, lang }: { still: string; lang: Lang }) => {
  const s = stills[still];
  return s ? <>{s.node(getDict(lang), lang)}</> : null;
};
