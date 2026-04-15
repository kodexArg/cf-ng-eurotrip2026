import { Injectable, signal } from '@angular/core';
import { EventType } from '../shared/models/event.model';
import { FilterValue } from '../shared/type-filter/type-filter';

/**
 * Shared state for the itinerary event-type filter.
 *
 * @remarks
 * Single-select: one of 'all' | 'hito' | 'traslado' | 'estadia'.
 * 'all' means no filter — every event type is visible.
 * Consumers call `isVisible(type)` to gate rendering.
 */
@Injectable({ providedIn: 'root' })
export class ItineraryFilterService {
  readonly filter = signal<FilterValue>('all');

  isVisible(type: EventType): boolean {
    const f = this.filter();
    return f === 'all' || f === type;
  }

  setFilter(value: FilterValue): void {
    this.filter.set(value);
  }
}
