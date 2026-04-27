import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { palette, fonts } from "../shared/palette";

// Branching diagram: three Post-Impressionist painters → the movements they seeded.
// Animates top-to-bottom, one row at a time.

const ROWS = [
  {
    artist: "CÉZANNE",
    approach: "Find the structure underneath the surface",
    arrow: "→",
    movement: "CUBISM",
    movementSub: "Picasso · Braque · the architecture of 20th-century art",
    color: palette.peach,
  },
  {
    artist: "VAN GOGH",
    approach: "Express what you feel, not just what you see",
    arrow: "→",
    movement: "EXPRESSIONISM",
    movementSub: "Munch · Kirchner · the inner life as subject",
    color: palette.amber,
  },
  {
    artist: "GAUGUIN",
    approach: "Paint what you dream, remember, believe",
    arrow: "→",
    movement: "SYMBOLISM & PRIMITIVISM",
    movementSub: "Matisse · the idea that art draws from myth and memory",
    color: "#E8A87C", // warm terracotta
  },
];

export const ThreePathsGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });

  return (
    <div
      style={{
        width: 3840,
        height: 2160,
        backgroundColor: palette.bg,
        fontFamily: fonts.serif,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* Title */}
      <div
        style={{
          color: palette.amber,
          fontSize: 52,
          letterSpacing: 6,
          marginBottom: 100,
          opacity: titleIn,
        }}
      >
        THREE QUESTIONS — THREE PATHS
      </div>

      {/* Rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 80,
          width: 3200,
        }}
      >
        {ROWS.map((row, i) => {
          const delay = Math.round((0.4 + i * 0.9) * fps);
          const rowIn = spring({ frame, fps, config: { damping: 200 }, delay });
          const arrowWidth = interpolate(
            spring({ frame, fps, config: { damping: 200 }, delay: Math.round((0.7 + i * 0.9) * fps) }),
            [0, 1],
            [0, 260],
          );
          const rightIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round((1.0 + i * 0.9) * fps) });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 60,
              }}
            >
              {/* Left: artist + approach */}
              <div
                style={{
                  width: 1100,
                  opacity: rowIn,
                  transform: `translateX(${(1 - rowIn) * -30}px)`,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    color: row.color,
                    fontSize: 60,
                    fontWeight: 700,
                    letterSpacing: 4,
                  }}
                >
                  {row.artist}
                </div>
                <div
                  style={{
                    color: palette.peach,
                    fontSize: 30,
                    fontStyle: "italic",
                    marginTop: 14,
                    opacity: 0.65,
                    lineHeight: 1.5,
                  }}
                >
                  {row.approach}
                </div>
              </div>

              {/* Arrow */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                  width: 260,
                }}
              >
                <div
                  style={{
                    height: 2,
                    width: arrowWidth,
                    backgroundColor: row.color,
                    opacity: 0.5,
                  }}
                />
                <div
                  style={{
                    color: row.color,
                    fontSize: 50,
                    opacity: arrowWidth > 200 ? 0.6 : 0,
                    marginLeft: -8,
                    lineHeight: 1,
                  }}
                >
                  ›
                </div>
              </div>

              {/* Right: movement */}
              <div
                style={{
                  flex: 1,
                  opacity: rightIn,
                  transform: `translateX(${(1 - rightIn) * 30}px)`,
                  borderLeft: `3px solid ${row.color}`,
                  paddingLeft: 60,
                }}
              >
                <div
                  style={{
                    color: row.color,
                    fontSize: 52,
                    fontWeight: 700,
                    letterSpacing: 3,
                  }}
                >
                  {row.movement}
                </div>
                <div
                  style={{
                    color: palette.peach,
                    fontSize: 26,
                    marginTop: 12,
                    opacity: 0.55,
                    lineHeight: 1.5,
                  }}
                >
                  {row.movementSub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
