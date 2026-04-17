/**
 * Semantic icon registry for trip events.
 *
 * Keys are Spanish semantic names stored in `events.icon`.
 * Values are raw icon identifiers compatible with `<app-icon>`:
 *   - `ms-*`  → Material Symbols Outlined
 *   - `pi-*`  → PrimeIcons
 */
export const ICON_REGISTRY: Record<string, string> = {
  // Transporte
  avion:      'ms-flight_takeoff',
  tren:       'ms-train',
  subte:      'ms-subway',
  colectivo:  'ms-directions_bus',
  taxi:       'ms-local_taxi',
  auto:       'ms-directions_car',
  caminata:   'ms-directions_walk',
  bicicleta:  'ms-directions_bike',
  scooter:    'ms-electric_scooter',
  ferry:      'ms-directions_boat',
  tranvia:    'ms-tram',
  // Hitos / actividades
  comida:     'ms-lunch_dining',
  cafe:       'ms-local_cafe',
  museo:      'ms-museum',
  monumento:  'ms-account_balance',
  iglesia:    'ms-church',
  parque:     'ms-park',
  compras:    'ms-shopping_bag',
  show:       'ms-theater_comedy',
  corazon:    'pi-heart',
  marcador:   'pi-map-marker',
  // Estadías
  hotel:      'ms-hotel',
  airbnb:     'ms-home',
  // Default
  generico:   'ms-stars',
};

/**
 * Looks up a semantic icon key and returns the raw icon identifier,
 * or `null` if the key is not found in the registry.
 */
export function iconFromType(type: string | null | undefined): string | null {
  if (!type) return null;
  const key = type.trim().toLowerCase();
  return ICON_REGISTRY[key] ?? null;
}
