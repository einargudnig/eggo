import { Composition, Folder } from "remotion";
import { caseIds } from "../../src/content/work";
import { langs, type Lang } from "../../src/i18n";
import { agentsScenes } from "./Agents";
import { caseScenes } from "./Case";
import { type Scene, Scenes, totalFrames } from "./kit";
import { launchScenes } from "./Launch";
import { formats, FPS } from "./theme";

const videos = {
  launch: launchScenes,
  agents: agentsScenes,
  ...Object.fromEntries(caseIds.map((id) => [id, (lang: Lang) => caseScenes(id, lang)])),
} as Record<string, (lang: Lang) => Scene[]>;

type Props = { video: string; lang: Lang };

const Video = ({ video, lang }: Props) => <Scenes scenes={videos[video]?.(lang) ?? []} />;

/** Composition ids read `<video>-<lang>-<format>`, which is also the rendered file name. */
export const Root = () => (
  <>
    {Object.entries(videos).map(([video, scenes]) => (
      <Folder key={video} name={video}>
        {langs.flatMap((lang) =>
          Object.entries(formats).map(([format, size]) => (
            <Composition
              key={`${lang}-${format}`}
              id={`${video}-${lang}-${format}`}
              component={Video}
              defaultProps={{ video, lang } satisfies Props}
              durationInFrames={totalFrames(scenes(lang))}
              fps={FPS}
              {...size}
            />
          )),
        )}
      </Folder>
    ))}
  </>
);
