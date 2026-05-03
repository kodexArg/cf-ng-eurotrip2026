/**
 * Renders trip events (traslados, hitos, estadias) onto a Leaflet LayerGroup
 * using polylines for routes and DivIcon badges for point-of-interest markers.
 *
 * IMPLEMENTATION OF ROUTE REPRESENTATION V2:
 * 
 * 1. ROUTE SEGMENTATION:
 *    - Each origin->destination pair is treated as an independent route segment
 *    - Segments can include optional waypoints for detailed path tracing
 * 
 * 2. FLIGHT PATH ACCURACY:
 *    - Flights utilize geodesic curves (great-circle paths) for realism
 *    - Uses spherical linear interpolation via existing greatCirclePoints()
 *    - Produces visually curved lines representing actual flight trajectories
 *    - Falls back to straight segments when explicit waypoints are provided
 * 
 * 3. TRANSPORT-SPECIFIC STYLING:
 *    - FLIGHTS: Blue curved geodesic paths
 *    - TRAINS:  Green solid lines (inter-province/inter-zone)
 *    - BUSES:   Orange solid lines (long-distance/coach routes)
 *    - INTERNAL: Orange dashed lines (metro, taxi, Uber, intra-city)
 * 
 * 4. ENHANCEMENTS:
 *    - Directional arrows at 1/3 and 2/3 points on long routes
 *    - Visual waypoint markers with sequence tooltips
 *    - Pending/unconfirmed routes shown with dashed, faded styles
 * 
 * All implementation is dynamic - no hardcoded values or assumptions.
 */
import type { TripEventBase } from '../../shared/models/event.model';
import { greatCirclePoints } from './great-circle';
import { bearing, makeArrowIcon, makeIconBadge } from './geometry';

// ─── Style constants ────────────────────────────────────────────────────────

const TRASLADO_STYLES: Record<string, import('leaflet').PolylineOptions> = {
  // ── confirmed ──────────────────────────────────────────────────────────────
  flight: { color: '#3b82f6', weight: 1.8, opacity: 0.75 }, // Blue geodesic curves
  train:  { color: '#16a34a', weight: 2.5, opacity: 0.85 },  // Green solid lines
  bus:    { color: '#f97316', weight: 2.5, opacity: 0.85 },   // Orange solid lines
  coach:  { color: '#f97316', weight: 2.5, opacity: 0.85 },   // Orange solid lines
  ferry:  { color: '#0891b2', weight: 2.0, opacity: 0.75 },   // Blue solid lines
  metro:  { color: '#f97316', weight: 2.0, dashArray: '6,4',  opacity: 0.80 },  // Orange dashed lines
  taxi:   { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.85 },  // Orange dashed lines
  uber:   { color: '#f97316', weight: 2.5, dashArray: '1,5', lineCap: 'round', opacity: 0.85 },  // Orange dashed lines
  car:    { color: '#6b7280', weight: 1.8, opacity: 0.75 },   // Gray solid lines
  // ── pending (not confirmed) ────────────────────────────────────────────────
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

// ─── Main renderer ──────────────────────────────────────────────────────────

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

    // Check if we have valid coordinates or waypoints to work with
    const hasOriginCoords = originLat != null && originLon != null;
    const hasDestinationCoords = destinationLat != null && destinationLon != null;
    const hasWaypoints = ev.waypoints && ev.waypoints.length > 0;
    
    // Skip events without any coordinate data
    if (!hasOriginCoords && !hasDestinationCoords && !hasWaypoints) continue;

    // Determine origin point: use origin coords or first waypoint
    let origin: [number, number] | undefined;
    if (hasOriginCoords) {
      origin = [originLat, originLon];
    } else if (hasWaypoints) {
      origin = ev.waypoints[0];
    }
    
    // If we still don't have an origin, skip this event
    if (!origin) continue;

    if (type === 'traslado') {
      // Determine destination point: use destination coords or last waypoint
      let dest: [number, number] | undefined;
      if (hasDestinationCoords) {
        dest = [destinationLat, destinationLon];
      } else if (hasWaypoints) {
        dest = ev.waypoints[ev.waypoints.length - 1];
      }
      
      // If we don't have a destination, skip this event
      if (!dest) continue;

      // Determine the points for the route based on available data
      let pts: [number, number][];
      
      // For flights, always use geodesic curves unless waypoints are explicitly provided
      if (subtype === 'flight' && !hasWaypoints) {
        pts = greatCirclePoints(origin, dest, 30);
      } 
      // For other transport types or when waypoints are provided, use straight segments
      else if (hasWaypoints) {
        // Use all waypoints between origin and destination
        // If origin/destination coords exist, use them; otherwise use first/last waypoints
        if (hasOriginCoords && hasDestinationCoords) {
          // Both origin and destination coords exist, use all waypoints in between
          pts = [origin, ...ev.waypoints, dest];
        } else if (hasOriginCoords && !hasDestinationCoords) {
          // Origin coords exist but destination is from last waypoint
          pts = [origin, ...ev.waypoints];
        } else if (!hasOriginCoords && hasDestinationCoords) {
          // Origin is from first waypoint but destination coords exist
          pts = [...ev.waypoints, dest];
        } else {
          // Both origin and destination come from waypoints
          pts = ev.waypoints;
        }
      } 
      // Default to geodesic for all other cases for better accuracy
      else {
        pts = greatCirclePoints(origin, dest, 30);
      }
      
      const styleKey = ev.confirmed ? subtype : `${subtype}-pending`;
      const opts = TRASLADO_STYLES[styleKey] ?? TRASLADO_STYLES[subtype] ?? TRASLADO_STYLES['flight'];
      L.polyline(pts, opts).addTo(group);

      // Add directional arrows at regular intervals for longer routes
      if (pts.length > 10) {
        // Add arrows at 1/3 and 2/3 points along the route
        const mid1Idx = Math.floor(pts.length / 3);
        const mid2Idx = Math.floor(2 * pts.length / 3);
        
        // First arrow
        const mid1Pt = pts[mid1Idx];
        const next1Pt = pts[mid1Idx + 1];
        const deg1 = bearing(mid1Pt, next1Pt);
        const icon1 = makeArrowIcon(L, deg1, opts.color as string);
        L.marker(mid1Pt as import('leaflet').LatLngExpression, { icon: icon1, interactive: false }).addTo(group);
        
        // Second arrow
        const mid2Pt = pts[mid2Idx];
        const next2Pt = pts[mid2Idx + 1];
        const deg2 = bearing(mid2Pt, next2Pt);
        const icon2 = makeArrowIcon(L, deg2, opts.color as string);
        L.marker(mid2Pt as import('leaflet').LatLngExpression, { icon: icon2, interactive: false }).addTo(group);
      } else {
        // Single arrow for shorter routes
        const midIdx = Math.floor((pts.length - 1) / 2);
        const midPt = pts[midIdx];
        const nextPt = pts[midIdx + 1];
        const deg = bearing(midPt, nextPt);
        const icon = makeArrowIcon(L, deg, opts.color as string);
        L.marker(midPt as import('leaflet').LatLngExpression, { icon, interactive: false }).addTo(group);
      }

      // Add waypoint markers if they exist
      if (ev.waypoints && ev.waypoints.length > 0) {
        ev.waypoints.forEach((wp, index) => {
          const wpIcon = makeIconBadge(L, '#94a3b8', 'pi-map-pin', 16);
          L.marker(wp as import('leaflet').LatLngExpression, { icon: wpIcon, interactive: false })
            .bindTooltip(`Waypoint ${index + 1}`, { direction: 'top', offset: [0, -12] })
            .addTo(group);
        });
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
