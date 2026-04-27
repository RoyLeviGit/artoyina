import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { palette, fonts } from "../shared/palette";

// Text-based split-screen comparison overlay.
// In Premiere, composite this over the two paintings side-by-side.
export const IngresVsDelacroix: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftIn = spring({ frame, fps, config: { damping: 200 } });
  const dividerIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.4 * fps) });
  const rightIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.5 * fps) });
  const labelsIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.0 * fps) });
  const vsIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.8 * fps) });

  const dividerHeight = interpolate(dividerIn, [0, 1], [0, 2160]);

  return (
    <div
      style={{
        width: 3840,
        height: 2160,
        backgroundColor: "transparent",
        display: "flex",
        fontFamily: fonts.serif,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left overlay label — Ingres */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 120,
          opacity: leftIn,
          transform: `translateX(${(1 - leftIn) * -30}px)`,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(26,23,20,0.82)",
            padding: "48px 72px",
            borderRadius: 8,
            textAlign: "center",
            opacity: labelsIn,
          }}
        >
          <div style={{ color: palette.amber, fontSize: 64, fontWeight: 700, letterSpacing: 4 }}>
            INGRES
          </div>
          <div style={{ color: palette.peach, fontSize: 36, fontStyle: "italic", marginTop: 14, opacity: 0.85 }}>
            Grande Odalisque, 1814
          </div>
          <div
            style={{
              marginTop: 32,
              color: palette.peach,
              fontSize: 30,
              lineHeight: 1.7,
              opacity: 0.65,
            }}
          >
            Line &nbsp;·&nbsp; Contour &nbsp;·&nbsp; Classical form
          </div>
          <div
            style={{
              marginTop: 18,
              color: palette.peach,
              fontSize: 26,
              fontStyle: "italic",
              opacity: 0.5,
            }}
          >
            &ldquo;Drawing is the probity of art.&rdquo;
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 2,
          height: dividerHeight,
          backgroundColor: palette.maroon,
          alignSelf: "center",
          opacity: 0.6,
          flexShrink: 0,
        }}
      />

      {/* VS label */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: vsIn,
          zIndex: 10,
        }}
      >
        <div
          style={{
            backgroundColor: palette.bg,
            border: `2px solid ${palette.maroon}`,
            borderRadius: "50%",
            width: 120,
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: palette.peach,
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          VS
        </div>
      </div>

      {/* Right overlay label — Delacroix */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 120,
          opacity: rightIn,
          transform: `translateX(${(1 - rightIn) * 30}px)`,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(26,23,20,0.82)",
            padding: "48px 72px",
            borderRadius: 8,
            textAlign: "center",
            opacity: labelsIn,
          }}
        >
          <div style={{ color: palette.amber, fontSize: 64, fontWeight: 700, letterSpacing: 4 }}>
            DELACROIX
          </div>
          <div style={{ color: palette.peach, fontSize: 36, fontStyle: "italic", marginTop: 14, opacity: 0.85 }}>
            Liberty Leading the People, 1830
          </div>
          <div
            style={{
              marginTop: 32,
              color: palette.peach,
              fontSize: 30,
              lineHeight: 1.7,
              opacity: 0.65,
            }}
          >
            Color &nbsp;·&nbsp; Motion &nbsp;·&nbsp; Raw emotion
          </div>
          <div
            style={{
              marginTop: 18,
              color: palette.peach,
              fontSize: 26,
              fontStyle: "italic",
              opacity: 0.5,
            }}
          >
            &ldquo;Color is the music of the eye.&rdquo;
          </div>
        </div>
      </div>

      {/* Bottom caption */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          width: "100%",
          textAlign: "center",
          opacity: labelsIn * 0.45,
        }}
      >
        <div
          style={{
            color: palette.peach,
            fontSize: 26,
            letterSpacing: 5,
            textShadow: "0 2px 12px #000",
          }}
        >
          LINE VS. COLOR — THE DEFINING DEBATE OF FRENCH ART, 1820–1850
        </div>
      </div>
    </div>
  );
};
