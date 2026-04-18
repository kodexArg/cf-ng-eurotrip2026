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
import { colorFromType, iconFromType } from './icon-registry';
import { ESTADIA_COLOR, ICON_GREYS } from './theme/colors';
import { transportColor } from './transport-colors';

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
 * Resolves the display icon for an event.
 *
 * Priority:
 *  1. Semantic key in ICON_REGISTRY (e.g. "avion" → "ms-flight_takeoff")
 *  2. Raw `ms-*` / `pi-*` / `pi pi-*` value (backward-compat; "pi pi-heart" → "pi-heart")
 *  3. transportIcon(event.subtype) fallback
 */
export function resolveEventIcon(event: { icon?: string | null; subtype?: string | null }): string {
  const iconField = event.icon?.trim();
  if (iconField) {
    // 1. Semantic lookup
    const fromRegistry = iconFromType(iconField);
    if (fromRegistry) return fromRegistry;

    // 2. Raw icon value — normalise legacy "pi pi-*" → "pi-*"
    if (iconField.startsWith('ms-')) return iconField;
    if (iconField.startsWith('pi-')) return iconField;
    if (iconField.startsWith('pi ')) return iconField.replace(/^pi /, 'pi-');
  }
  // 3. Subtype fallback
  return transportIcon(event.subtype);
}

/**
 * Resolves the display color for an event.
 *
 * Priority:
 *  1. Semantic key in ICON_REGISTRY with color defined (e.g. "avion" → "#60a5fa")
 *  2. type === 'estadia' → ESTADIA_COLOR
 *  3. type === 'traslado' → transportColor(event.subtype)
 *  4. Fallback → ICON_GREYS.hito (near-black)
 */
export function resolveEventColor(event: {
  icon?: string | null;
  subtype?: string | null;
  type?: string | null;
}): string {
  // 1. Semantic key with color
  const iconField = event.icon?.trim();
  if (iconField) {
    const color = colorFromType(iconField);
    if (color) return color;
  }

  // 2. Estadía
  if (event.type === 'estadia') return ESTADIA_COLOR;

  // 3. Traslado → transport color by subtype
  if (event.type === 'traslado') {
    return transportColor(event.subtype ?? '');
  }

  // 4. Fallback
  return ICON_GREYS.hito;
}
