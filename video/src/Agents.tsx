import { llmsTxt, mcpUrl } from "../../src/content/agent";
import { brand } from "../../src/content/brand";
import { getDict, type Lang } from "../../src/i18n";
import { videoCopy } from "./copy";
import { Body, END_FRAMES, EndCard, Label, Page, Reveal, type Scene, Title, Typed } from "./kit";
import { colors, fonts, FPS, readFrames } from "./theme";

const strip = (url: string) => url.replace(/^https:\/\//, "");

/** Real output, so the video can't promise more than the site does. */
const llmsHead = llmsTxt()
  .split("\n")
  .filter((line) => line.trim() !== "")
  .slice(0, 3)
  .map((line) => (line.length > 44 ? `${line.slice(0, 43)}…` : line));

const tools = ["get_studio_info", "send_work_order"];

const CPS = 36;
const OUTPUT_FRAMES = 6;

/** Commands type out; their output switches on line by line once the command is done. */
const lineFrames = (line: { cmd: boolean; text: string }) =>
  line.cmd ? Math.ceil((line.text.length / CPS) * FPS) + 8 : OUTPUT_FRAMES;

let clock = 0;
const termLines = [
  { cmd: true, text: `$ curl ${strip(brand.url)}/llms.txt` },
  ...llmsHead.map((text) => ({ cmd: false, text })),
  { cmd: true, text: `$ mcp tools/list ${strip(mcpUrl)}` },
  ...tools.map((text) => ({ cmd: false, text: `→ ${text}` })),
].map((line) => {
  const at = clock;
  clock += lineFrames(line);
  return { cmd: line.cmd, text: line.text, at };
});

const terminalFrames = clock + FPS * 2;

const Terminal = () => (
  <div
    style={{
      background: colors.darkPage,
      color: colors.darkInk,
      borderRadius: 18,
      fontFamily: fonts.mono,
      fontSize: 30,
      lineHeight: 1.5,
      padding: 40,
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}
  >
    {termLines.map((line) => (
      <div
        key={line.text}
        style={{ color: line.cmd ? colors.darkInk : colors.darkMuted, whiteSpace: "pre", minHeight: 45 }}
      >
        {line.cmd ? (
          <Typed text={line.text} at={line.at} cps={CPS} />
        ) : (
          <Reveal at={line.at}>
            <span style={line.text.startsWith("→") ? { color: colors.darkAccent } : {}}>{line.text}</span>
          </Reveal>
        )}
      </div>
    ))}
  </div>
);

/** Post 6: the site has a second audience. */
export const agentsScenes = (lang: Lang): Scene[] => {
  const t = getDict(lang);
  const copy = videoCopy[lang];
  const tag = <Label>{copy.agentsTag}</Label>;
  return [
    {
      name: "hook",
      frames: readFrames(copy.agentsHook),
      node: (
        <Page t={t} tag={tag}>
          <Reveal>
            <Title size={108}>{copy.agentsHook}</Title>
          </Reveal>
        </Page>
      ),
    },
    {
      name: "terminal",
      frames: terminalFrames,
      node: (
        <Page t={t} tag={tag}>
          <Terminal />
        </Page>
      ),
    },
    {
      name: "ask",
      frames: readFrames(`${copy.agentsBody} ${copy.agentsAsk}`),
      node: (
        <Page t={t} tag={tag}>
          <Reveal>
            <Body>{copy.agentsBody}</Body>
          </Reveal>
          <Reveal at={FPS * 2}>
            <Title size={64}>{copy.agentsAsk}</Title>
          </Reveal>
        </Page>
      ),
    },
    { name: "end", frames: END_FRAMES, node: <EndCard t={t} /> },
  ];
};
