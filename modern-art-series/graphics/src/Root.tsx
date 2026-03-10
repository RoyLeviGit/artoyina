import "./index.css";
import { Composition, Folder } from "remotion";
import { QuoteWinckelmann, QuoteHemlock, QuotePatriotism } from "./ep01/Quotes";
import { RevolutionDates } from "./ep01/Dates";
import { DavidTimeline } from "./ep01/DavidTimeline";
import { ExileRoute } from "./ep01/ExileRoute";
import { PompeiiMap } from "./ep01/PompeiiMap";
import { ParisMap } from "./ep01/ParisMap";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="ep01-neoclassicism">
      <Folder name="text-cards">
        <Composition id="ep01-quote-winckelmann" component={QuoteWinckelmann} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="ep01-quote-hemlock" component={QuoteHemlock} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="ep01-quote-patriotism" component={QuotePatriotism} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="ep01-dates-revolution" component={RevolutionDates} durationInFrames={210} fps={30} width={1920} height={1080} />
      </Folder>
      <Folder name="timeline">
        <Composition id="ep01-timeline-david" component={DavidTimeline} durationInFrames={300} fps={30} width={1920} height={1080} />
      </Folder>
      <Folder name="maps">
        <Composition id="ep01-map-exile" component={ExileRoute} durationInFrames={240} fps={30} width={1920} height={1080} />
        <Composition id="ep01-map-pompeii" component={PompeiiMap} durationInFrames={270} fps={30} width={1920} height={1080} />
        <Composition id="ep01-map-paris" component={ParisMap} durationInFrames={270} fps={30} width={1920} height={1080} />
      </Folder>
    </Folder>
  );
};
