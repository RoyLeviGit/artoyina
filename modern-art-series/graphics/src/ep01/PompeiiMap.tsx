import { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, useDelayRender, interpolate, Easing } from "remotion";
import mapboxgl, { Map } from "mapbox-gl";
import { palette, fonts } from "../shared/palette";
import { hideMapLabels } from "../shared/mapUtils";

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

const POMPEII: [number, number] = [14.4858, 40.7509];
const HERCULANEUM: [number, number] = [14.3479, 40.8059];
const VESUVIUS: [number, number] = [14.4260, 40.8210];
const ITALY_CENTER: [number, number] = [12.5, 42.5];
const BAY_CENTER: [number, number] = [14.42, 40.78];

const ZOOM_START = 5.2;
const ZOOM_END = 11.5;
const ZOOM_DURATION = 4; // seconds
const LABELS_VISIBLE_ZOOM = 9.5;

export const PompeiiMap: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { delayRender, continueRender } = useDelayRender();
  const [mapHandle] = useState(() => delayRender("Loading map..."));
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const _map = new Map({
      container: ref.current!,
      zoom: ZOOM_START,
      center: ITALY_CENTER,
      pitch: 0,
      bearing: 0,
      style: "mapbox://styles/mapbox/dark-v11",
      interactive: false,
      fadeDuration: 0,
    });

    _map.on("load", () => {
      hideMapLabels(_map);

      _map.addSource("sites", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            { type: "Feature", properties: { name: "Pompeii", sub: "excavated 1748", color: palette.amber }, geometry: { type: "Point", coordinates: POMPEII } },
            { type: "Feature", properties: { name: "Herculaneum", sub: "excavated 1738", color: palette.amber }, geometry: { type: "Point", coordinates: HERCULANEUM } },
            { type: "Feature", properties: { name: "Mt. Vesuvius", sub: "erupted 79 AD", color: palette.maroon }, geometry: { type: "Point", coordinates: VESUVIUS } },
          ],
        },
      });

      _map.addLayer({
        id: "site-dots", type: "circle", source: "sites",
        paint: { "circle-radius": 14, "circle-color": ["get", "color"], "circle-stroke-width": 3, "circle-stroke-color": "#000", "circle-opacity": 0 },
      });
      _map.addLayer({
        id: "site-names", type: "symbol", source: "sites",
        layout: { "text-field": ["get", "name"], "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"], "text-size": 44, "text-offset": [0, -1.2], "text-anchor": "bottom", "text-allow-overlap": true },
        paint: { "text-color": ["get", "color"], "text-halo-color": "#000", "text-halo-width": 3, "text-opacity": 0 },
      });
      _map.addLayer({
        id: "site-subs", type: "symbol", source: "sites",
        layout: { "text-field": ["get", "sub"], "text-font": ["DIN Pro Italic", "Arial Unicode MS Regular"], "text-size": 26, "text-offset": [0, 1.4], "text-anchor": "top", "text-allow-overlap": true },
        paint: { "text-color": palette.peach, "text-halo-color": "#000", "text-halo-width": 2, "text-opacity": 0 },
      });

      continueRender(mapHandle);
      setMap(_map);
    });
  }, [mapHandle]);

  useEffect(() => {
    if (!map) return;
    const handle = delayRender("Animating camera...");

    const t = frame / fps;

    // Pan arrives first, then zoom finishes
    const panProgress = interpolate(t, [0.3, ZOOM_DURATION * 0.6], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const zoomProgress = interpolate(t, [0.3, ZOOM_DURATION + 0.5], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const zoom = ZOOM_START + (ZOOM_END - ZOOM_START) * zoomProgress;
    const lng = ITALY_CENTER[0] + (BAY_CENTER[0] - ITALY_CENTER[0]) * panProgress;
    const lat = ITALY_CENTER[1] + (BAY_CENTER[1] - ITALY_CENTER[1]) * panProgress;

    map.setZoom(zoom);
    map.setCenter([lng, lat]);

    // Fade in labels only when zoomed in enough
    const labelOpacity = zoom >= LABELS_VISIBLE_ZOOM
      ? interpolate(zoom, [LABELS_VISIBLE_ZOOM, LABELS_VISIBLE_ZOOM + 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;

    map.setPaintProperty("site-dots", "circle-opacity", labelOpacity);
    map.setPaintProperty("site-dots", "circle-stroke-opacity", labelOpacity);
    map.setPaintProperty("site-names", "text-opacity", labelOpacity);
    map.setPaintProperty("site-subs", "text-opacity", labelOpacity * 0.8);

    map.once("idle", () => continueRender(handle));
  }, [frame, map, fps]);

  const style: React.CSSProperties = useMemo(() => ({ width, height, position: "absolute" as const }), [width, height]);
  const titleOpacity = interpolate(frame / fps, [0, 0.8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <div ref={ref} style={style} />
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: fonts.serif, opacity: titleOpacity }}>
        <div style={{ color: palette.amber, fontSize: 28, letterSpacing: 4, textShadow: "0 2px 12px #000" }}>
          THE EXCAVATIONS THAT CHANGED EUROPE
        </div>
      </div>
    </AbsoluteFill>
  );
};
