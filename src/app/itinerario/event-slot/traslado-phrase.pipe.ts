import { Pipe, PipeTransform } from '@angular/core';
import { City, TrasladoEvent, timeOf } from '../../shared/models';

/**
 * Produce a one-line semantic description of a traslado event:
 *
 *   "Partida desde Madrid a las 09:05 por Vueling · llega Palma a las 10:00"
 *
 * The cityIn / cityOut IDs are resolved to display names using the
 * provided city catalog; missing IDs fall back to uppercase.
 */
@Pipe({ name: 'trasladoPhrase', standalone: true })
export class TrasladoPhrasePipe implements PipeTransform {
  transform(event: TrasladoEvent, cities: readonly City[] = []): string {
    const nameById = new Map(cities.map((c) => [c.id, c.name]));
    const origin = event.cityOut ? (nameById.get(event.cityOut) ?? event.cityOut.toUpperCase()) : '—';
    const dest = nameById.get(event.cityIn) ?? event.cityIn.toUpperCase();
    const departTime = timeOf(event.timestampIn);
    const arriveTime = event.timestampOut ? timeOf(event.timestampOut) : null;
    const company = event.company && event.company.trim() !== '' ? event.company : '—';

    const parts: string[] = [];
    parts.push(`Partida desde ${origin} a las ${departTime} por ${company}`);
    if (arriveTime) {
      parts.push(`llega ${dest} a las ${arriveTime}`);
    } else {
      parts.push(`destino ${dest}`);
    }
    return parts.join(' · ');
  }
}
