import { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, useDelayRender, interpolate, Easing } from "remotion";
import mapboxgl, { Map } from "mapbox-gl";
import * as turf from "@turf/turf";
import { palette, fonts } from "../shared/palette";
import { hideMapLabels } from "../shared/mapUtils";

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

const PARIS: [number, number] = [2.3522, 48.8566];
const BRUSSELS: [number, number] = [4.3517, 50.8503];
const routeCoords: [number, number][] = [PARIS, [3.0, 49.5], [3.5, 50.0], BRUSSELS];

export const ExileRoute: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { delayRender, continueRender } = useDelayRender();
  const [mapHandle] = useState(() => delayRender("Loading map..."));
  const [map, setMap] = useState<Map | null>(null);

  // Init map
  useEffect(() => {
    const _map = new Map({
      container: ref.current!,
      zoom: 6.2,
      center: [3.3, 49.7],
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
        paint: { "line-color": palette.peach, "line-width": 4, "line-dasharray": [2, 2] },
        layout: { "line-cap": "round", "line-join": "round" },
      });

      // City markers
      _map.addSource("cities", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            { type: "Feature", properties: { name: "Paris" }, geometry: { type: "Point", coordinates: PARIS } },
            { type: "Feature", properties: { name: "Brussels" }, geometry: { type: "Point", coordinates: BRUSSELS } },
          ],
        },
      });
      _map.addLayer({
        id: "city-dots",
        type: "circle",
        source: "cities",
        paint: { "circle-radius": 8, "circle-color": palette.amber, "circle-stroke-width": 2, "circle-stroke-color": palette.forest },
      });
      _map.addLayer({
        id: "city-labels",
        type: "symbol",
        source: "cities",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
          "text-size": 42,
          "text-offset": [0, 1.2],
          "text-anchor": "top",
        },
        paint: { "text-color": palette.amber, "text-halo-color": "#000", "text-halo-width": 3 },
      });
    });

    _map.on("load", () => {
      continueRender(mapHandle);
      setMap(_map);
    });
  }, [mapHandle]);

  // Animate route line
  useEffect(() => {
    if (!map) return;
    const handle = delayRender("Animating route...");

    const progress = interpolate(frame / fps, [1, 4], [0, 1], {
      easing: Easing.inOut(Easing.sin),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const routeLine = turf.lineString(routeCoords);
    const routeDistance = turf.length(routeLine);
    const currentDistance = Math.max(0.001, routeDistance * progress);
    const slicedLine = turf.lineSliceAlong(routeLine, 0, currentDistance);

    const source = map.getSource("route") as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(slicedLine);
    }

    map.once("idle", () => continueRender(handle));
  }, [frame, map, fps]);

  const style: React.CSSProperties = useMemo(() => ({ width, height, position: "absolute" as const }), [width, height]);

  // Overlay text
  const textOpacity = interpolate(frame / fps, [4.5, 5.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <div ref={ref} style={style} />
      {/* Title */}
      <div style={{
        position: "absolute", top: 50, width: "100%", textAlign: "center",
        fontFamily: fonts.serif,
      }}>
        <div style={{ color: palette.amber, fontSize: 28, letterSpacing: 4, textShadow: "0 2px 12px #000" }}>
          DAVID&apos;S EXILE
        </div>
        <div style={{ color: palette.peach, fontSize: 18, fontStyle: "italic", marginTop: 8, opacity: 0.7, textShadow: "0 2px 12px #000" }}>
          Banished as a regicide, 1816
        </div>
      </div>
      {/* Bottom quote */}
      <div style={{
        position: "absolute", bottom: 80, width: "100%", textAlign: "center",
        fontFamily: fonts.serif, opacity: textOpacity,
      }}>
        <div style={{ color: palette.peach, fontSize: 26, fontStyle: "italic", textShadow: "0 2px 12px #000" }}>
          &ldquo;France refused to allow his body to return.&rdquo;
        </div>
      </div>
    </AbsoluteFill>
  );
};
