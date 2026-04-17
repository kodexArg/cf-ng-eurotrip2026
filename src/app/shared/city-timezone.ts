import { CITY_SLUGS } from './constants/cities';

/**
 * Per-city UTC offset in whole hours for the May–June 2026 trip window.
 *
 * Europe DST runs from the last Sunday of March (2026-03-29) to the
 * last Sunday of October (2026-10-25), so every date of this trip
 * sits inside DST. No date-dependent branching is needed here — if the
 * itinerary ever extends outside DST, turn this into a function that
 * takes a date.
 *
 *  - Europe/Madrid, Europe/Paris, Europe/Rome → CEST, UTC+2
 *  - Europe/London                            → BST,  UTC+1
 */
export const CITY_UTC_OFFSET: Record<string, number> = {
  [CITY_SLUGS.MADRID]:    2,
  [CITY_SLUGS.BARCELONA]: 2,
  [CITY_SLUGS.PALMA]:     2,
  [CITY_SLUGS.PARIS]:     2,
  [CITY_SLUGS.ROMA]:      2,
  [CITY_SLUGS.LONDRES]:   1,
};

/** Format an integer UTC offset as `UTC+N` / `UTC-N` / `UTC`. */
export function formatUtcOffset(offset: number): string {
  if (offset === 0) return 'UTC';
  const sign = offset > 0 ? '+' : '−';
  return `UTC${sign}${Math.abs(offset)}`;
}

/**
 * Return the UTC offset (whole hours) for a given city slug, or `null`
 * when the slug is unknown. Callers should skip the timezone-change
 * warning in that case rather than guess.
 */
export function getCityUtcOffset(slug: string): number | null {
  return Object.prototype.hasOwnProperty.call(CITY_UTC_OFFSET, slug)
    ? CITY_UTC_OFFSET[slug]
    : null;
}
