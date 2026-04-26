import { Injectable } from '@angular/core';
import { City, HitoEvent, TripEvent, isTraslado, timeOf } from '../models';

/**
 * City IDs whose airport counts as "España" (domestic).
 * Madrid, Barcelona and Palma de Mallorca are all in Spain.
 * London and Rome are international.
 */
const SPAIN_CITY_IDS = new Set(['mad', 'bcn', 'pmi']);

/** How many minutes before the flight the traveler must reach the airport. */
const OFFSET_DOMESTIC_MIN = 90;
const OFFSET_INTERNATIONAL_MIN = 120;

@Injectable({ providedIn: 'root' })
export class ItineraryEnrichmentService {
  /**
   * Given the raw events from the API, synthesise an extra "Presentarse en
   * aeropuerto" hito before every flight traslado. The synthetic hito lives
   * in the origin city (cityOut of the leg) with a timestamp equal to the
   * flight's timestampIn minus the right offset.
   *
   * The returned array contains the original events plus the synthetic
   * ones, re-sorted by timestampIn.
   */
  enrich(events: TripEvent[], cities: City[]): TripEvent[] {
    const cityById = new Map(cities.map((c) => [c.id, c]));
    const synthetic: HitoEvent[] = [];

    for (const e of events) {
      if (!isTraslado(e)) continue;
      if (e.subtype !== 'flight') continue;
      if (!e.cityOut) continue;

      const originId = e.cityOut;
      const destId = e.cityIn;
      const bothDomestic = SPAIN_CITY_IDS.has(originId) && SPAIN_CITY_IDS.has(destId);
      const offsetMin = bothDomestic ? OFFSET_DOMESTIC_MIN : OFFSET_INTERNATIONAL_MIN;

      const arriveTimestamp = subtractMinutes(e.timestampIn, offsetMin);
      const originCity = cityById.get(originId);
      const originName = originCity?.name ?? originId.toUpperCase();

      const title = e.confirmed
        ? `Presentarse en aeropuerto ${originName} · ${timeOf(arriveTimestamp)}`
        : `Presentarse en aeropuerto (~${offsetMin}min antes)`;

      synthetic.push({
        id: `synth_arrive_${e.id}`,
        type: 'hito',
        subtype: 'transfer',
        slug: `synth-arrive-${e.id}`,
        title,
        description: null,
        date: arriveTimestamp.slice(0, 10),
        timestampIn: arriveTimestamp,
        timestampOut: null,
        cityIn: originId,
        cityOut: null,
        usd: null,
        icon: 'pi-map-marker',
        confirmed: e.confirmed,
        done: e.done,
        mandatory: e.mandatory,
        variant: e.variant,
        cardId: null,
        notes: null,
      });
    }

    return [...events, ...synthetic].sort((a, b) =>
      a.timestampIn.localeCompare(b.timestampIn)
    );
  }
}

/**
 * Subtract `minutes` from a local timestamp and return a naive
 * YYYY-MM-DDTHH:MM:SS. Accepts both naive (`2026-05-06T16:50:00`) and
 * timezone-suffixed (`2026-05-06T16:50:00+02:00` / `...Z`) inputs —
 * in both cases we operate on the wall-clock the traveler sees, so DST
 * and timezone math never enter the picture.
 */
function subtractMinutes(timestamp: string, minutes: number): string {
  // Strip any trailing Z or ±HH:MM offset so the result is always naive local.
  const naive = timestamp.replace(/(Z|[+-]\d{2}:?\d{2})$/, '');
  const asUtc = new Date(naive + 'Z');
  asUtc.setUTCMinutes(asUtc.getUTCMinutes() - minutes);
  const yyyy = asUtc.getUTCFullYear();
  const mm = String(asUtc.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(asUtc.getUTCDate()).padStart(2, '0');
  const hh = String(asUtc.getUTCHours()).padStart(2, '0');
  const mi = String(asUtc.getUTCMinutes()).padStart(2, '0');
  const ss = String(asUtc.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
}
