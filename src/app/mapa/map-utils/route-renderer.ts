import type { TripEventBase } from '../../shared/models/event.model';
import { greatCirclePoints } from './great-circle';

// ─── Style constants ────────────────────────────────────────────────────────

const TRASLADO_STYLES: Record<string, import('leaflet').PolylineOptions> = {
  // ── confirmed ──────────────────────────────────────────────────────────────
  flight: { color: '#3b82f6', weight: 1.8, opacity: 0.75 },
  train:  { color: '#16a34a', weight: 2.5, dashArray: '10,6', opacity: 0.85 },
  ferry:  { color: '#0891b2', weight: 2.0, dashArray: '8,5',  opacity: 0.75 },
  metro:  { color: '#a855f7', weight: 2.0, dashArray: '6,4',  opacity: 0.80 },
  bus:    { color: '#f97316', weight: 2.0, dashArray: '6,4',  opacity: 0.80 },
  car:    { color: '#6b7280', weight: 1.8, opacity: 0.75 },
  // ── pending (not confirmed) ────────────────────────────────────────────────
  'flight-pending': { color: '#3b82f6', weight: 1.8, dashArray: '4,8', opacity: 0.40 },
  'train-pending':  { color: '#16a34a', weight: 2.5, dashArray: '4,8', opacity: 0.40 },
  'ferry-pending':  { color: '#0891b2', weight: 2.0, dashArray: '4,8', opacity: 0.40 },
  'metro-pending':  { color: '#a855f7', weight: 2.0, dashArray: '4,8', opacity: 0.40 },
  'bus-pending':    { color: '#f97316', weight: 2.0, dashArray: '4,8', opacity: 0.40 },
  'car-pending':    { color: '#6b7280', weight: 1.8, dashArray: '4,8', opacity: 0.40 },
};

const MARKER_COLORS = {
  hito:    '#f59e0b',
  estadia: '#10b981',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

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

function makeIconBadge(L: typeof import('leaflet'), color: string, iconClass: string, size = 22): import('leaflet').DivIcon {
  const glyph = size * 0.55;
  return L.divIcon({
    html: `<div style="
      width:${size}px; height:${size}px;
      background:${color};
      border-radius:50%;
      border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      display:flex; align-items:center; justify-content:center;
      color:#fff;
    "><i class="pi ${iconClass}" style="font-size:${glyph}px;line-height:1"></i></div>`,
    className: '',
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// ─── Main renderer ──────────────────────────────────────────────────────────

/**
 * Renders events onto a Leaflet LayerGroup.
 *
 * - traslado: great-circle polyline from origin to destination + direction arrow.
 * - hito/estadia: PrimeIcon badge at origin — only when the event has coords.
 *   Events without `origin_lat` live in the city hover popup only.
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

      const pts: [number, number][] = ev.waypoints && ev.waypoints.length > 0
        ? [origin, ...ev.waypoints, dest]
        : greatCirclePoints(origin, dest, 30);
      const styleKey = ev.confirmed ? subtype : `${subtype}-pending`;
      const opts = TRASLADO_STYLES[styleKey] ?? TRASLADO_STYLES[subtype] ?? TRASLADO_STYLES['flight'];
      L.polyline(pts, opts).addTo(group);

      const midIdx = Math.floor((pts.length - 1) / 2);
      const midPt  = pts[midIdx];
      const nextPt = pts[midIdx + 1];
      const deg    = bearing(midPt, nextPt);
      const icon   = makeArrowIcon(L, deg, opts.color as string);
      L.marker(midPt as import('leaflet').LatLngExpression, { icon, interactive: false }).addTo(group);

      continue;
    }

    const color = type === 'hito' ? MARKER_COLORS.hito : MARKER_COLORS.estadia;
    const icon  = makeIconBadge(L, color, ev.icon || 'pi-map-marker');
    L.marker(origin as import('leaflet').LatLngExpression, { icon })
      .bindTooltip(ev.title, { direction: 'top', offset: [0, -12] })
      .addTo(group);
  }

  group.addTo(map);
  return group;
}
