/**
 * Source-of-truth transport icon mapping.
 * Used by both the itinerario event-slot and the reservas traslado-body card.
 *
 * Icon families:
 *  - Material Symbols Outlined: prefix `ms-` (e.g. `ms-flight_takeoff`)
 *  - PrimeIcons: prefix `pi-` (e.g. `pi-sign-out`)
 *
 * Compatible with InfoRow (auto-detects ms- vs pi- prefix) and with any
 * component that applies the class directly via `<i class="..."></i>` or
 * a `<span class="material-symbols-outlined">`.
 */

const TRANSPORT_ICONS: Record<string, string> = {
  flight:   'ms-flight_takeoff',
  train:    'ms-train',
  metro:    'ms-subway',
  tram:     'ms-tram',
  bus:      'ms-directions_bus',
  coach:    'ms-directions_bus',
  taxi:     'ms-local_taxi',
  ferry:    'ms-directions_boat',
  boat:     'ms-directions_boat',
  walk:     'ms-directions_walk',
  walking:  'ms-directions_walk',
  scooter:  'ms-electric_scooter',
  car:      'ms-directions_car',
};

/** Default icon for unknown or null subtypes. */
export const TRANSPORT_ICON_DEFAULT = 'ms-directions_transit';

/**
 * Returns the icon key for a given transport subtype.
 * Falls back to `ms-directions_transit` for unknown or nullish subtypes.
 */
export function transportIcon(subtype: string | null | undefined): string {
  if (!subtype) return TRANSPORT_ICON_DEFAULT;
  return TRANSPORT_ICONS[subtype] ?? TRANSPORT_ICON_DEFAULT;
}

/**
 * Resolves the display icon for an event, preferring the explicit `icon`
 * field over the subtype-derived fallback.
 *
 * Priority: event.icon (if non-empty) > transportIcon(event.subtype)
 */
export function resolveEventIcon(event: { icon?: string | null; subtype?: string | null }): string {
  return event.icon && event.icon.trim() ? event.icon : transportIcon(event.subtype);
}
