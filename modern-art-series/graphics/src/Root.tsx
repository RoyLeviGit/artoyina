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
import {
  TitleWorldAfterDavid,
  TitleTheSublime,
  TitleTheRaft,
  TitleDelacroix,
  TitleNorthAfrica,
  TitleLegacy as TitleLegacyEp02,
} from "./ep02/SectionTitles";
import { QuoteBaudelaire, QuoteDelacroixGreeks, QuoteDelacroixPaint } from "./ep02/Quotes";
import { RomanticismDates } from "./ep02/Dates";
import { RomanticismTimeline } from "./ep02/RomanticismTimeline";
import { EuropeMap } from "./ep02/EuropeMap";
import { NorthAfricaMap } from "./ep02/NorthAfricaMap";
import { IngresVsDelacroix } from "./ep02/Comparison";
import {
  TitleWorldIn1848,
  TitleCourbet,
  TitleBurialAtOrnans,
  TitlePavilion,
  TitleCommune,
  TitleLegacy as TitleLegacyEp03,
} from "./ep03/SectionTitles";
import { QuoteCourbetGoal, QuoteCourbetLiberty } from "./ep03/Quotes";
import { RealismDates } from "./ep03/Dates";
import { RealismTimeline } from "./ep03/RealismTimeline";
import { ScaleComparison } from "./ep03/ScaleComparison";
import { CourbetMap } from "./ep03/CourbetMap";
import { RealismSpreadMap } from "./ep03/RealismSpreadMap";
import {
  TitleTheDoorOpens,
  TitleMonet,
  TitleMaryCassatt,
  TitleTheGroup,
  TitleTheSeries,
  TitleLegacy as TitleLegacyEp04,
} from "./ep04/SectionTitles";
import { QuoteMonetLandscape, QuoteCassattIndependence, QuoteCassattAlone, QuoteRenoirTubes } from "./ep04/Quotes";
import { ImpressionismDates } from "./ep04/Dates";
import { ImpressionismTimeline } from "./ep04/ImpressionismTimeline";
import { ChevreulGraphic } from "./ep04/ChevreulGraphic";
import { JaponismeComparison } from "./ep04/JaponismeComparison";
import { ImpressionistParisMap } from "./ep04/ImpressionistParisMap";
import {
  TitleAfterImpressionism,
  TitleCezanne,
  TitleVanGogh,
  TitleGauguin,
  TitleThreePaths,
} from "./ep05/SectionTitles";
import {
  QuoteVanGoghNonentity,
  QuoteVanGoghColor,
  QuoteVanGoghRisking,
  QuoteCezanneCylinder,
  QuotePicassoCezanne,
} from "./ep05/Quotes";
import { PostImpressionismDates } from "./ep05/Dates";
import { PostImpressionismTimeline } from "./ep05/PostImpressionismTimeline";
import { ThreePathsGraphic } from "./ep05/ThreePathsGraphic";
import { VanGoghMap } from "./ep05/VanGoghMap";
import { GauguinMap } from "./ep05/GauguinMap";
import {
  TitleSymbolistTurn,
  TitleKlimt,
  TitleSecession,
  TitleArtNouveau,
  TitleOrnamentAndCrime,
  TitleTheCenturyTurns,
} from "./ep06/SectionTitles";
import {
  QuoteSecessionMotto,
  QuoteKlimtFreedom,
  QuoteLoosOrnament,
  QuoteSullivanForm,
} from "./ep06/Quotes";
import { SymbolismDates } from "./ep06/Dates";
import { SymbolismTimeline } from "./ep06/SymbolismTimeline";
import { ArtNouveauMap } from "./ep06/ArtNouveauMap";
import { RedonComparison } from "./ep06/RedonComparison";
import { SeriesRecapGraphic } from "./ep06/SeriesRecapGraphic";

const FPS = 59.97;
const W = 3840;
const H = 2160;

export const RemotionRoot: React.FC = () => {
  return (
    <>
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

    <Folder name="ep02-romanticism">
      <Folder name="section-titles">
        <Composition id="ep02-title-world-after-david" component={TitleWorldAfterDavid} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep02-title-the-sublime" component={TitleTheSublime} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep02-title-the-raft" component={TitleTheRaft} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep02-title-delacroix" component={TitleDelacroix} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep02-title-north-africa" component={TitleNorthAfrica} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep02-title-legacy" component={TitleLegacyEp02} durationInFrames={120} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="text-cards">
        <Composition id="ep02-quote-baudelaire" component={QuoteBaudelaire} durationInFrames={360} fps={FPS} width={W} height={H} />
        <Composition id="ep02-quote-delacroix-greeks" component={QuoteDelacroixGreeks} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep02-quote-delacroix-paint" component={QuoteDelacroixPaint} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep02-dates-romanticism" component={RomanticismDates} durationInFrames={480} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="timeline">
        <Composition id="ep02-timeline-romanticism" component={RomanticismTimeline} durationInFrames={600} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="maps">
        <Composition id="ep02-map-europe" component={EuropeMap} durationInFrames={480} fps={FPS} width={W} height={H} />
        <Composition id="ep02-map-north-africa" component={NorthAfricaMap} durationInFrames={600} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="comparisons">
        <Composition id="ep02-comparison-ingres-vs-delacroix" component={IngresVsDelacroix} durationInFrames={480} fps={FPS} width={W} height={H} />
      </Folder>
    </Folder>

    <Folder name="ep03-realism">
      <Folder name="section-titles">
        <Composition id="ep03-title-world-in-1848" component={TitleWorldIn1848} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep03-title-courbet" component={TitleCourbet} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep03-title-burial-at-ornans" component={TitleBurialAtOrnans} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep03-title-pavilion" component={TitlePavilion} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep03-title-commune" component={TitleCommune} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep03-title-legacy" component={TitleLegacyEp03} durationInFrames={120} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="text-cards">
        <Composition id="ep03-quote-courbet-goal" component={QuoteCourbetGoal} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep03-quote-courbet-liberty" component={QuoteCourbetLiberty} durationInFrames={360} fps={FPS} width={W} height={H} />
        <Composition id="ep03-dates-realism" component={RealismDates} durationInFrames={480} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="timeline">
        <Composition id="ep03-timeline-realism" component={RealismTimeline} durationInFrames={600} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="comparisons">
        <Composition id="ep03-scale-comparison" component={ScaleComparison} durationInFrames={480} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="maps">
        <Composition id="ep03-map-courbet" component={CourbetMap} durationInFrames={540} fps={FPS} width={W} height={H} />
        <Composition id="ep03-map-realism-spread" component={RealismSpreadMap} durationInFrames={600} fps={FPS} width={W} height={H} />
      </Folder>
    </Folder>

    <Folder name="ep04-impressionism">
      <Folder name="section-titles">
        <Composition id="ep04-title-the-door-opens" component={TitleTheDoorOpens} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep04-title-monet" component={TitleMonet} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep04-title-mary-cassatt" component={TitleMaryCassatt} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep04-title-the-group" component={TitleTheGroup} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep04-title-the-series" component={TitleTheSeries} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep04-title-legacy" component={TitleLegacyEp04} durationInFrames={120} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="text-cards">
        <Composition id="ep04-quote-monet-landscape" component={QuoteMonetLandscape} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep04-quote-cassatt-independence" component={QuoteCassattIndependence} durationInFrames={360} fps={FPS} width={W} height={H} />
        <Composition id="ep04-quote-cassatt-alone" component={QuoteCassattAlone} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep04-quote-renoir-tubes" component={QuoteRenoirTubes} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep04-dates-impressionism" component={ImpressionismDates} durationInFrames={540} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="timeline">
        <Composition id="ep04-timeline-impressionism" component={ImpressionismTimeline} durationInFrames={600} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="graphics">
        <Composition id="ep04-chevreul-color-demo" component={ChevreulGraphic} durationInFrames={540} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="comparisons">
        <Composition id="ep04-comparison-japonisme" component={JaponismeComparison} durationInFrames={480} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="maps">
        <Composition id="ep04-map-impressionist-paris" component={ImpressionistParisMap} durationInFrames={600} fps={FPS} width={W} height={H} />
      </Folder>
    </Folder>

    <Folder name="ep05-post-impressionism">
      <Folder name="section-titles">
        <Composition id="ep05-title-after-impressionism" component={TitleAfterImpressionism} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep05-title-cezanne" component={TitleCezanne} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep05-title-van-gogh" component={TitleVanGogh} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep05-title-gauguin" component={TitleGauguin} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep05-title-three-paths" component={TitleThreePaths} durationInFrames={120} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="text-cards">
        <Composition id="ep05-quote-vangogh-nonentity" component={QuoteVanGoghNonentity} durationInFrames={420} fps={FPS} width={W} height={H} />
        <Composition id="ep05-quote-vangogh-color" component={QuoteVanGoghColor} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep05-quote-vangogh-risking" component={QuoteVanGoghRisking} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep05-quote-cezanne-cylinder" component={QuoteCezanneCylinder} durationInFrames={360} fps={FPS} width={W} height={H} />
        <Composition id="ep05-quote-picasso-cezanne" component={QuotePicassoCezanne} durationInFrames={240} fps={FPS} width={W} height={H} />
        <Composition id="ep05-dates-post-impressionism" component={PostImpressionismDates} durationInFrames={540} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="timeline">
        <Composition id="ep05-timeline-post-impressionism" component={PostImpressionismTimeline} durationInFrames={600} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="graphics">
        <Composition id="ep05-three-paths" component={ThreePathsGraphic} durationInFrames={480} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="maps">
        <Composition id="ep05-map-van-gogh" component={VanGoghMap} durationInFrames={600} fps={FPS} width={W} height={H} />
        <Composition id="ep05-map-gauguin" component={GauguinMap} durationInFrames={600} fps={FPS} width={W} height={H} />
      </Folder>
    </Folder>

    <Folder name="ep06-symbolism-art-nouveau">
      <Folder name="section-titles">
        <Composition id="ep06-title-symbolist-turn" component={TitleSymbolistTurn} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep06-title-klimt" component={TitleKlimt} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep06-title-secession" component={TitleSecession} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep06-title-art-nouveau" component={TitleArtNouveau} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep06-title-ornament-and-crime" component={TitleOrnamentAndCrime} durationInFrames={120} fps={FPS} width={W} height={H} />
        <Composition id="ep06-title-the-century-turns" component={TitleTheCenturyTurns} durationInFrames={120} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="text-cards">
        <Composition id="ep06-quote-secession-motto" component={QuoteSecessionMotto} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep06-quote-klimt-freedom" component={QuoteKlimtFreedom} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep06-quote-loos-ornament" component={QuoteLoosOrnament} durationInFrames={360} fps={FPS} width={W} height={H} />
        <Composition id="ep06-quote-sullivan-form" component={QuoteSullivanForm} durationInFrames={300} fps={FPS} width={W} height={H} />
        <Composition id="ep06-dates-symbolism" component={SymbolismDates} durationInFrames={540} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="timeline">
        <Composition id="ep06-timeline-symbolism" component={SymbolismTimeline} durationInFrames={600} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="graphics">
        <Composition id="ep06-series-recap" component={SeriesRecapGraphic} durationInFrames={600} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="comparisons">
        <Composition id="ep06-comparison-redon" component={RedonComparison} durationInFrames={480} fps={FPS} width={W} height={H} />
      </Folder>
      <Folder name="maps">
        <Composition id="ep06-map-art-nouveau" component={ArtNouveauMap} durationInFrames={600} fps={FPS} width={W} height={H} />
      </Folder>
    </Folder>
    </>
  );
};
