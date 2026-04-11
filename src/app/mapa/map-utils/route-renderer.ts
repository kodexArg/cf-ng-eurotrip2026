import type { MapRoute } from '../../shared/models/map-route.model';

const ROUTE_STYLES: Record<string, import('leaflet').PolylineOptions> = {
  train:   { color: '#16a34a', weight: 2.5, dashArray: '10,6', opacity: 0.85 },
  daytrip: { color: '#7c3aed', weight: 1.8, dashArray: '5,5',  opacity: 0.75 },
  flight:  { color: '#2563eb', weight: 1.8, opacity: 0.7 },
  ferry:   { color: '#0891b2', weight: 2.0, dashArray: '8,5',  opacity: 0.75 },
};

export function renderRoutes(
  L: typeof import('leaflet'),
  map: import('leaflet').Map,
  routes: MapRoute[]
): import('leaflet').LayerGroup {
  const group = L.layerGroup();
  routes.forEach((route) => {
    const opts = ROUTE_STYLES[route.mode] ?? ROUTE_STYLES['train'];
    L.polyline(route.waypoints, opts).addTo(group);
  });
  group.addTo(map);
  return group;
}
