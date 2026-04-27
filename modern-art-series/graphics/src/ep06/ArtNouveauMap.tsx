import { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, useDelayRender, interpolate, spring } from "remotion";
import mapboxgl, { Map } from "mapbox-gl";
import { palette, fonts } from "../shared/palette";
import { hideMapLabels } from "../shared/mapUtils";

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

// Cities with their local name for Art Nouveau — staggered reveal
const CITIES: {
  coords: [number, number];
  name: string;
  styleName: string;
  sub: string;
  wave: number;
}[] = [
  { coords: [2.3522, 48.8566],  name: "Paris",    styleName: "Art Nouveau",    sub: "Guimard · Mucha · Bing's gallery",        wave: 1 },
  { coords: [4.3517, 50.8503],  name: "Brussels",  styleName: "Art Nouveau",    sub: "Horta — Hôtel Tassel, 1893",              wave: 1 },
  { coords: [16.3738, 48.2082], name: "Vienna",    styleName: "Jugendstil",     sub: "Klimt · Secession · Loos",               wave: 2 },
  { coords: [11.5820, 48.1351], name: "Munich",    styleName: "Jugendstil",     sub: "Magazine \"Jugend\" gave the style its name", wave: 2 },
  { coords: [2.1734, 41.3851],  name: "Barcelona", styleName: "Modernisme",     sub: "Gaudí — Sagrada Família · Casa Batlló",  wave: 3 },
  { coords: [-4.2518, 55.8642], name: "Glasgow",   styleName: "Glasgow Style",  sub: "Charles Rennie Mackintosh",              wave: 3 },
  { coords: [14.4378, 50.0755], name: "Prague",    styleName: "Czech Art Nouveau", sub: "Mucha born here — the Slav Epic",     wave: 4 },
  { coords: [7.6869, 45.0703],  name: "Turin",     styleName: "Stile Liberty",  sub: "1902 Exposition Internationale",         wave: 4 },
];

export const ArtNouveauMap: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { delayRender, continueRender } = useDelayRender();
  const [mapHandle] = useState(() => delayRender("Loading map..."));
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const _map = new Map({
      container: ref.current!,
      zoom: 4.2,
      center: [8.0, 49.5],
      pitch: 0,
      bearing: 0,
      style: "mapbox://styles/mapbox/dark-v11",
      interactive: false,
      fadeDuration: 0,
    });

    _map.on("load", () => {
      hideMapLabels(_map);

      for (let wave = 1; wave <= 4; wave++) {
        const waveCities = CITIES.filter((c) => c.wave === wave);

        _map.addSource(`cities-w${wave}`, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: waveCities.map((c) => ({
              type: "Feature" as const,
              properties: {
                name: c.name,
                styleName: c.styleName,
                sub: c.sub,
              },
              geometry: { type: "Point" as const, coordinates: c.coords },
            })),
          },
        });

        _map.addLayer({
          id: `dots-w${wave}`,
          type: "circle",
          source: `cities-w${wave}`,
          paint: {
            "circle-radius": 13,
            "circle-color": palette.amber,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#000",
            "circle-opacity": 0,
          },
        });
        // City name
        _map.addLayer({
          id: `city-names-w${wave}`,
          type: "symbol",
          source: `cities-w${wave}`,
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
            "text-size": 34,
            "text-offset": [0, -1.5],
            "text-anchor": "bottom",
            "text-allow-overlap": true,
          },
          paint: {
            "text-color": palette.amber,
            "text-halo-color": "#000",
            "text-halo-width": 3,
            "text-opacity": 0,
          },
        });
        // Style name — italic, amber
        _map.addLayer({
          id: `style-names-w${wave}`,
          type: "symbol",
          source: `cities-w${wave}`,
          layout: {
            "text-field": ["get", "styleName"],
            "text-font": ["DIN Pro Italic", "Arial Unicode MS Regular"],
            "text-size": 24,
            "text-offset": [0, 1.2],
            "text-anchor": "top",
            "text-allow-overlap": true,
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
      const start = 1.0 + (wave - 1) * 1.4;
      const opacity = interpolate(t, [start, start + 0.9], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      map.setPaintProperty(`dots-w${wave}`, "circle-opacity", opacity);
      map.setPaintProperty(`dots-w${wave}`, "circle-stroke-opacity", opacity);
      map.setPaintProperty(`city-names-w${wave}`, "text-opacity", opacity);
      map.setPaintProperty(`style-names-w${wave}`, "text-opacity", opacity * 0.8);
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
          ART NOUVEAU — ONE MOVEMENT, MANY NAMES
        </div>
        <div style={{ color: palette.peach, fontSize: 18, fontStyle: "italic", marginTop: 8, opacity: 0.7, textShadow: "0 2px 12px #000" }}>
          Europe, 1893–1910
        </div>
      </div>
    </AbsoluteFill>
  );
};
