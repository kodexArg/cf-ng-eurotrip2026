/**
 * Source-of-truth transport color palette for the itinerario.
 * Mirrors the route-renderer.ts palette used on /maps so both
 * views are visually consistent. Hex values are suitable as
 * text/icon colors on a dark surface.
 */

export const TRANSPORT_COLORS: Record<string, string> = {
  flight: '#60a5fa',   // blue-400  (softened from map #3b82f6)
  train:  '#16a34a',   // green-600 (matches map palette for stronger contrast)
  ferry:  '#22d3ee',   // cyan-400  (softened from map #0891b2)
  metro:  '#c084fc',   // purple-400 (softened from map #a855f7)
  bus:    '#fb923c',   // orange-400 (softened from map #f97316)
  coach:  '#fb923c',
  taxi:   '#fb923c',
  uber:   '#fb923c',
  car:    '#94a3b8',   // slate-400  (softened from map #6b7280)
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
