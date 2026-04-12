import type { TripEventBase } from '../../shared/models/event.model';
import { greatCirclePoints } from './great-circle';

// ─── Style constants ────────────────────────────────────────────────────────

const TRASLADO_STYLES: Record<string, import('leaflet').PolylineOptions> = {
  flight: { color: '#3b82f6', weight: 1.8, opacity: 0.75 },
  train:  { color: '#16a34a', weight: 2.5, dashArray: '10,6', opacity: 0.85 },
  ferry:  { color: '#0891b2', weight: 2.0, dashArray: '8,5',  opacity: 0.75 },
};

const TRASLADO_COLORS: Record<string, string> = {
  flight: '#3b82f6',
  train:  '#16a34a',
  ferry:  '#0891b2',
};

const MARKER_COLORS = {
  hito:    '#f59e0b',
  estadia: '#10b981',
  traslado: '#3b82f6',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Computes the initial bearing (degrees, 0=North, clockwise) from p1 to p2.
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
 */
function makeArrowIcon(L: typeof import('leaflet'), deg: number, color: string): import('leaflet').DivIcon {
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

/**
 * Creates a small circle marker for hito or estadia events.
 */
function makeCircleIcon(L: typeof import('leaflet'), color: string, size = 10): import('leaflet').DivIcon {
  return L.divIcon({
    html: `<div style="
      width:${size}px; height:${size}px;
      background:${color};
      border-radius:50%;
      border:2px solid #fff;
      box-shadow:0 1px 4px rgba(0,0,0,0.25);
      opacity:0.9;
    "></div>`,
    className: '',
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// ─── Main renderer ──────────────────────────────────────────────────────────

/**
 * Renders all events onto a Leaflet LayerGroup.
 *
 * - traslado: great-circle polyline from origin to destination + direction arrow.
 * - estadia:  circle marker at origin coords.
 * - hito:     circle marker at origin coords; optional second marker if destination present.
 *
 * Events with NULL required coords are silently skipped.
 */
export function renderEventsOnMap(
  L: typeof import('leaflet'),
  map: import('leaflet').Map,
  events: TripEventBase[]
): import('leaflet').LayerGroup {
  const group = L.layerGroup();

  for (const ev of events) {
    const { type, subtype, originLat, originLon, destinationLat, destinationLon } = ev;

    if (originLat == null || originLon == null) continue;

    const origin: [number, number] = [originLat, originLon];

    if (type === 'traslado') {
      if (destinationLat == null || destinationLon == null) continue;
      const dest: [number, number] = [destinationLat, destinationLon];

      // Use great-circle arc so long-haul flights curve on the map.
      const pts = greatCirclePoints(origin, dest, 30);
      const opts = TRASLADO_STYLES[subtype] ?? TRASLADO_STYLES['flight'];
      L.polyline(pts, opts).addTo(group);

      // Directional arrow at midpoint.
      const midIdx = Math.floor((pts.length - 1) / 2);
      const midPt  = pts[midIdx];
      const nextPt = pts[midIdx + 1];
      const deg    = bearing(midPt, nextPt);
      const color  = TRASLADO_COLORS[subtype] ?? TRASLADO_COLORS['flight'];
      const icon   = makeArrowIcon(L, deg, color);
      L.marker(midPt as import('leaflet').LatLngExpression, { icon, interactive: false }).addTo(group);

    } else if (type === 'estadia') {
      const icon = makeCircleIcon(L, MARKER_COLORS.estadia, 10);
      L.marker(origin as import('leaflet').LatLngExpression, { icon, interactive: false })
        .bindTooltip(ev.title, { direction: 'top', offset: [0, -6] })
        .addTo(group);

    } else if (type === 'hito') {
      const icon = makeCircleIcon(L, MARKER_COLORS.hito, 8);
      L.marker(origin as import('leaflet').LatLngExpression, { icon, interactive: false })
        .bindTooltip(ev.title, { direction: 'top', offset: [0, -5] })
        .addTo(group);

      // If the hito has a distinct closing point, draw a small marker + short line.
      if (destinationLat != null && destinationLon != null) {
        const dest: [number, number] = [destinationLat, destinationLon];
        L.polyline([origin, dest], { color: MARKER_COLORS.hito, weight: 1.5, dashArray: '4,4', opacity: 0.6 }).addTo(group);
        const endIcon = makeCircleIcon(L, MARKER_COLORS.hito, 6);
        L.marker(dest as import('leaflet').LatLngExpression, { icon: endIcon, interactive: false }).addTo(group);
      }
    }
  }

  group.addTo(map);
  return group;
}
