import { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, useDelayRender, interpolate, Easing } from "remotion";
import mapboxgl, { Map } from "mapbox-gl";
import { palette, fonts } from "../shared/palette";
import { hideMapLabels } from "../shared/mapUtils";

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

const LOUVRE: [number, number] = [2.3376, 48.8606];
const CONVENTION: [number, number] = [2.3285, 48.8638];
const BASTILLE: [number, number] = [2.3692, 48.8533];
const CONCORDE: [number, number] = [2.3212, 48.8656];
const NOTRE_DAME: [number, number] = [2.3499, 48.8530];
const CENTER: [number, number] = [2.345, 48.857];

export const ParisMap: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { delayRender, continueRender } = useDelayRender();
  const [mapHandle] = useState(() => delayRender("Loading map..."));
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const _map = new Map({
      container: ref.current!,
      zoom: 13.5,
      center: CENTER,
      pitch: 0,
      bearing: 0,
      style: "mapbox://styles/mapbox/dark-v11",
      interactive: false,
      fadeDuration: 0,
    });

    _map.on("load", () => {
      hideMapLabels(_map);

      // Art locations
      _map.addSource("art-sites", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            { type: "Feature", properties: { name: "The Louvre", sub: "The Salon exhibitions" }, geometry: { type: "Point", coordinates: LOUVRE } },
            { type: "Feature", properties: { name: "Notre-Dame", sub: "Napoleon's coronation, 1804" }, geometry: { type: "Point", coordinates: NOTRE_DAME } },
          ],
        },
      });

      // Revolution locations
      _map.addSource("rev-sites", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            { type: "Feature", properties: { name: "National Convention", sub: "David voted here, 1793" }, geometry: { type: "Point", coordinates: CONVENTION } },
            { type: "Feature", properties: { name: "The Bastille", sub: "Stormed July 14, 1789" }, geometry: { type: "Point", coordinates: BASTILLE } },
            { type: "Feature", properties: { name: "Place de la Révolution", sub: "The guillotine" }, geometry: { type: "Point", coordinates: CONCORDE } },
          ],
        },
      });

      // Art dots + labels
      _map.addLayer({ id: "art-dots", type: "circle", source: "art-sites", paint: { "circle-radius": 12, "circle-color": palette.amber, "circle-stroke-width": 3, "circle-stroke-color": "#000" } });
      _map.addLayer({ id: "art-names", type: "symbol", source: "art-sites", layout: { "text-field": ["get", "name"], "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"], "text-size": 38, "text-offset": [0, -1.2], "text-anchor": "bottom", "text-allow-overlap": true }, paint: { "text-color": palette.amber, "text-halo-color": "#000", "text-halo-width": 3 } });
      _map.addLayer({ id: "art-subs", type: "symbol", source: "art-sites", layout: { "text-field": ["get", "sub"], "text-font": ["DIN Pro Italic", "Arial Unicode MS Regular"], "text-size": 24, "text-offset": [0, 1.4], "text-anchor": "top", "text-allow-overlap": true }, paint: { "text-color": palette.peach, "text-halo-color": "#000", "text-halo-width": 2, "text-opacity": 0.8 } });

      // Revolution dots + labels
      _map.addLayer({ id: "rev-dots", type: "circle", source: "rev-sites", paint: { "circle-radius": 12, "circle-color": palette.maroon, "circle-stroke-width": 3, "circle-stroke-color": "#000" } });
      _map.addLayer({ id: "rev-names", type: "symbol", source: "rev-sites", layout: { "text-field": ["get", "name"], "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"], "text-size": 38, "text-offset": [0, -1.2], "text-anchor": "bottom", "text-allow-overlap": true }, paint: { "text-color": palette.peach, "text-halo-color": "#000", "text-halo-width": 3 } });
      _map.addLayer({ id: "rev-subs", type: "symbol", source: "rev-sites", layout: { "text-field": ["get", "sub"], "text-font": ["DIN Pro Italic", "Arial Unicode MS Regular"], "text-size": 24, "text-offset": [0, 1.4], "text-anchor": "top", "text-allow-overlap": true }, paint: { "text-color": palette.peach, "text-halo-color": "#000", "text-halo-width": 2, "text-opacity": 0.6 } });

      continueRender(mapHandle);
      setMap(_map);
    });
  }, [mapHandle]);

  useEffect(() => {
    if (!map) return;
    const handle = delayRender("Zooming...");
    const zoom = interpolate(frame / fps, [0, 8], [13.5, 14.0], {
      easing: Easing.inOut(Easing.sin),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    map.setZoom(zoom);
    map.once("idle", () => continueRender(handle));
  }, [frame, map, fps]);

  const style: React.CSSProperties = useMemo(() => ({ width, height, position: "absolute" as const }), [width, height]);

  return (
    <AbsoluteFill>
      <div ref={ref} style={style} />
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: fonts.serif }}>
        <div style={{ color: palette.amber, fontSize: 28, letterSpacing: 4, textShadow: "0 2px 12px #000" }}>
          PARIS IN REVOLUTION
        </div>
        <div style={{ color: palette.peach, fontSize: 18, fontStyle: "italic", marginTop: 8, opacity: 0.7, textShadow: "0 2px 12px #000" }}>
          Key locations, 1784–1804
        </div>
      </div>
    </AbsoluteFill>
  );
};
