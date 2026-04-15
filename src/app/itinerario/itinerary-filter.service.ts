import { Injectable, effect, signal } from '@angular/core';
import { EventType } from '../shared/models/event.model';

const COOKIE_NAME = 'itinerary-filters';
const MAX_AGE = 365 * 24 * 60 * 60;

interface FilterState {
  hitos: boolean;
  traslados: boolean;
  hospedajes: boolean;
}

function readCookie(): FilterState {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(COOKIE_NAME + '='));
  if (!match) return { hitos: true, traslados: true, hospedajes: true };
  try {
    const value = decodeURIComponent(match.split('=').slice(1).join('='));
    const parsed = JSON.parse(value) as Partial<FilterState>;
    return {
      hitos: parsed.hitos ?? true,
      traslados: parsed.traslados ?? true,
      hospedajes: parsed.hospedajes ?? true,
    };
  } catch {
    return { hitos: true, traslados: true, hospedajes: true };
  }
}

function writeCookie(state: FilterState): void {
  const value = encodeURIComponent(JSON.stringify(state));
  document.cookie = `${COOKIE_NAME}=${value}; max-age=${MAX_AGE}; path=/`;
}

@Injectable({ providedIn: 'root' })
export class ItineraryFilterService {
  readonly showHitos = signal(true);
  readonly showTraslados = signal(true);
  readonly showHospedajes = signal(true);

  constructor() {
    const saved = readCookie();
    this.showHitos.set(saved.hitos);
    this.showTraslados.set(saved.traslados);
    this.showHospedajes.set(saved.hospedajes);

    effect(() => {
      writeCookie({
        hitos: this.showHitos(),
        traslados: this.showTraslados(),
        hospedajes: this.showHospedajes(),
      });
    });
  }

  toggle(type: EventType): void {
    if (type === 'hito') this.showHitos.update((v) => !v);
    else if (type === 'traslado') this.showTraslados.update((v) => !v);
    else if (type === 'estadia') this.showHospedajes.update((v) => !v);
  }
}
