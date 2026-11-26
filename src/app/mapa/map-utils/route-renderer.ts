import type { TripEventBase } from '../../shared/models/event.model';
import { greatCirclePoints } from './great-circle';
import { bearing, makeArrowIcon, makeIconBadge } from './geometry';

const TRASLADO_STYLES: Record<string, import('leaflet').PolylineOptions> = {
  flight: { color: '#3b82f6', weight: 1.8, opacity: 0.75 },
  train:  { color: '#16a34a', weight: 2.5, opacity: 0.85 },
  bus:    { color: '#f97316', weight: 2.5, opacity: 0.85 },
  coach:  { color: '#f97316', weight: 2.5, opacity: 0.85 },
  ferry:  { color: '#0891b2', weight: 2.0, opacity: 0.75 },
  metro:  { color: '#f97316', weight: 2.0, dashArray: '6,4',  opacity: 0.80 },
  taxi:   { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.85 },
  uber:   { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.85 },
  car:    { color: '#6b7280', weight: 1.8, opacity: 0.75 },
  'flight-pending': { color: '#3b82f6', weight: 1.8, dashArray: '4,8', opacity: 0.40 },
  'train-pending':  { color: '#16a34a', weight: 2.5, dashArray: '4,8', opacity: 0.40 },
  'bus-pending':    { color: '#f97316', weight: 2.5, dashArray: '4,8', opacity: 0.40 },
  'coach-pending':  { color: '#f97316', weight: 2.5, dashArray: '4,8', opacity: 0.40 },
  'ferry-pending':  { color: '#0891b2', weight: 2.0, dashArray: '4,8', opacity: 0.40 },
  'metro-pending':  { color: '#f97316', weight: 2.0, dashArray: '4,8', opacity: 0.40 },
  'taxi-pending':   { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.40 },
  'uber-pending':   { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.40 },
  'car-pending':    { color: '#6b7280', weight: 1.8, dashArray: '4,8', opacity: 0.40 },
};

const MARKER_COLORS = {
  hito:    '#f59e0b',
  estadia: '#10b981',
};

/**
 * Renders events onto a Leaflet LayerGroup.
 *
 * - traslado: Great-circle polyline from origin to destination + direction arrow.
 *   When waypoints are provided, the route is drawn as straight segments through those points.
 *   For flights without waypoints, geodesic curves are used to represent actual flight paths.
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

    const hasOriginCoords = originLat != null && originLon != null;
    const hasDestinationCoords = destinationLat != null && destinationLon != null;
    const waypoints = ev.waypoints ?? [];
    const hasWaypoints = waypoints.length > 0;
    
    if (!hasOriginCoords && !hasDestinationCoords && !hasWaypoints) continue;

    let origin: [number, number] | undefined;
    if (hasOriginCoords) {
      origin = [originLat, originLon];
    } else if (hasWaypoints) {
      origin = waypoints[0];
    }
    
    if (!origin) continue;

    if (type === 'traslado') {
      let dest: [number, number] | undefined;
      if (hasDestinationCoords) {
        dest = [destinationLat, destinationLon];
      } else if (hasWaypoints) {
        dest = waypoints[waypoints.length - 1];
      }
      
      if (!dest) continue;

      let pts: [number, number][];
      
      if (subtype === 'flight' && !hasWaypoints) {
        pts = greatCirclePoints(origin, dest, 30);
      } 
      else if (hasWaypoints) {
        if (hasOriginCoords && hasDestinationCoords) {
          pts = [origin, ...waypoints, dest];
        } else if (hasOriginCoords && !hasDestinationCoords) {
          pts = [origin, ...waypoints];
        } else if (!hasOriginCoords && hasDestinationCoords) {
          pts = [...waypoints, dest];
        } else {
          pts = [...waypoints];
        }
      } 
      else {
        pts = greatCirclePoints(origin, dest, 30);
      }
      
      const styleKey = ev.confirmed ? subtype : `${subtype}-pending`;
      const opts = TRASLADO_STYLES[styleKey] ?? TRASLADO_STYLES[subtype] ?? TRASLADO_STYLES['flight'];
      L.polyline(pts, opts).addTo(group);

      if (pts.length > 10) {
        const mid1Idx = Math.floor(pts.length / 3);
        const mid2Idx = Math.floor(2 * pts.length / 3);
        
        const mid1Pt = pts[mid1Idx];
        const next1Pt = pts[mid1Idx + 1];
        const deg1 = bearing(mid1Pt, next1Pt);
        const icon1 = makeArrowIcon(L, deg1, opts.color as string);
        L.marker(mid1Pt as import('leaflet').LatLngExpression, { icon: icon1, interactive: false }).addTo(group);
        
        const mid2Pt = pts[mid2Idx];
        const next2Pt = pts[mid2Idx + 1];
        const deg2 = bearing(mid2Pt, next2Pt);
        const icon2 = makeArrowIcon(L, deg2, opts.color as string);
        L.marker(mid2Pt as import('leaflet').LatLngExpression, { icon: icon2, interactive: false }).addTo(group);
      } else {
        const midIdx = Math.floor((pts.length - 1) / 2);
        const midPt = pts[midIdx];
        const nextPt = pts[midIdx + 1];
        const deg = bearing(midPt, nextPt);
        const icon = makeArrowIcon(L, deg, opts.color as string);
        L.marker(midPt as import('leaflet').LatLngExpression, { icon, interactive: false }).addTo(group);
      }

      continue;
    }

    const color = type === 'hito' ? MARKER_COLORS.hito : MARKER_COLORS.estadia;
    const icon = makeIconBadge(L, color, ev.icon || 'pi-map-marker');
    L.marker(origin as import('leaflet').LatLngExpression, { icon })
      .bindTooltip(ev.title, { direction: 'top', offset: [0, -12] })
      .addTo(group);
  }

  group.addTo(map);
  return group;
}
