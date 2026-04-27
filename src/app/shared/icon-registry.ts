/**
 * Semantic icon registry for trip events.
 *
 * Keys are Spanish semantic names stored in `events.icon`.
 * Each entry carries both:
 *   - `icon`: raw icon identifier compatible with `<app-icon>` (`ms-*` or `pi-*`)
 *   - `color`: semantic hex color for this icon type (used by resolveEventColor)
 */

export interface IconEntry {
  icon: string;
  color: string;
}

export const ICON_REGISTRY: Record<string, IconEntry> = {
  // Transporte
  avion:        { icon: 'ms-flight_takeoff',    color: '#60a5fa' },
  aterriza:     { icon: 'ms-flight_land',       color: '#60a5fa' },
  tren:         { icon: 'ms-train',             color: '#16a34a' },
  tren_llega:   { icon: 'ms-directions_railway', color: '#16a34a' },
  subte:        { icon: 'ms-subway',            color: '#c084fc' },
  colectivo:    { icon: 'ms-directions_bus',    color: '#fb923c' },
  taxi:         { icon: 'ms-local_taxi',        color: '#fb923c' },
  auto:         { icon: 'ms-directions_car',    color: '#94a3b8' },
  caminata:     { icon: 'ms-directions_walk',   color: '#84cc16' },
  bicicleta:    { icon: 'ms-directions_bike',   color: '#84cc16' },
  scooter:      { icon: 'ms-electric_scooter',  color: '#facc15' },
  ferry:        { icon: 'ms-sailing',           color: '#22d3ee' },
  tranvia:      { icon: 'ms-tram',              color: '#c084fc' },
  bus_turistico: { icon: 'ms-tour',             color: '#dc2626' },
  // Hitos / actividades
  comida:       { icon: 'ms-lunch_dining',      color: '#f97316' },
  cafe:         { icon: 'ms-local_cafe',        color: '#8b6f47' },
  museo:        { icon: 'ms-museum',            color: '#722F37' },
  monumento:    { icon: 'ms-account_balance',   color: '#78716c' },
  iglesia:      { icon: 'ms-church',            color: '#6366f1' },
  parque:       { icon: 'ms-park',              color: '#16a34a' },
  compras:      { icon: 'ms-shopping_bag',      color: '#db2777' },
  show:         { icon: 'ms-theater_comedy',    color: '#a855f7' },
  corazon:      { icon: 'pi-heart',             color: '#ef4444' },
  marcador:     { icon: 'pi-map-marker',        color: '#0ea5e9' },
  // New semantic icons
  tapas:        { icon: 'ms-tapas',             color: '#f97316' },
  paseo:        { icon: 'ms-near_me',           color: '#84cc16' },
  mirador:      { icon: 'ms-landscape',         color: '#059669' },
  sendero:      { icon: 'ms-hiking',            color: '#65a30d' },
  palmera:      { icon: 'ms-palm_beach',        color: '#0ea5e9' },
  atardecer:    { icon: 'ms-wb_twilight',       color: '#f59e0b' },
  nocturno:     { icon: 'ms-nightlife',         color: '#6366f1' },
  castillo:     { icon: 'ms-castle',            color: '#78716c' },
  plaza:        { icon: 'ms-square',            color: '#78716c' },
  descanso:     { icon: 'ms-spa',               color: '#a78bfa' },
  aeropuerto:   { icon: 'ms-flight',            color: '#60a5fa' },
  fuente:       { icon: 'ms-water',             color: '#22d3ee' },
  arquitectura: { icon: 'ms-apartment',         color: '#78716c' },
  mercado:      { icon: 'ms-store',             color: '#ea580c' },
  barrio:       { icon: 'ms-location_city',     color: '#6366f1' },
  excursion:    { icon: 'ms-hiking',            color: '#059669' },
  // Paisajes y actividades
  playa:        { icon: 'ms-umbrella',          color: '#0ea5e9' },
  agua:         { icon: 'ms-water_drop',        color: '#22d3ee' },
  noche:        { icon: 'ms-dark_mode',         color: '#6366f1' },
  vista:        { icon: 'ms-landscape',         color: '#059669' },
  torre:        { icon: 'ms-church',            color: '#6366f1' },
  basílica:     { icon: 'ms-church',            color: '#4338ca' },
  puente:       { icon: 'ms-bridge',            color: '#78716c' },
  jardín:       { icon: 'ms-park',              color: '#16a34a' },
  // Estadías
  hotel:        { icon: 'ms-hotel',             color: '#ea580c' },
  airbnb:       { icon: 'ms-home',              color: '#ef4444' },
  // Default
  generico:     { icon: 'ms-stars',             color: '#6b7280' },
};

/**
 * Looks up a semantic icon key and returns the raw icon identifier,
 * or `null` if the key is not found in the registry.
 *
 * Backward-compatible: callers that only need the icon string continue to work.
 */
export function iconFromType(type: string | null | undefined): string | null {
  if (!type) return null;
  const key = type.trim().toLowerCase();
  return ICON_REGISTRY[key]?.icon ?? null;
}

/**
 * Looks up a semantic icon key and returns the semantic color for that type,
 * or `undefined` if the key is not found in the registry.
 */
export function colorFromType(type: string | null | undefined): string | undefined {
  if (!type) return undefined;
  const key = type.trim().toLowerCase();
  return ICON_REGISTRY[key]?.color;
}