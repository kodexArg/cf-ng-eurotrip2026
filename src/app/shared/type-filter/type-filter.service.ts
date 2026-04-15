import { Injectable, signal } from '@angular/core';
import { EventType } from '../models/event.model';
import { TypeFilterTuple, TYPE_FILTER_INDEX, isTypeActive } from './type-filter';

/**
 * Persistent user filter state for event types (hito / traslado / estadia).
 *
 * @remarks
 * Hydrates from localStorage on construction and writes back on every change.
 * Default when nothing is stored: all three types visible [true, true, true].
 * Consumed by TypeFilter component and by any page that filters TripEvents
 * by type (currently /reservas and /itinerario).
 */
@Injectable({ providedIn: 'root' })
export class TypeFilterService {
  private readonly storageKey = 'eurotrip2026.typeFilter';
  readonly active = signal<TypeFilterTuple>(this.hydrate());

  toggle(type: EventType): void {
    const current = this.active();
    const idx = TYPE_FILTER_INDEX[type];
    const arr: [boolean, boolean, boolean] = [current[0], current[1], current[2]];
    arr[idx] = !current[idx];
    this.set(arr);
  }

  set(value: TypeFilterTuple): void {
    this.active.set(value);
    this.persist(value);
  }

  isVisible(type: EventType): boolean {
    return isTypeActive(this.active(), type);
  }

  private hydrate(): TypeFilterTuple {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [true, true, true];
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.length === 3 &&
        parsed.every((v) => typeof v === 'boolean')
      ) {
        return [parsed[0], parsed[1], parsed[2]] as TypeFilterTuple;
      }
      return [true, true, true];
    } catch {
      return [true, true, true];
    }
  }

  private persist(value: TypeFilterTuple): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(value));
    } catch {
    }
  }
}
