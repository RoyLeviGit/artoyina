import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { palette, fonts } from "../shared/palette";

// Proportional canvas size comparison.
// Dimensions are in cm, rendered as proportional rectangles.
const PAINTINGS = [
  {
    title: "Oath of the Horatii",
    artist: "David, 1784",
    wCm: 425,
    hCm: 330,
    color: palette.peach,
  },
  {
    title: "A Burial at Ornans",
    artist: "Courbet, 1849–50",
    wCm: 668,
    hCm: 315,
    color: palette.amber,
    highlight: true,
  },
  {
    title: "The Coronation of Napoleon",
    artist: "David, 1805–07",
    wCm: 979,
    hCm: 621,
    color: palette.peach,
  },
];

const MAX_DISPLAY_W = 900; // px at 1920-wide base; scaled to 4K in outer container
const MAX_DISPLAY_H = 500;

export const ScaleComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });

  // Max real dimension across all paintings (for scaling)
  const maxW = Math.max(...PAINTINGS.map((p) => p.wCm));
  const maxH = Math.max(...PAINTINGS.map((p) => p.hCm));

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
          letterSpacing: 5,
          textAlign: "center",
          opacity: titleIn,
          marginBottom: 80,
        }}
      >
        CANVAS SIZE — TO SCALE
      </div>

      {/* Paintings row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 140,
        }}
      >
        {PAINTINGS.map((p, i) => {
          const delay = Math.round((0.4 + i * 0.5) * fps);
          const paintingIn = spring({ frame, fps, config: { damping: 200 }, delay });
          const scaleUp = interpolate(paintingIn, [0, 1], [0.6, 1]);

          const scaleFactor = 2; // 2× the base sizes for 4K
          const displayW = (p.wCm / maxW) * MAX_DISPLAY_W * scaleFactor;
          const displayH = (p.hCm / maxH) * MAX_DISPLAY_H * scaleFactor;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: paintingIn,
                transform: `scaleY(${scaleUp})`,
                transformOrigin: "bottom center",
              }}
            >
              {/* Dimensions label above */}
              <div
                style={{
                  color: p.highlight ? palette.amber : palette.peach,
                  fontSize: 30,
                  fontStyle: "italic",
                  marginBottom: 20,
                  opacity: 0.75,
                  whiteSpace: "nowrap",
                }}
              >
                {p.hCm} × {p.wCm} cm
              </div>
              {/* Rectangle */}
              <div
                style={{
                  width: displayW,
                  height: displayH,
                  backgroundColor: p.highlight ? palette.amber : "transparent",
                  border: `3px solid ${p.color}`,
                  opacity: p.highlight ? 0.18 : 0.12,
                  borderRadius: 3,
                  position: "relative",
                }}
              >
                {p.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: palette.amber,
                      opacity: 0.08,
                      borderRadius: 3,
                    }}
                  />
                )}
              </div>
              {/* Human scale reference */}
              <div
                style={{
                  width: 3,
                  height: 80,
                  backgroundColor: palette.peach,
                  opacity: 0.2,
                  marginTop: 0,
                }}
              />
              {/* Labels below */}
              <div style={{ marginTop: 28, textAlign: "center" }}>
                <div
                  style={{
                    color: p.highlight ? palette.amber : palette.peach,
                    fontSize: p.highlight ? 44 : 36,
                    fontWeight: p.highlight ? 700 : 400,
                    fontStyle: "italic",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    color: palette.peach,
                    fontSize: 26,
                    opacity: 0.55,
                    marginTop: 10,
                  }}
                >
                  {p.artist}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footnote */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          color: palette.peach,
          fontSize: 24,
          opacity: titleIn * 0.35,
          letterSpacing: 2,
        }}
      >
        Rectangles shown to scale relative to each other
      </div>
    </div>
  );
};
