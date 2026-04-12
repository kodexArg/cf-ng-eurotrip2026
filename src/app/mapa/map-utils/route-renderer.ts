import type { MapRoute } from '../../shared/models/map-route.model';

const ROUTE_STYLES: Record<string, import('leaflet').PolylineOptions> = {
  train:   { color: '#16a34a', weight: 2.5, dashArray: '10,6', opacity: 0.85 },
  daytrip: { color: '#7c3aed', weight: 1.8, dashArray: '5,5',  opacity: 0.75 },
  flight:  { color: '#2563eb', weight: 1.8, opacity: 0.7 },
  ferry:   { color: '#0891b2', weight: 2.0, dashArray: '8,5',  opacity: 0.75 },
};

const ROUTE_COLORS: Record<string, string> = {
  train:   '#16a34a',
  daytrip: '#7c3aed',
  flight:  '#2563eb',
  ferry:   '#0891b2',
};

/**
 * Computes the initial bearing (in degrees, 0=North, clockwise) from p1 to p2.
 */
function bearing(p1: [number, number], p2: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const lat1 = toRad(p1[0]);
  const lat2 = toRad(p2[0]);
  const dLon = toRad(p2[1] - p1[1]);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/**
 * Creates a small rotated SVG chevron DivIcon to indicate travel direction.
 * The chevron points "up" at 0 deg rotation (north), and is rotated to match
 * the bearing of the leg at its midpoint.
 */
function makeArrowIcon(L: typeof import('leaflet'), deg: number, color: string): import('leaflet').DivIcon {
  // SVG chevron pointing upward (north). Rotation is applied via CSS transform.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
    <polygon points="6,1 11,11 6,8 1,11" fill="${color}" fill-opacity="0.85" stroke="white" stroke-width="0.8"/>
  </svg>`;
  return L.divIcon({
    html: `<div style="transform:rotate(${deg}deg);transform-origin:center;width:12px;height:12px;line-height:1">${svg}</div>`,
    className: '',
    iconSize:   [12, 12],
    iconAnchor: [6, 6],
  });
}

export function renderRoutes(
  L: typeof import('leaflet'),
  map: import('leaflet').Map,
  routes: MapRoute[]
): import('leaflet').LayerGroup {
  const group = L.layerGroup();
  routes.forEach((route) => {
    const opts = ROUTE_STYLES[route.mode] ?? ROUTE_STYLES['train'];
    L.polyline(route.waypoints, opts).addTo(group);

    // Place a directional arrow at the midpoint of the waypoints array.
    const pts = route.waypoints;
    if (pts.length >= 2) {
      const midIdx  = Math.floor((pts.length - 1) / 2);
      const midPt   = pts[midIdx];
      const nextPt  = pts[midIdx + 1];
      const deg     = bearing(midPt, nextPt);
      const color   = ROUTE_COLORS[route.mode] ?? ROUTE_COLORS['train'];
      const icon    = makeArrowIcon(L, deg, color);
      L.marker(midPt as import('leaflet').LatLngExpression, { icon, interactive: false }).addTo(group);
    }
  });
  group.addTo(map);
  return group;
}
