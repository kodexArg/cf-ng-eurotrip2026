/**
 * Source-of-truth transport color palette for the itinerario.
 * Mirrors the route-renderer.ts palette used on /maps so both
 * views are visually consistent. Hex values are suitable as
 * text/icon colors on a dark surface.
 */

export const TRANSPORT_COLORS: Record<string, string> = {
  flight: '#60a5fa',
  train:  '#16a34a',
  ferry:  '#22d3ee',
  metro:  '#c084fc',
  bus:    '#fb923c',
  coach:  '#fb923c',
  taxi:   '#fb923c',
  uber:   '#fb923c',
  car:    '#94a3b8',
  walking:'#84cc16',
  walk:   '#84cc16',
  scooter:'#facc15',
};

/** Default color for unknown subtypes (slate-400). */
export const TRANSPORT_COLOR_DEFAULT = '#94a3b8';

/**
 * Returns the icon/text color for a given transport subtype.
 * Falls back to slate-400 (#94a3b8) for unknown subtypes.
 */
export function transportColor(subtype: string): string {
  return TRANSPORT_COLORS[subtype] ?? TRANSPORT_COLOR_DEFAULT;
}
