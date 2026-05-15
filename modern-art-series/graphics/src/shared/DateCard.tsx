import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { palette, fonts } from "./palette";

type DateEvent = { date: string; label: string; color?: string };

export const DateCard: React.FC<{
  title: string;
  events: DateEvent[];
}> = ({ title, events }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });

  return (
    <div style={{
      width: "100%", height: "100%", backgroundColor: palette.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: fonts.serif,
    }}>
      <div style={{
        color: palette.amber, fontSize: 80, letterSpacing: 8,
        opacity: titleIn * 0.6, marginBottom: 100,
      }}>
        {title}
      </div>
      {events.map((event, i) => {
        const delay = Math.round((0.5 + i * 0.7) * fps);
        const eventIn = spring({ frame, fps, config: { damping: 200 }, delay });
        const y = interpolate(eventIn, [0, 1], [25, 0]);
        const c = event.color || palette.amber;

        return (
          <div key={i} style={{ opacity: eventIn, transform: `translateY(${y}px)`, marginBottom: 40 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: c, fontSize: 140, fontWeight: 700 }}>{event.date}</div>
              <div style={{ color: palette.peach, fontSize: 80, fontStyle: "italic", marginTop: 16 }}>
                {event.label}
              </div>
            </div>
            {i < events.length - 1 && (
              <div style={{
                width: 800, height: 2, backgroundColor: palette.maroon,
                opacity: 0.3, margin: "40px auto",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};
