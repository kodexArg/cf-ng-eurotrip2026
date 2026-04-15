import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { httpResource } from '@angular/common/http';
import { SelectButton } from 'primeng/selectbutton';
import { TripEvent, EventType } from '../shared/models/event.model';
import { City } from '../shared/models/city.model';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';
import { BookingCard } from '../reservas/booking-card/booking-card';
import { AuthService } from '../shared/services/auth.service';
import { LoginPanel } from '../shared/login-panel/login-panel';
import { EventForm } from './event-form/event-form';

type FilterValue = EventType | 'all';

/**
 * Owner-only event management page for creating, editing, and deleting trip events.
 *
 * @remarks
 * Guarded by AuthService; shows LoginPanel when the user is not the owner.
 * Selecting a BookingCard loads that event into EventForm for editing.
 * On save or delete the resource is reloaded and the selection is cleared.
 */
@Component({
  selector: 'app-modificaciones',
  standalone: true,
  imports: [FormsModule, SelectButton, LoadingState, ErrorState, BookingCard, LoginPanel, EventForm],
  template: `
    @if (auth.isOwner()) {
      <div class="max-w-2xl mx-auto p-4">
        <h1 class="text-2xl font-bold select-none mb-4" style="color: var(--p-surface-800)">Modificaciones</h1>

        <app-event-form
          [event]="selectedEvent()"
          [cities]="cities()"
          (saved)="onSaved()"
          (deleted)="onDeleted()"
          (cleared)="onCleared()"
        />

        <div class="mb-4">
          <p-selectbutton [options]="filterOptions" [(ngModel)]="typeFilter" optionLabel="label" optionValue="value" />
        </div>

        @if (reservasResource.isLoading()) { <app-loading-state /> }
        @if (reservasResource.error()) {
          <app-error-state message="No se pudieron cargar los eventos." (retry)="reservasResource.reload()" />
        }

        @if (reservasResource.value()) {
          @for (event of filteredEvents(); track event.id) {
            <div class="mb-2">
              <app-booking-card
                [event]="event"
                [cities]="cities()"
                [selectable]="true"
                [selected]="selectedEvent()?.id === event.id"
                (selectToggle)="onSelectToggle(event)"
              />
            </div>
          } @empty {
            <p class="text-center text-sm py-8" style="color: var(--p-surface-400)">No hay eventos</p>
          }
        }
      </div>
    } @else {
      <app-login-panel />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificacionesPage {
  readonly auth = inject(AuthService);

  readonly reservasResource = httpResource<{ cities: City[]; events: TripEvent[] }>(() => '/api/reservas');

  readonly cities = computed<readonly City[]>(() => this.reservasResource.value()?.cities ?? []);

  readonly typeFilter = signal<FilterValue>('all');

  readonly filterOptions = [
    { label: 'Todos',     value: 'all' },
    { label: 'Hitos',     value: 'hito' },
    { label: 'Viajes',    value: 'traslado' },
    { label: 'Hospedaje', value: 'estadia' },
  ];

  readonly selectedEvent = signal<TripEvent | null>(null);

  onSelectToggle(event: TripEvent): void {
    this.selectedEvent.set(this.selectedEvent()?.id === event.id ? null : event);
  }
  onSaved(): void { this.reservasResource.reload(); this.selectedEvent.set(null); }
  onDeleted(): void { this.reservasResource.reload(); this.selectedEvent.set(null); }
  onCleared(): void { this.selectedEvent.set(null); }

  readonly filteredEvents = computed(() => {
    const events = this.reservasResource.value()?.events ?? [];
    const filter = this.typeFilter();
    if (filter === 'all') return events;
    return events.filter((e) => e.type === filter);
  });
}
