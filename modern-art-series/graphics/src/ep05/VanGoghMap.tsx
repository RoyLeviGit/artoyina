import { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, useDelayRender, interpolate, Easing, spring } from "remotion";
import mapboxgl, { Map } from "mapbox-gl";
import * as turf from "@turf/turf";
import { palette, fonts } from "../shared/palette";
import { hideMapLabels } from "../shared/mapUtils";

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

const ZUNDERT: [number, number] = [4.6519, 51.4716];      // born
const NUENEN: [number, number] = [5.5418, 51.4690];       // Potato Eaters
const ANTWERP: [number, number] = [4.4025, 51.2194];
const PARIS: [number, number] = [2.3522, 48.8566];
const ARLES: [number, number] = [4.6313, 43.6770];        // Yellow House, Sunflowers
const SAINT_REMY: [number, number] = [4.8317, 43.7900];   // asylum, Starry Night
const AUVERS: [number, number] = [2.1692, 49.0714];       // death

const routeCoords: [number, number][] = [
  ZUNDERT, NUENEN, ANTWERP, PARIS,
  [3.5, 46.5], ARLES, SAINT_REMY,
  [3.5, 46.0], [2.5, 47.5], AUVERS,
];

const STOPS: { coords: [number, number]; name: string; sub: string; death?: boolean }[] = [
  { coords: ZUNDERT, name: "Zundert", sub: "Born 1853" },
  { coords: NUENEN, name: "Nuenen", sub: "The Potato Eaters, 1885" },
  { coords: PARIS, name: "Paris", sub: "1886–88 — palette transforms, meets Impressionists" },
  { coords: ARLES, name: "Arles", sub: "1888–89 — Yellow House, Sunflowers, The Bedroom" },
  { coords: SAINT_REMY, name: "Saint-Rémy", sub: "1889–90 — asylum — The Starry Night" },
  { coords: AUVERS, name: "Auvers-sur-Oise", sub: "1890 — 70 paintings in 70 days — dies July 29", death: true },
];

export const VanGoghMap: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { delayRender, continueRender } = useDelayRender();
  const [mapHandle] = useState(() => delayRender("Loading map..."));
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const _map = new Map({
      container: ref.current!,
      zoom: 5.2,
      center: [3.5, 47.5],
      pitch: 0,
      bearing: 0,
      style: "mapbox://styles/mapbox/dark-v11",
      interactive: false,
      fadeDuration: 0,
    });

    _map.on("load", () => {
      hideMapLabels(_map);

      _map.addSource("route", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } },
      });
      _map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: { "line-color": palette.amber, "line-width": 3, "line-dasharray": [2, 2] },
        layout: { "line-cap": "round", "line-join": "round" },
      });

      _map.addSource("stops", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: STOPS.map((s) => ({
            type: "Feature" as const,
            properties: { name: s.name, sub: s.sub, death: s.death ? 1 : 0 },
            geometry: { type: "Point" as const, coordinates: s.coords },
          })),
        },
      });

      _map.addLayer({
        id: "stop-dots",
        type: "circle",
        source: "stops",
        paint: {
          "circle-radius": 11,
          "circle-color": ["case", ["==", ["get", "death"], 1], palette.maroon, palette.amber],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#000",
          "circle-opacity": 0,
        },
      });
      _map.addLayer({
        id: "stop-names",
        type: "symbol",
        source: "stops",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
          "text-size": 36,
          "text-offset": [0, -1.3],
          "text-anchor": "bottom",
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": ["case", ["==", ["get", "death"], 1], palette.maroon, palette.amber],
          "text-halo-color": "#000",
          "text-halo-width": 3,
          "text-opacity": 0,
        },
      });
      _map.addLayer({
        id: "stop-subs",
        type: "symbol",
        source: "stops",
        layout: {
          "text-field": ["get", "sub"],
          "text-font": ["DIN Pro Italic", "Arial Unicode MS Regular"],
          "text-size": 22,
          "text-offset": [0, 1.3],
          "text-anchor": "top",
          "text-allow-overlap": true,
          "text-max-width": 20,
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
    const handle = delayRender("Animating...");
    const t = frame / fps;

    const progress = interpolate(t, [1, 6.5], [0, 1], {
      easing: Easing.inOut(Easing.sin),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const routeLine = turf.lineString(routeCoords);
    const dist = turf.length(routeLine);
    const sliced = turf.lineSliceAlong(routeLine, 0, Math.max(0.001, dist * progress));
    (map.getSource("route") as mapboxgl.GeoJSONSource).setData(sliced);

    const labelsOpacity = interpolate(t, [5.5, 7.5], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    map.setPaintProperty("stop-dots", "circle-opacity", labelsOpacity);
    map.setPaintProperty("stop-dots", "circle-stroke-opacity", labelsOpacity);
    map.setPaintProperty("stop-names", "text-opacity", labelsOpacity);
    map.setPaintProperty("stop-subs", "text-opacity", labelsOpacity * 0.75);

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
          VAN GOGH&apos;S JOURNEY
        </div>
        <div style={{ color: palette.peach, fontSize: 18, fontStyle: "italic", marginTop: 8, opacity: 0.7, textShadow: "0 2px 12px #000" }}>
          Netherlands → Paris → Arles → Saint-Rémy → Auvers, 1853–1890
        </div>
      </div>
    </AbsoluteFill>
  );
};
