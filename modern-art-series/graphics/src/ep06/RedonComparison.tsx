import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { palette, fonts } from "../shared/palette";

export const RedonComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const leftSlide = spring({ frame, fps, config: { damping: 180 } });
  const rightSlide = spring({ frame, fps, config: { damping: 180 } });
  const dividerH = interpolate(t, [0.2, 1.0], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeOpacity = interpolate(t, [0.5, 1.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* Left panel — The Noirs */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "49%",
          height: "100%",
          transform: `translateX(${interpolate(leftSlide, [0, 1], [-60, 0])}px)`,
          opacity: leftSlide,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px 60px",
        }}
      >
        <div
          style={{
            fontFamily: fonts.serif,
            color: palette.peach,
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: 2,
            textShadow: "0 2px 16px #000",
            marginBottom: 16,
          }}
        >
          THE NOIRS
        </div>
        <div
          style={{
            fontFamily: fonts.serif,
            color: palette.peach,
            fontSize: 30,
            fontStyle: "italic",
            opacity: 0.8,
            textShadow: "0 2px 12px #000",
            marginBottom: 24,
          }}
        >
          c. 1865–1890
        </div>
        <div
          style={{
            fontFamily: fonts.serif,
            color: "#fff",
            fontSize: 26,
            lineHeight: 1.6,
            textShadow: "0 2px 12px #000",
            opacity: 0.9,
          }}
        >
          Charcoal · lithography · black ink
          <br />
          Cyclops · spiders · floating eyes
          <br />
          Nightmare imagery, shadow, dread
          <br />
          "The logic of the visible in service
          <br />
          of the invisible"
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          position: "absolute",
          left: "49.5%",
          top: `${(100 - dividerH) / 2}%`,
          width: 6,
          height: `${dividerH}%`,
          backgroundColor: palette.maroon,
          borderRadius: 3,
        }}
      />

      {/* VS badge */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 90,
          height: 90,
          borderRadius: "50%",
          backgroundColor: palette.maroon,
          border: `3px solid ${palette.peach}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.serif,
          color: palette.peach,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 2,
          opacity: badgeOpacity,
          boxShadow: "0 4px 24px #000",
        }}
      >
        THEN
      </div>

      {/* Right panel — Color explosion */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "49%",
          height: "100%",
          transform: `translateX(${interpolate(rightSlide, [0, 1], [60, 0])}px)`,
          opacity: rightSlide,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px 60px",
        }}
      >
        <div
          style={{
            fontFamily: fonts.serif,
            color: palette.amber,
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: 2,
            textShadow: "0 2px 16px #000",
            marginBottom: 16,
          }}
        >
          THE COLOR EXPLOSION
        </div>
        <div
          style={{
            fontFamily: fonts.serif,
            color: palette.amber,
            fontSize: 30,
            fontStyle: "italic",
            opacity: 0.8,
            textShadow: "0 2px 12px #000",
            marginBottom: 24,
          }}
        >
          c. 1890–1916
        </div>
        <div
          style={{
            fontFamily: fonts.serif,
            color: "#fff",
            fontSize: 26,
            lineHeight: 1.6,
            textShadow: "0 2px 12px #000",
            opacity: 0.9,
          }}
        >
          Pastel · oil · vivid pigment
          <br />
          Flowers, butterflies, mythic figures
          <br />
          Cyclops reborn — now luminous
          <br />
          Same imagination, unshackled
          <br />
          from darkness
        </div>
      </div>

      {/* Bottom caption */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          width: "100%",
          textAlign: "center",
          fontFamily: fonts.serif,
          color: palette.peach,
          fontSize: 22,
          opacity: badgeOpacity * 0.7,
          textShadow: "0 2px 10px #000",
          letterSpacing: 2,
        }}
      >
        ODILON REDON — THE SAME VISION, TWO WORLDS
      </div>
    </AbsoluteFill>
  );
};
