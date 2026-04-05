import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { palette, fonts } from "./palette";

export const SectionTitle: React.FC<{
  title: string;
  subtitle?: string;
}> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const lineWidth = interpolate(
    spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.3 * fps) }),
    [0, 1],
    [0, 500],
  );
  const subIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.6 * fps) });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: palette.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.serif,
      }}
    >
      <div
        style={{
          color: palette.amber,
          fontSize: 240,
          fontWeight: 700,
          letterSpacing: 8,
          textAlign: "center",
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 20}px)`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          width: lineWidth,
          height: 2,
          backgroundColor: palette.maroon,
          marginTop: 40,
          marginBottom: 40,
          opacity: 0.5,
        }}
      />
      {subtitle && (
        <div
          style={{
            color: palette.peach,
            fontSize: 160,
            fontStyle: "italic",
            textAlign: "center",
            opacity: subIn * 0.7,
            transform: `translateY(${(1 - subIn) * 10}px)`,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
