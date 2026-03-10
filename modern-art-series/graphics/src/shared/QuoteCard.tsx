import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { palette, fonts } from "./palette";

export const QuoteCard: React.FC<{
  quote: string;
  attribution: string;
  color?: string;
}> = ({ quote, attribution, color = palette.amber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textIn = spring({ frame, fps, config: { damping: 200 } });
  const lineWidth = interpolate(
    spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.5 * fps) }),
    [0, 1], [0, 400],
  );
  const attrIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1 * fps) });

  return (
    <div style={{
      width: "100%", height: "100%", backgroundColor: palette.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: fonts.serif, padding: 120,
    }}>
      <div style={{
        color, fontSize: 66, fontStyle: "italic", textAlign: "center",
        lineHeight: 1.5, opacity: textIn, transform: `translateY(${(1 - textIn) * 15}px)`,
      }}>
        &ldquo;{quote}&rdquo;
      </div>
      <div style={{
        width: lineWidth, height: 2, backgroundColor: palette.maroon,
        marginTop: 45, marginBottom: 45, opacity: 0.5,
      }} />
      <div style={{
        color: palette.peach, fontSize: 30, opacity: attrIn * 0.7,
      }}>
        {attribution}
      </div>
    </div>
  );
};
