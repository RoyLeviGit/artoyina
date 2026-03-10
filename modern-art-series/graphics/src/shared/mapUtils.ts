import type { Map } from "mapbox-gl";

/** Hide all default Mapbox text/symbol labels from a dark-v11 style map */
export const hideMapLabels = (map: Map) => {
  const style = map.getStyle();
  if (!style?.layers) return;
  for (const layer of style.layers) {
    if (layer.type === "symbol") {
      map.setLayoutProperty(layer.id, "visibility", "none");
    }
  }
};
