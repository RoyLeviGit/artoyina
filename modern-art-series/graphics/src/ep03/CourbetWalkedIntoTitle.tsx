import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../shared/palette";

const BG = "#01321F";
const FG = "#F4A731";

const AnimatedMainTitle: React.FC<{ title: React.ReactNode }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introFrames = Math.round(fps);
  const intro = spring({
    fps,
    frame: Math.min(frame, introFrames),
    config: {
      damping: 200,
      mass: 0.9,
      stiffness: 90,
    },
    durationInFrames: introFrames,
  });

  const opacity = interpolate(intro, [0, 1], [0, 1]);
  const translateY = interpolate(intro, [0, 1], [72, 0]);
  const scale = interpolate(intro, [0, 1], [0.972, 1]);
  const shadowOpacity = interpolate(intro, [0, 1], [0, 0.28]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 140px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          color: FG,
          fontFamily: fonts.serif,
          fontSize: 120,
          fontWeight: 600,
          letterSpacing: 5,
          lineHeight: 1.08,
          textAlign: "center",
          textTransform: "uppercase",
          maxWidth: 1500,
          opacity,
          transform: `translateY(${translateY}px) scale(${scale})`,
          textShadow: `0 8px 28px rgba(0, 0, 0, ${shadowOpacity})`,
        }}
      >
        {title}
      </div>
    </div>
  );
};

export const CourbetWalkedIntoTitle = () => (
  <AnimatedMainTitle title="THE WORLD COURBET WALKED INTO" />
);

export const GustaveCourbetMainTitle = () => (
  <AnimatedMainTitle title="GUSTAVE COURBET" />
);

export const BurialAtOrnansMainTitle = () => (
  <AnimatedMainTitle title="A BURIAL AT ORNANS" />
);

export const StoneBreakersMainTitle = () => (
  <AnimatedMainTitle title="THE STONE BREAKERS" />
);

export const PavilionOfRealismMainTitle = () => (
  <AnimatedMainTitle title="THE PAVILION OF REALISM" />
);

export const PaintersStudioMainTitle = () => (
  <AnimatedMainTitle title="THE PAINTER'S STUDIO" />
);

export const RealismBeyondCourbetMainTitle = () => (
  <AnimatedMainTitle title="REALISM BEYOND COURBET" />
);

export const RealismTakenAllTheWayMainTitle = () => (
  <AnimatedMainTitle
    title={
      <>
        REALISM TAKEN
        <br />
        ALL THE WAY
      </>
    }
  />
);

export const CommuneAndExileMainTitle = () => (
  <AnimatedMainTitle
    title={
      <>
        THE COMMUNE
        <br />
        AND EXILE
      </>
    }
  />
);

export const LegacyMainTitle = () => (
  <AnimatedMainTitle title="THE LEGACY" />
);
