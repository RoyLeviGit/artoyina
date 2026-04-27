import { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, useDelayRender, interpolate, spring } from "remotion";
import mapboxgl, { Map } from "mapbox-gl";
import { palette, fonts } from "../shared/palette";
import { hideMapLabels } from "../shared/mapUtils";

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

// Four stops across the world — no animated route (too wide for Mercator at this zoom)
// Instead: dots fade in sequentially, world map wide enough to show all four.
const STOPS: {
  coords: [number, number];
  name: string;
  sub: string;
  wave: number;
}[] = [
  { coords: [2.3522, 48.8566], name: "Paris", sub: "Career, family, stockbroker — then abandons it all", wave: 1 },
  { coords: [-3.7445, 47.8584], name: "Pont-Aven", sub: "Brittany — Vision After the Sermon, 1888", wave: 2 },
  { coords: [-149.4068, -17.6509], name: "Tahiti", sub: "First voyage 1891–93, second 1895–1901", wave: 3 },
  { coords: [-138.5, -9.0], name: "Marquesas Islands", sub: "Dies here 1903, age 54", wave: 4 },
];

export const GauguinMap: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { delayRender, continueRender } = useDelayRender();
  const [mapHandle] = useState(() => delayRender("Loading map..."));
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const _map = new Map({
      container: ref.current!,
      zoom: 1.4,
      // Center chosen so both Europe (2°E) and Pacific (-149°W) are visible.
      // Mapbox wraps, so centering on ~90°W (Atlantic) works at low zoom.
      center: [-80, 20],
      pitch: 0,
      bearing: 0,
      style: "mapbox://styles/mapbox/dark-v11",
      interactive: false,
      fadeDuration: 0,
    });

    _map.on("load", () => {
      hideMapLabels(_map);

      for (const wave of [1, 2, 3, 4]) {
        const waveSites = STOPS.filter((s) => s.wave === wave);
        _map.addSource(`stops-w${wave}`, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: waveSites.map((s) => ({
              type: "Feature" as const,
              properties: { name: s.name, sub: s.sub },
              geometry: { type: "Point" as const, coordinates: s.coords },
            })),
          },
        });

        const isLast = wave === 4;
        _map.addLayer({
          id: `dots-w${wave}`,
          type: "circle",
          source: `stops-w${wave}`,
          paint: {
            "circle-radius": 14,
            "circle-color": isLast ? palette.maroon : palette.amber,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#000",
            "circle-opacity": 0,
          },
        });
        _map.addLayer({
          id: `names-w${wave}`,
          type: "symbol",
          source: `stops-w${wave}`,
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
            "text-size": 36,
            "text-offset": [0, -1.4],
            "text-anchor": "bottom",
            "text-allow-overlap": true,
          },
          paint: {
            "text-color": isLast ? palette.maroon : palette.amber,
            "text-halo-color": "#000",
            "text-halo-width": 3,
            "text-opacity": 0,
          },
        });
        _map.addLayer({
          id: `subs-w${wave}`,
          type: "symbol",
          source: `stops-w${wave}`,
          layout: {
            "text-field": ["get", "sub"],
            "text-font": ["DIN Pro Italic", "Arial Unicode MS Regular"],
            "text-size": 22,
            "text-offset": [0, 1.3],
            "text-anchor": "top",
            "text-allow-overlap": true,
            "text-max-width": 16,
          },
          paint: {
            "text-color": palette.peach,
            "text-halo-color": "#000",
            "text-halo-width": 2,
            "text-opacity": 0,
          },
        });
      }

      continueRender(mapHandle);
      setMap(_map);
    });
  }, [mapHandle]);

  useEffect(() => {
    if (!map) return;
    const handle = delayRender("Fading waves...");
    const t = frame / fps;

    for (let wave = 1; wave <= 4; wave++) {
      const start = 1.0 + (wave - 1) * 1.8;
      const opacity = interpolate(t, [start, start + 1.0], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      map.setPaintProperty(`dots-w${wave}`, "circle-opacity", opacity);
      map.setPaintProperty(`dots-w${wave}`, "circle-stroke-opacity", opacity);
      map.setPaintProperty(`names-w${wave}`, "text-opacity", opacity);
      map.setPaintProperty(`subs-w${wave}`, "text-opacity", opacity * 0.75);
    }

    map.once("idle", () => continueRender(handle));
  }, [frame, map, fps]);

  const style: React.CSSProperties = useMemo(
    () => ({ width, height, position: "absolute" as const }),
    [width, height],
  );
  const titleIn = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill>
      <div ref={ref} style={style} />
      <div
        style={{
          position: "absolute",
          top: 50,
          width: "100%",
          textAlign: "center",
          fontFamily: fonts.serif,
          opacity: titleIn,
        }}
      >
        <div style={{ color: palette.amber, fontSize: 28, letterSpacing: 4, textShadow: "0 2px 12px #000" }}>
          GAUGUIN&apos;S FLIGHT FROM EUROPE
        </div>
        <div style={{ color: palette.peach, fontSize: 18, fontStyle: "italic", marginTop: 8, opacity: 0.7, textShadow: "0 2px 12px #000" }}>
          Paris → Brittany → Tahiti → Marquesas, 1888–1903
        </div>
      </div>
    </AbsoluteFill>
  );
};
