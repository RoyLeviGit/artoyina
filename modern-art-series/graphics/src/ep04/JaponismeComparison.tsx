import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { palette, fonts } from "../shared/palette";

// Transparent overlay for compositing in Premiere over a Cassatt print + Japanese woodblock.
// Same pattern as ep02 Comparison.tsx.
export const JaponismeComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftIn = spring({ frame, fps, config: { damping: 200 } });
  const dividerIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.4 * fps) });
  const rightIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.5 * fps) });
  const labelsIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.0 * fps) });

  const dividerHeight = interpolate(dividerIn, [0, 1], [0, 2160]);

  const panelStyle = (translateX: number): React.CSSProperties => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 120,
    transform: `translateX(${translateX}px)`,
  });

  const labelBoxStyle: React.CSSProperties = {
    backgroundColor: "rgba(26,23,20,0.82)",
    padding: "48px 72px",
    borderRadius: 8,
    textAlign: "center",
    opacity: labelsIn,
  };

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
      {/* Left — Cassatt */}
      <div style={{ ...panelStyle((1 - leftIn) * -30), opacity: leftIn }}>
        <div style={labelBoxStyle}>
          <div style={{ color: palette.amber, fontSize: 56, fontWeight: 700, letterSpacing: 4 }}>
            MARY CASSATT
          </div>
          <div style={{ color: palette.peach, fontSize: 34, fontStyle: "italic", marginTop: 14, opacity: 0.85 }}>
            The Bath (color aquatint), c. 1891
          </div>
          <div style={{ marginTop: 32, color: palette.peach, fontSize: 28, lineHeight: 1.7, opacity: 0.65 }}>
            Flat color fields &nbsp;·&nbsp; Bold outline
            <br />
            High viewpoint &nbsp;·&nbsp; Cropped composition
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

      {/* Right — Japanese woodblock */}
      <div style={{ ...panelStyle((1 - rightIn) * 30), opacity: rightIn }}>
        <div style={labelBoxStyle}>
          <div style={{ color: palette.amber, fontSize: 56, fontWeight: 700, letterSpacing: 4 }}>
            UTAMARO
          </div>
          <div style={{ color: palette.peach, fontSize: 34, fontStyle: "italic", marginTop: 14, opacity: 0.85 }}>
            Woodblock print, c. 1793–1794
          </div>
          <div style={{ marginTop: 32, color: palette.peach, fontSize: 28, lineHeight: 1.7, opacity: 0.65 }}>
            Flat color fields &nbsp;·&nbsp; Bold outline
            <br />
            High viewpoint &nbsp;·&nbsp; Cropped composition
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
          JAPONISME — THE DIRECT INFLUENCE OF JAPANESE PRINTS ON CASSATT'S TECHNIQUE
        </div>
      </div>
    </div>
  );
};
