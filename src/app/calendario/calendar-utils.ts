import { City, TripEvent, isTraslado } from '../shared/models';

/** Solid city color for a date within its [arrival, departure] range. */
export function getDayColorFromCities(dateStr: string, cities: City[]): string | null {
  for (const city of cities) {
    if (dateStr >= city.arrival && dateStr <= city.departure) {
      return city.color;
    }
  }
  return null;
}

/**
 * Diagonal split gradient for a travel day, derived from the day's actual
 * traslado events (not from city arrival/departure overlap — those have
 * gaps, e.g. BCN departs Apr 27 and PMI arrives Apr 28 but the flight is
 * on Apr 28, so there's no same-date overlap).
 *
 * DB semantics: for a `traslado` row, `city_out` is the ORIGIN and
 * `city_in` is the DESTINATION. If a day has multiple traslados (layover
 * like ROM → MAD → EZE on May 9), the first's origin and the last's
 * destination define the overall direction for the gradient.
 */
export function getTravelGradientFromEvents(
  events: readonly TripEvent[],
  cities: readonly City[],
): string | null {
  const legs = events
    .filter(isTraslado)
    .filter((e) => e.cityOut && e.cityOut !== e.cityIn)
    .slice()
    .sort((a, b) => (a.timestampIn ?? '').localeCompare(b.timestampIn ?? ''));

  if (legs.length === 0) return null;

  const fromId = legs[0].cityOut!;
  const toId   = legs[legs.length - 1].cityIn;
  if (fromId === toId) return null;

  const byId = new Map(cities.map((c) => [c.id, c]));
  const from = byId.get(fromId);
  const to   = byId.get(toId);
  if (!from || !to) return null;

  return `linear-gradient(135deg, ${from.color} 0%, ${from.color} 50%, ${to.color} 50%, ${to.color} 100%)`;
}

export function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
