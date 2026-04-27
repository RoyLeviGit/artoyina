import { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, useDelayRender, interpolate, spring } from "remotion";
import mapboxgl, { Map } from "mapbox-gl";
import { palette, fonts } from "../shared/palette";
import { hideMapLabels } from "../shared/mapUtils";

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

const PARIS: [number, number] = [2.3522, 48.8566];
const LONDON: [number, number] = [-0.1276, 51.5074];
const DRESDEN: [number, number] = [13.7373, 51.0504];
const CENTER: [number, number] = [7.5, 50.5];

const CITIES: { coords: [number, number]; name: string; sub: string; color: string }[] = [
  { coords: PARIS, name: "Paris", sub: "Géricault · Delacroix", color: palette.amber },
  { coords: LONDON, name: "London", sub: "Turner · Constable", color: palette.peach },
  { coords: DRESDEN, name: "Dresden", sub: "Caspar David Friedrich", color: palette.peach },
];

export const EuropeMap: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { delayRender, continueRender } = useDelayRender();
  const [mapHandle] = useState(() => delayRender("Loading map..."));
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const _map = new Map({
      container: ref.current!,
      zoom: 4.8,
      center: CENTER,
      pitch: 0,
      bearing: 0,
      style: "mapbox://styles/mapbox/dark-v11",
      interactive: false,
      fadeDuration: 0,
    });

    _map.on("load", () => {
      hideMapLabels(_map);

      _map.addSource("cities", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: CITIES.map((c) => ({
            type: "Feature" as const,
            properties: { name: c.name, sub: c.sub, color: c.color },
            geometry: { type: "Point" as const, coordinates: c.coords },
          })),
        },
      });

      _map.addLayer({
        id: "city-dots",
        type: "circle",
        source: "cities",
        paint: {
          "circle-radius": 14,
          "circle-color": ["get", "color"],
          "circle-stroke-width": 3,
          "circle-stroke-color": "#000",
          "circle-opacity": 0,
        },
      });
      _map.addLayer({
        id: "city-names",
        type: "symbol",
        source: "cities",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
          "text-size": 42,
          "text-offset": [0, -1.4],
          "text-anchor": "bottom",
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "#000",
          "text-halo-width": 3,
          "text-opacity": 0,
        },
      });
      _map.addLayer({
        id: "city-subs",
        type: "symbol",
        source: "cities",
        layout: {
          "text-field": ["get", "sub"],
          "text-font": ["DIN Pro Italic", "Arial Unicode MS Regular"],
          "text-size": 26,
          "text-offset": [0, 1.4],
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

      continueRender(mapHandle);
      setMap(_map);
    });
  }, [mapHandle]);

  useEffect(() => {
    if (!map) return;
    const handle = delayRender("Fading in cities...");

    // Cities fade in one by one after 1 second
    const opacity = interpolate(frame / fps, [1.0, 2.0], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    map.setPaintProperty("city-dots", "circle-opacity", opacity);
    map.setPaintProperty("city-dots", "circle-stroke-opacity", opacity);
    map.setPaintProperty("city-names", "text-opacity", opacity);
    map.setPaintProperty("city-subs", "text-opacity", opacity * 0.8);

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
        <div
          style={{
            color: palette.amber,
            fontSize: 28,
            letterSpacing: 4,
            textShadow: "0 2px 12px #000",
          }}
        >
          ROMANTICISM IN EUROPE
        </div>
        <div
          style={{
            color: palette.peach,
            fontSize: 18,
            fontStyle: "italic",
            marginTop: 8,
            opacity: 0.7,
            textShadow: "0 2px 12px #000",
          }}
        >
          Three centers, one movement — c. 1815–1850
        </div>
      </div>
    </AbsoluteFill>
  );
};
