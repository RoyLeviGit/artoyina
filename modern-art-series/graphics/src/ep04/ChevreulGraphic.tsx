import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { palette, fonts } from "../shared/palette";

// Demonstrates Chevreul's simultaneous contrast:
// The same grey square looks different on a warm vs. cool background.
// Phase 1: reveal the two squares on colored backgrounds
// Phase 2: strip backgrounds to show they're identical

const GREY = "#888888";
const WARM_BG = "#8B2500"; // deep red-orange
const COOL_BG = "#1A3A6E"; // deep blue

export const ChevreulGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const squaresIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.5 * fps) });
  const labelIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.2 * fps) });

  // Phase 2: at 4 seconds, strip backgrounds to show they're the same
  const stripProgress = interpolate(frame / fps, [4.5, 5.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const revealIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(5.8 * fps) });

  // Interpolate background colors to neutral grey
  const warmBgOpacity = interpolate(stripProgress, [0, 1], [1, 0]);
  const coolBgOpacity = interpolate(stripProgress, [0, 1], [1, 0]);

  const SQUARE_SIZE = 500; // px at 3840 base

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
          marginBottom: 100,
        }}
      >
        SIMULTANEOUS CONTRAST — CHEVREUL, 1839
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 200,
          alignItems: "center",
          opacity: squaresIn,
        }}
      >
        {/* Left: warm background */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
          <div
            style={{
              width: SQUARE_SIZE + 160,
              height: SQUARE_SIZE + 160,
              backgroundColor: WARM_BG,
              opacity: warmBgOpacity,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              position: "relative",
            }}
          >
            {/* Grey square always visible */}
            <div
              style={{
                position: "absolute",
                width: SQUARE_SIZE,
                height: SQUARE_SIZE,
                backgroundColor: GREY,
                borderRadius: 4,
              }}
            />
          </div>
          {/* Grey square shown when background strips away */}
          <div
            style={{
              width: SQUARE_SIZE + 160,
              height: SQUARE_SIZE + 160,
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              opacity: stripProgress,
            }}
          >
            <div
              style={{
                width: SQUARE_SIZE,
                height: SQUARE_SIZE,
                backgroundColor: GREY,
                borderRadius: 4,
                border: `2px solid ${palette.peach}`,
                opacity: 0.3,
              }}
            />
          </div>
          <div style={{ color: palette.peach, fontSize: 30, opacity: labelIn * 0.7, textAlign: "center" }}>
            On a warm background
          </div>
          <div
            style={{
              color: palette.peach,
              fontSize: 24,
              fontStyle: "italic",
              opacity: labelIn * 0.45,
              textAlign: "center",
            }}
          >
            Appears cooler, slightly blue
          </div>
        </div>

        {/* VS divider */}
        <div
          style={{
            color: palette.peach,
            fontSize: 38,
            opacity: labelIn * 0.4,
            letterSpacing: 4,
          }}
        >
          SAME GREY
        </div>

        {/* Right: cool background */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
          <div
            style={{
              width: SQUARE_SIZE + 160,
              height: SQUARE_SIZE + 160,
              backgroundColor: COOL_BG,
              opacity: coolBgOpacity,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: SQUARE_SIZE,
                height: SQUARE_SIZE,
                backgroundColor: GREY,
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ color: palette.peach, fontSize: 30, opacity: labelIn * 0.7, textAlign: "center" }}>
            On a cool background
          </div>
          <div
            style={{
              color: palette.peach,
              fontSize: 24,
              fontStyle: "italic",
              opacity: labelIn * 0.45,
              textAlign: "center",
            }}
          >
            Appears warmer, slightly orange
          </div>
        </div>
      </div>

      {/* Phase 2 reveal label */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          textAlign: "center",
          opacity: revealIn,
        }}
      >
        <div style={{ color: palette.amber, fontSize: 36, letterSpacing: 3 }}>
          BOTH SQUARES ARE IDENTICAL
        </div>
        <div
          style={{
            color: palette.peach,
            fontSize: 26,
            fontStyle: "italic",
            marginTop: 20,
            opacity: 0.65,
          }}
        >
          Your eye invents the difference. The Impressionists built a technique on this fact.
        </div>
      </div>
    </div>
  );
};
