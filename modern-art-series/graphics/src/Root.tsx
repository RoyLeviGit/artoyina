import "./index.css";
import { Composition, Folder } from "remotion";
import { QuoteWinckelmann, QuoteHemlock, QuotePatriotism } from "./ep01/Quotes";
import { RevolutionDates } from "./ep01/Dates";
import { DavidTimeline } from "./ep01/DavidTimeline";
import { ExileRoute } from "./ep01/ExileRoute";
import { PompeiiMap } from "./ep01/PompeiiMap";
import { ParisMap } from "./ep01/ParisMap";
import {
  TitleWorldBeforeDavid,
  TitleDavidsRise,
  TitleRevolution,
  TitleTheFall,
  TitleLegacy,
} from "./ep01/SectionTitles";

const FPS = 59.97;
const W = 3840;
const H = 2160;

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="ep01-neoclassicism">
      <Folder name="section-titles">
        <Composition id="ep01-title-world-before-david" component={TitleWorldBeforeDavid} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep01-title-davids-rise" component={TitleDavidsRise} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep01-title-revolution" component={TitleRevolution} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep01-title-the-fall" component={TitleTheFall} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep01-title-legacy" component={TitleLegacy} durationInFrames={120} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="text-cards">
        <Composition id="ep01-quote-winckelmann" component={QuoteWinckelmann} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep01-quote-hemlock" component={QuoteHemlock} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep01-quote-patriotism" component={QuotePatriotism} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep01-dates-revolution" component={RevolutionDates} durationInFrames={420} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="timeline">
        <Composition id="ep01-timeline-david" component={DavidTimeline} durationInFrames={600} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="maps">
        <Composition id="ep01-map-exile" component={ExileRoute} durationInFrames={480} fps={FPS} width={W} height={H} />
        <Composition id="ep01-map-pompeii" component={PompeiiMap} durationInFrames={540} fps={FPS} width={W} height={H} />
        <Composition id="ep01-map-paris" component={ParisMap} durationInFrames={540} fps={FPS} width={W} height={H} />
      </Folder>
    </Folder>
  );
};
