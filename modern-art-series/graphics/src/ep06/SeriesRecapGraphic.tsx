import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { palette, fonts } from "../shared/palette";

const EPISODES = [
  { ep: "EP.01", movement: "NEO-CLASSICISM",       years: "1780 – 1830", artists: "David · Canova · Ingres",              color: palette.amber },
  { ep: "EP.02", movement: "ROMANTICISM",           years: "1815 – 1863", artists: "Géricault · Delacroix · Turner",       color: palette.peach },
  { ep: "EP.03", movement: "REALISM",               years: "1848 – 1877", artists: "Courbet · Millet · Daumier",           color: palette.amber },
  { ep: "EP.04", movement: "IMPRESSIONISM",         years: "1863 – 1886", artists: "Monet · Cassatt · Renoir · Degas",     color: "#6EC6A0" },
  { ep: "EP.05", movement: "POST-IMPRESSIONISM",    years: "1880 – 1906", artists: "Cézanne · Van Gogh · Gauguin",         color: "#E8A87C" },
  { ep: "EP.06", movement: "SYMBOLISM + ART NOUVEAU", years: "1885 – 1910", artists: "Moreau · Klimt · Mucha · Gaudí",    color: palette.maroon },
];

export const SeriesRecapGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const titleSpring = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 160px",
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: fonts.serif,
          color: palette.amber,
          fontSize: 38,
          letterSpacing: 8,
          textAlign: "center",
          marginBottom: 12,
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [-20, 0])}px)`,
        }}
      >
        THE CENTURY OF ART
      </div>
      <div
        style={{
          fontFamily: fonts.serif,
          color: palette.peach,
          fontSize: 24,
          fontStyle: "italic",
          letterSpacing: 4,
          textAlign: "center",
          marginBottom: 64,
          opacity: titleSpring * 0.7,
        }}
      >
        A Six-Episode Series
      </div>

      {/* Episode rows */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
        {EPISODES.map((ep, i) => {
          const delay = 0.4 + i * 0.25;
          const rowT = Math.max(0, t - delay);
          const rowSpring = spring({ frame: Math.round(rowT * fps), fps, config: { damping: 180 } });
          const slideX = interpolate(rowSpring, [0, 1], [-80, 0]);

          return (
            <div
              key={ep.ep}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                opacity: rowSpring,
                transform: `translateX(${slideX}px)`,
              }}
            >
              {/* Left accent bar */}
              <div
                style={{
                  width: 6,
                  height: 72,
                  backgroundColor: ep.color,
                  borderRadius: 3,
                  flexShrink: 0,
                  marginRight: 32,
                }}
              />

              {/* Episode number */}
              <div
                style={{
                  fontFamily: fonts.serif,
                  color: ep.color,
                  fontSize: 22,
                  letterSpacing: 4,
                  fontWeight: 700,
                  width: 110,
                  flexShrink: 0,
                }}
              >
                {ep.ep}
              </div>

              {/* Movement name */}
              <div
                style={{
                  fontFamily: fonts.serif,
                  color: "#fff",
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: 2,
                  width: 520,
                  flexShrink: 0,
                }}
              >
                {ep.movement}
              </div>

              {/* Years */}
              <div
                style={{
                  fontFamily: fonts.serif,
                  color: ep.color,
                  fontSize: 24,
                  fontStyle: "italic",
                  width: 220,
                  flexShrink: 0,
                  opacity: 0.9,
                }}
              >
                {ep.years}
              </div>

              {/* Artists */}
              <div
                style={{
                  fontFamily: fonts.serif,
                  color: palette.peach,
                  fontSize: 22,
                  opacity: 0.75,
                  fontStyle: "italic",
                }}
              >
                {ep.artists}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
