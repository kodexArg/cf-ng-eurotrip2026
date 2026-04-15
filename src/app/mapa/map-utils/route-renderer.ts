/**
 * Renders trip events (traslados, hitos, estadias) onto a Leaflet LayerGroup
 * using polylines for routes and DivIcon badges for point-of-interest markers.
 */
import type { TripEventBase } from '../../shared/models/event.model';
import { greatCirclePoints } from './great-circle';
import { bearing, makeArrowIcon, makeIconBadge } from './geometry';

// ─── Style constants ────────────────────────────────────────────────────────

const TRASLADO_STYLES: Record<string, import('leaflet').PolylineOptions> = {
  // ── confirmed ──────────────────────────────────────────────────────────────
  flight: { color: '#3b82f6', weight: 1.8, opacity: 0.75 },
  train:  { color: '#16a34a', weight: 2.5, dashArray: '10,6', opacity: 0.85 },
  ferry:  { color: '#0891b2', weight: 2.0, dashArray: '8,5',  opacity: 0.75 },
  metro:  { color: '#a855f7', weight: 2.0, dashArray: '6,4',  opacity: 0.80 },
  bus:    { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.85 },
  coach:  { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.85 },
  taxi:   { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.85 },
  uber:   { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.85 },
  car:    { color: '#6b7280', weight: 1.8, opacity: 0.75 },
  // ── pending (not confirmed) ────────────────────────────────────────────────
  'flight-pending': { color: '#3b82f6', weight: 1.8, dashArray: '4,8', opacity: 0.40 },
  'train-pending':  { color: '#16a34a', weight: 2.5, dashArray: '4,8', opacity: 0.40 },
  'ferry-pending':  { color: '#0891b2', weight: 2.0, dashArray: '4,8', opacity: 0.40 },
  'metro-pending':  { color: '#a855f7', weight: 2.0, dashArray: '4,8', opacity: 0.40 },
  'bus-pending':    { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.40 },
  'coach-pending':  { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.40 },
  'taxi-pending':   { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.40 },
  'uber-pending':   { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.40 },
  'car-pending':    { color: '#6b7280', weight: 1.8, dashArray: '4,8', opacity: 0.40 },
};

const MARKER_COLORS = {
  hito:    '#f59e0b',
  estadia: '#10b981',
};

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
