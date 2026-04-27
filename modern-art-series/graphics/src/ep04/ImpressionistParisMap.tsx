import { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, useDelayRender, interpolate, Easing, spring } from "remotion";
import mapboxgl, { Map } from "mapbox-gl";
import { palette, fonts } from "../shared/palette";
import { hideMapLabels } from "../shared/mapUtils";

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

// Paris locations + Giverny (80km away) — two zoom levels
const NADAR_STUDIO: [number, number] = [2.3322, 48.8717];   // Boulevard des Capucines
const CAFE_GUERBOIS: [number, number] = [2.3200, 48.8822];  // Ave de Clichy, Batignolles
const LOUVRE_SALON: [number, number] = [2.3376, 48.8606];
const MONTMARTRE: [number, number] = [2.3413, 48.8867];     // Sacré-Cœur area
const ARGENTEUIL: [number, number] = [2.2458, 48.9452];     // Seine suburb, Monet 1871-78
const GIVERNY: [number, number] = [1.5335, 49.0758];

type SiteGroup = "art" | "social" | "monet";

const SITES: { coords: [number, number]; name: string; sub: string; group: SiteGroup }[] = [
  { coords: NADAR_STUDIO, name: "Nadar's Studio", sub: "First exhibition, 1874", group: "art" },
  { coords: LOUVRE_SALON, name: "The Louvre / Salon", sub: "The institution they bypassed", group: "art" },
  { coords: CAFE_GUERBOIS, name: "Café Guerbois", sub: "The group's gathering place, 1860s", group: "social" },
  { coords: MONTMARTRE, name: "Montmartre", sub: "Studios, models, Renoir's Moulin de la Galette", group: "social" },
  { coords: ARGENTEUIL, name: "Argenteuil", sub: "Monet's Seine studio, 1871–1878", group: "monet" },
  { coords: GIVERNY, name: "Giverny", sub: "Monet's garden — the Water Lilies, 1883–1926", group: "monet" },
];

const groupColor = (g: SiteGroup) => {
  if (g === "art") return palette.amber;
  if (g === "social") return palette.peach;
  return "#6EC6A0"; // soft green for Monet locations
};

// Start zoomed to fit Paris + Giverny, then slowly drift
const START_CENTER: [number, number] = [2.0, 48.95];
const START_ZOOM = 9.5;

export const ImpressionistParisMap: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { delayRender, continueRender } = useDelayRender();
  const [mapHandle] = useState(() => delayRender("Loading map..."));
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const _map = new Map({
      container: ref.current!,
      zoom: START_ZOOM,
      center: START_CENTER,
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
          features: SITES.map((s) => ({
            type: "Feature" as const,
            properties: { name: s.name, sub: s.sub, color: groupColor(s.group) },
            geometry: { type: "Point" as const, coordinates: s.coords },
          })),
        },
      });

      _map.addLayer({
        id: "site-dots",
        type: "circle",
        source: "sites",
        paint: {
          "circle-radius": 12,
          "circle-color": ["get", "color"],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#000",
          "circle-opacity": 0,
        },
      });
      _map.addLayer({
        id: "site-names",
        type: "symbol",
        source: "sites",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
          "text-size": 34,
          "text-offset": [0, -1.3],
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
        id: "site-subs",
        type: "symbol",
        source: "sites",
        layout: {
          "text-field": ["get", "sub"],
          "text-font": ["DIN Pro Italic", "Arial Unicode MS Regular"],
          "text-size": 22,
          "text-offset": [0, 1.3],
          "text-anchor": "top",
          "text-allow-overlap": true,
          "text-max-width": 18,
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

    // Sites fade in over first 2 seconds
    const dotsOpacity = interpolate(t, [1.0, 2.5], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    map.setPaintProperty("site-dots", "circle-opacity", dotsOpacity);
    map.setPaintProperty("site-dots", "circle-stroke-opacity", dotsOpacity);
    map.setPaintProperty("site-names", "text-opacity", dotsOpacity);
    map.setPaintProperty("site-subs", "text-opacity", dotsOpacity * 0.7);

    // Slow drift zoom into Paris over 8 seconds
    const zoom = interpolate(t, [0, 8], [START_ZOOM, 11.2], {
      easing: Easing.inOut(Easing.sin),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const lng = interpolate(t, [0, 8], [START_CENTER[0], 2.335], {
      easing: Easing.inOut(Easing.sin),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const lat = interpolate(t, [0, 8], [START_CENTER[1], 48.865], {
      easing: Easing.inOut(Easing.sin),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    map.setZoom(zoom);
    map.setCenter([lng, lat]);

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
          THE IMPRESSIONIST WORLD
        </div>
        <div style={{ color: palette.peach, fontSize: 18, fontStyle: "italic", marginTop: 8, opacity: 0.7, textShadow: "0 2px 12px #000" }}>
          Paris and its surroundings, 1863–1886
        </div>
      </div>
      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 80,
          fontFamily: fonts.serif,
          opacity: titleIn * 0.7,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {[
          { color: palette.amber, label: "Exhibition / institutional" },
          { color: palette.peach, label: "Social / studio spaces" },
          { color: "#6EC6A0", label: "Monet's locations" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: color }} />
            <span style={{ color, fontSize: 20, textShadow: "0 2px 8px #000" }}>{label}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
