import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { palette, fonts } from "./palette";

type TimelineEvent = {
  year: number;
  label: string;
  sublabel?: string;
  type: "art" | "politics";
  major?: boolean;
  row?: number;
};

export const Timeline: React.FC<{
  title: string;
  subtitle?: string;
  events: TimelineEvent[];
  startYear: number;
  endYear: number;
  eras?: { label: string; start: number; end: number; color: string }[];
}> = ({ title, subtitle, events, startYear, endYear, eras = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineY = 580;
  const margin = 140;
  const lineWidth = 1920 - margin * 2;
  const yearSpan = endYear - startYear;

  const yearToX = (year: number) => margin + ((year - startYear) / yearSpan) * lineWidth;

  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const lineIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.3 * fps) });
  const erasIn = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.8 * fps) });

  return (
    <div style={{
      width: 1920, height: 1080, backgroundColor: palette.bg,
      fontFamily: fonts.serif, position: "relative", overflow: "hidden",
    }}>
      {/* Title */}
      <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", opacity: titleIn }}>
        <div style={{ color: palette.amber, fontSize: 38, letterSpacing: 4 }}>{title}</div>
        {subtitle && <div style={{ color: palette.peach, fontSize: 26, fontStyle: "italic", marginTop: 10, opacity: 0.5 }}>{subtitle}</div>}
      </div>

      {/* Era bands */}
      {eras.map((era, i) => {
        const x1 = yearToX(era.start);
        const x2 = yearToX(era.end);
        return (
          <div key={`era-${i}`} style={{ opacity: erasIn }}>
            <div style={{ position: "absolute", left: x1, top: lineY - 2, width: x2 - x1, height: 4, backgroundColor: era.color, opacity: 0.25, borderRadius: 2 }} />
            <div style={{ position: "absolute", left: x1 + (x2 - x1) / 2, top: lineY + 18, transform: "translateX(-50%)", color: era.color, fontSize: 15, letterSpacing: 3, opacity: 0.7, whiteSpace: "nowrap" }}>
              {era.label}
            </div>
          </div>
        );
      })}

      {/* Main line */}
      <div style={{ position: "absolute", left: margin, top: lineY, width: lineWidth * lineIn, height: 3, backgroundColor: palette.amber }} />

      {/* Events */}
      {events.map((event, i) => {
        const x = yearToX(event.year);
        const delay = Math.round((1 + i * 0.25) * fps);
        const eventIn = spring({ frame, fps, config: { damping: 200 }, delay });
        const isArt = event.type === "art";
        const color = isArt ? palette.amber : palette.peach;
        const row = event.row ?? 1;

        // Art above, politics below. Rows spread them out vertically.
        const rowSpacing = 70;
        const baseOffset = 70;
        const offset = baseOffset + (row - 1) * rowSpacing;
        const labelY = isArt ? lineY - offset : lineY + offset + 10;

        // Tick connects label to line
        const tickTop = isArt ? labelY + 28 : lineY + 4;
        const tickHeight = isArt ? lineY - labelY - 28 : labelY - lineY - 22;

        const slideDir = isArt ? 10 : -10;
        const y = interpolate(eventIn, [0, 1], [slideDir, 0]);

        return (
          <div key={`ev-${i}`} style={{ opacity: eventIn, transform: `translateY(${y}px)` }}>
            {/* Tick */}
            <div style={{ position: "absolute", left: x, top: tickTop, width: 1.5, height: Math.max(tickHeight, 0), backgroundColor: color, opacity: 0.35 }} />

            {/* Dot */}
            {event.major
              ? <div style={{ position: "absolute", left: x - 6, top: lineY - 6, width: 12, height: 12, borderRadius: "50%", backgroundColor: color }} />
              : <div style={{ position: "absolute", left: x - 4, top: lineY - 4, width: 8, height: 8, borderRadius: "50%", backgroundColor: color, opacity: 0.6 }} />
            }

            {/* Year + Label combined */}
            <div style={{
              position: "absolute", left: x, top: labelY,
              transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap",
            }}>
              <div style={{
                color, fontSize: event.major ? 28 : 23,
                fontWeight: 700,
              }}>
                {event.year}
              </div>
              <div style={{
                color, fontSize: event.major ? 24 : 20,
                fontStyle: isArt ? "italic" : "normal",
                fontWeight: event.major ? 600 : 400,
                marginTop: 2,
              }}>
                {event.label}
              </div>
            </div>

            {/* Sublabel */}
            {event.sublabel && (
              <div style={{
                position: "absolute", left: x,
                top: isArt ? labelY + 58 : labelY + 62,
                transform: "translateX(-50%)", whiteSpace: "nowrap",
                color: palette.peach, fontSize: 17, opacity: 0.5,
              }}>
                {event.sublabel}
              </div>
            )}
          </div>
        );
      })}

      {/* Legend */}
      <div style={{ position: "absolute", bottom: 40, left: margin, display: "flex", gap: 30, opacity: erasIn * 0.6 }}>
        {[{ c: palette.amber, l: "Artwork" }, { c: palette.peach, l: "Political event" }].map(({ c, l }) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: c }} />
            <span style={{ color: c, fontSize: 17 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
