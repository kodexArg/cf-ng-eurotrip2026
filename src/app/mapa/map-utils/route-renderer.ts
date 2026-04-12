import type { City } from '../../shared/models/city.model';
import type { TripEventBase } from '../../shared/models/event.model';
import { greatCirclePoints } from './great-circle';

// ─── Style constants ────────────────────────────────────────────────────────

const TRASLADO_STYLES: Record<string, import('leaflet').PolylineOptions> = {
  flight: { color: '#3b82f6', weight: 1.8, opacity: 0.75 },
  train:  { color: '#16a34a', weight: 2.5, dashArray: '10,6', opacity: 0.85 },
  ferry:  { color: '#0891b2', weight: 2.0, dashArray: '8,5',  opacity: 0.75 },
};

const MARKER_COLORS = {
  hito:    '#f59e0b',
  estadia: '#10b981',
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
 * Creates a PrimeIcon badge marker (colored circle with icon glyph inside).
 */
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

/** True if the event's origin matches its city's center (i.e. fallback coords). */
function isCityCenterFallback(ev: TripEventBase, cityIndex: Map<string, City>): boolean {
  const city = cityIndex.get(ev.cityIn);
  if (!city) return false;
  return ev.originLat === city.lat && ev.originLon === city.lon;
}

// ─── Main renderer ──────────────────────────────────────────────────────────

/**
 * Renders events onto a Leaflet LayerGroup.
 *
 * - traslado: great-circle polyline from origin to destination + direction arrow.
 * - hito/estadia: PrimeIcon badge at origin — ONLY if coords are precise (not a
 *   city-center fallback). Fallback-coord events are silently skipped so they
 *   don't stack under the city marker; they still appear in the city hover popup.
 */
export function renderEventsOnMap(
  L: typeof import('leaflet'),
  map: import('leaflet').Map,
  events: TripEventBase[],
  cities: City[]
): import('leaflet').LayerGroup {
  const group = L.layerGroup();
  const cityIndex = new Map<string, City>(cities.map((c) => [c.id, c]));

  for (const ev of events) {
    const { type, subtype, originLat, originLon, destinationLat, destinationLon } = ev;

    if (originLat == null || originLon == null) continue;

    const origin: [number, number] = [originLat, originLon];

    if (type === 'traslado') {
      if (destinationLat == null || destinationLon == null) continue;
      const dest: [number, number] = [destinationLat, destinationLon];

      const pts = greatCirclePoints(origin, dest, 30);
      const opts = TRASLADO_STYLES[subtype] ?? TRASLADO_STYLES['flight'];
      L.polyline(pts, opts).addTo(group);

      const midIdx = Math.floor((pts.length - 1) / 2);
      const midPt  = pts[midIdx];
      const nextPt = pts[midIdx + 1];
      const deg    = bearing(midPt, nextPt);
      const icon   = makeArrowIcon(L, deg, opts.color as string);
      L.marker(midPt as import('leaflet').LatLngExpression, { icon, interactive: false }).addTo(group);

      continue;
    }

    // hito / estadia — skip unless we have precise (non city-center) coordinates.
    if (isCityCenterFallback(ev, cityIndex)) continue;

    const color = type === 'hito' ? MARKER_COLORS.hito : MARKER_COLORS.estadia;
    const icon  = makeIconBadge(L, color, ev.icon || 'pi-map-marker');
    L.marker(origin as import('leaflet').LatLngExpression, { icon })
      .bindTooltip(ev.title, { direction: 'top', offset: [0, -12] })
      .addTo(group);
  }

  group.addTo(map);
  return group;
}
