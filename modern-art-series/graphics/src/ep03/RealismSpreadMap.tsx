import { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, useDelayRender, interpolate, spring } from "remotion";
import mapboxgl, { Map } from "mapbox-gl";
import { palette, fonts } from "../shared/palette";
import { hideMapLabels } from "../shared/mapUtils";

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

// Cities grouped by wave of arrival — staggered fade-in
const CITIES: { coords: [number, number]; name: string; sub: string; wave: number }[] = [
  // Wave 1 — France: Realism starts here
  { coords: [2.3522, 48.8566], name: "Paris", sub: "Courbet · Daumier · Millet", wave: 1 },
  { coords: [2.6295, 48.4436], name: "Barbizon", sub: "Millet's peasant subjects", wave: 1 },
  // Wave 2 — immediate European neighbors
  { coords: [6.7731, 51.2217], name: "Düsseldorf", sub: "Düsseldorf School — social realism", wave: 2 },
  { coords: [4.3517, 50.8503], name: "Brussels", sub: "Courbet influence spreads", wave: 2 },
  { coords: [-0.1276, 51.5074], name: "London", sub: "Ford Madox Brown — Pre-Raphaelites", wave: 2 },
  // Wave 3 — wider Europe
  { coords: [13.4050, 52.5200], name: "Berlin", sub: "Adolph Menzel — Industrial Realism", wave: 3 },
  { coords: [14.5236, 46.0569], name: "Vienna", sub: "Hans Makart · historical realism", wave: 3 },
  { coords: [37.6173, 55.7558], name: "Moscow", sub: "The Wanderers — Russian Realism", wave: 3 },
  // Wave 4 — America
  { coords: [-75.1652, 39.9526], name: "Philadelphia", sub: "Thomas Eakins — The Gross Clinic", wave: 4 },
];

export const RealismSpreadMap: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { delayRender, continueRender } = useDelayRender();
  const [mapHandle] = useState(() => delayRender("Loading map..."));
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const _map = new Map({
      container: ref.current!,
      zoom: 2.8,
      center: [15.0, 50.0],
      pitch: 0,
      bearing: 0,
      style: "mapbox://styles/mapbox/dark-v11",
      interactive: false,
      fadeDuration: 0,
    });

    _map.on("load", () => {
      hideMapLabels(_map);

      // One source per wave so we can fade them independently
      for (let wave = 1; wave <= 4; wave++) {
        const cities = CITIES.filter((c) => c.wave === wave);

        _map.addSource(`cities-w${wave}`, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: cities.map((c) => ({
              type: "Feature" as const,
              properties: { name: c.name, sub: c.sub },
              geometry: { type: "Point" as const, coordinates: c.coords },
            })),
          },
        });

        _map.addLayer({
          id: `dots-w${wave}`,
          type: "circle",
          source: `cities-w${wave}`,
          paint: {
            "circle-radius": wave === 1 ? 14 : 10,
            "circle-color": wave === 1 ? palette.amber : palette.peach,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#000",
            "circle-opacity": 0,
          },
        });
        _map.addLayer({
          id: `names-w${wave}`,
          type: "symbol",
          source: `cities-w${wave}`,
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
            "text-size": wave === 1 ? 36 : 28,
            "text-offset": [0, -1.3],
            "text-anchor": "bottom",
            "text-allow-overlap": true,
          },
          paint: {
            "text-color": wave === 1 ? palette.amber : palette.peach,
            "text-halo-color": "#000",
            "text-halo-width": 3,
            "text-opacity": 0,
          },
        });
        _map.addLayer({
          id: `subs-w${wave}`,
          type: "symbol",
          source: `cities-w${wave}`,
          layout: {
            "text-field": ["get", "sub"],
            "text-font": ["DIN Pro Italic", "Arial Unicode MS Regular"],
            "text-size": 20,
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

    // Each wave fades in 1.5s apart, starting at t=1
    for (let wave = 1; wave <= 4; wave++) {
      const start = 1.0 + (wave - 1) * 1.5;
      const opacity = interpolate(t, [start, start + 1.0], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      map.setPaintProperty(`dots-w${wave}`, "circle-opacity", opacity);
      map.setPaintProperty(`dots-w${wave}`, "circle-stroke-opacity", opacity);
      map.setPaintProperty(`names-w${wave}`, "text-opacity", opacity);
      map.setPaintProperty(`subs-w${wave}`, "text-opacity", opacity * 0.7);
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
          REALISM SPREADS
        </div>
        <div style={{ color: palette.peach, fontSize: 18, fontStyle: "italic", marginTop: 8, opacity: 0.7, textShadow: "0 2px 12px #000" }}>
          France → Europe → America, 1848–1880
        </div>
      </div>
    </AbsoluteFill>
  );
};
