/**
 * Konverterar GeoJSON-koordinater (WGS84) till SVG-path i viewBox 0 0 100 300.
 * Sverige: lng ~11–24, lat ~55–69.
 */
const LNG_MIN = 11;
const LNG_RANGE = 13;
const LAT_MAX = 69;
const LAT_RANGE = 14;
const WIDTH = 100;
const HEIGHT = 300;

export function project(lng: number, lat: number): [number, number] {
  const x = ((lng - LNG_MIN) / LNG_RANGE) * WIDTH;
  const y = ((LAT_MAX - lat) / LAT_RANGE) * HEIGHT;
  return [x, y];
}

type Ring = number[][]; // [lng, lat][]

function ringToPath(ring: Ring): string {
  if (ring.length < 2) return "";
  const [first, ...rest] = ring;
  const [x0, y0] = project(first[0], first[1]);
  const parts = rest.map(([lng, lat]) => {
    const [x, y] = project(lng, lat);
    return `L ${x} ${y}`;
  });
  return `M ${x0} ${y0} ${parts.join(" ")} Z`;
}

export type GeoJSONFeature = {
  type: "Feature";
  geometry: { type: "Polygon"; coordinates: [Ring] } | { type: "MultiPolygon"; coordinates: Ring[][] };
  properties: { name: string };
};

export function featureToPath(feature: GeoJSONFeature): string {
  const g = feature.geometry;
  if (g.type === "Polygon") {
    return ringToPath(g.coordinates[0]);
  }
  return g.coordinates.map((poly) => ringToPath(poly[0])).join(" ");
}

export function featureToCenter(feature: GeoJSONFeature): [number, number] {
  const g = feature.geometry;
  let rings: Ring[];
  if (g.type === "Polygon") {
    rings = [g.coordinates[0]];
  } else {
    rings = g.coordinates.map((poly) => poly[0]);
  }
  let sumLng = 0;
  let sumLat = 0;
  let n = 0;
  for (const ring of rings) {
    for (const [lng, lat] of ring) {
      sumLng += lng;
      sumLat += lat;
      n++;
    }
  }
  if (n === 0) return [50, 150];
  return project(sumLng / n, sumLat / n);
}
