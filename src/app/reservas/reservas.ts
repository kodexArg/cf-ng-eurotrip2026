import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { TripEvent } from '../shared/models/event.model';
import { City } from '../shared/models/city.model';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';
import { BookingCard } from './booking-card/booking-card';
import { TypeFilter, isTypeActive } from '../shared/type-filter/type-filter';
import { TypeFilterService } from '../shared/type-filter/type-filter.service';

/**
 * Bookings page listing all trip events filterable by type.
 *
 * @remarks
 * Fetches { cities, events } from /api/reservas. A multi-toggle SelectButton allows
 * filtering by event type: hito, traslado, or estadia — each independently on or off.
 * Filter state is shared and persisted via TypeFilterService.
 */
@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [TypeFilter, LoadingState, ErrorState, BookingCard],
  template: `
    <div class="max-w-2xl mx-auto p-4">
      <h1 class="text-2xl font-bold select-none mb-4" style="color: var(--p-surface-800)">Reservas</h1>

      <div class="mb-4">
        <app-type-filter />
      </div>

      @if (reservasResource.isLoading()) { <app-loading-state /> }
      @if (reservasResource.error()) {
        <app-error-state message="No se pudieron cargar las reservas." (retry)="reservasResource.reload()" />
      }

      @if (reservasResource.value()) {
        @for (event of filteredEvents(); track event.id) {
          <div class="mb-2">
            <app-booking-card [event]="event" [cities]="cities()" />
          </div>
        } @empty {
          <p class="text-center text-sm py-8" style="color: var(--p-surface-400)">No hay reservas</p>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservasPage {
  private readonly typeFilters = inject(TypeFilterService);

  readonly reservasResource = httpResource<{ cities: City[]; events: TripEvent[] }>(() => '/api/reservas');

  readonly cities = computed<readonly City[]>(() => this.reservasResource.value()?.cities ?? []);

  readonly filteredEvents = computed(() => {
    const events = this.reservasResource.value()?.events ?? [];
    const tuple = this.typeFilters.active();
    return events.filter((e) => isTypeActive(tuple, e.type));
  });
}
