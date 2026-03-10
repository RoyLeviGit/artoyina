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
        color: palette.amber, fontSize: 24, letterSpacing: 4,
        opacity: titleIn * 0.6, marginBottom: 70,
      }}>
        {title}
      </div>
      {events.map((event, i) => {
        const delay = Math.round((0.5 + i * 0.7) * fps);
        const eventIn = spring({ frame, fps, config: { damping: 200 }, delay });
        const y = interpolate(eventIn, [0, 1], [25, 0]);
        const c = event.color || palette.amber;

        return (
          <div key={i} style={{ opacity: eventIn, transform: `translateY(${y}px)`, marginBottom: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: c, fontSize: 46, fontWeight: 700 }}>{event.date}</div>
              <div style={{ color: palette.peach, fontSize: 28, fontStyle: "italic", marginTop: 8 }}>
                {event.label}
              </div>
            </div>
            {i < events.length - 1 && (
              <div style={{
                width: 400, height: 1, backgroundColor: palette.maroon,
                opacity: 0.3, margin: "22px auto",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};
