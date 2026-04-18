import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { httpResource } from '@angular/common/http';
import { SelectButton } from 'primeng/selectbutton';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { TripEvent, EventType } from '../shared/models/event.model';
import { City } from '../shared/models/city.model';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';
import { BookingCard } from './booking-card/booking-card';
import { DIALOG_WIDTH, DIALOG_MAX_WIDTH, DIALOG_MAX_HEIGHT_VH } from '../shared/theme/spacing';
import { AppIcon } from '../shared/icon/icon';

type FilterValue = EventType | 'all';
type CityFilterValue = string | 'all';
type ConfirmedFilterValue = 'all' | 'confirmed' | 'unconfirmed';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [FormsModule, SelectButton, Dialog, Button, LoadingState, ErrorState, BookingCard, AppIcon],
  template: `
    <div class="max-w-2xl mx-auto p-4">
      <h1 class="text-2xl font-bold select-none mb-4" style="color: var(--p-surface-800)">Reservas</h1>

      <div class="flex items-center gap-2 mb-4">
        <p-selectbutton [options]="filterOptions" [(ngModel)]="typeFilter" optionLabel="label" optionValue="value" />
        <span class="ms-auto">
          <p-button
            icon="pi pi-sliders-h"
            severity="secondary"
            [rounded]="true"
            aria-label="Filtros avanzados"
            (onClick)="filtersDialogVisible.set(true)"
          />
        </span>
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

    <p-dialog
      [visible]="filtersDialogVisible()"
      (visibleChange)="filtersDialogVisible.set($event)"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [dismissableMask]="true"
      [closable]="true"
      [style]="dialogStyle"
    >
      <ng-template pTemplate="header" let-ariaLabelledBy="ariaLabelledBy">
        <span [id]="ariaLabelledBy" class="p-dialog-title">Filtros</span>
        <button type="button"
                class="p-dialog-header-icon p-link"
                aria-label="Limpiar filtros"
                title="Limpiar filtros"
                (click)="clearFilters()">
          <app-icon icon="pi-filter-slash" />
        </button>
      </ng-template>
      <div class="flex flex-col gap-4 py-2">
        <div class="flex flex-col gap-1">
          <label class="text-xs" style="color: var(--p-surface-500);">Tipo</label>
          <p-selectbutton [options]="filterOptions" [(ngModel)]="typeFilter" optionLabel="label" optionValue="value" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs" style="color: var(--p-surface-500);">Ciudad</label>
          <p-selectbutton [options]="cityFilterOptions()" [(ngModel)]="cityFilter" optionLabel="label" optionValue="value" styleClass="filter-wrap" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs" style="color: var(--p-surface-500);">Estado</label>
          <p-selectbutton [options]="confirmedFilterOptions" [(ngModel)]="confirmedFilter" optionLabel="label" optionValue="value" />
        </div>
      </div>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservasPage {
  readonly reservasResource = httpResource<{ cities: City[]; events: TripEvent[] }>(() => '/api/reservas');

  readonly cities = computed<readonly City[]>(() => this.reservasResource.value()?.cities ?? []);

  readonly typeFilter = signal<FilterValue>('all');
  readonly cityFilter = signal<CityFilterValue>('all');
  readonly confirmedFilter = signal<ConfirmedFilterValue>('all');
  readonly filtersDialogVisible = signal<boolean>(false);

  readonly dialogStyle = { width: DIALOG_WIDTH, maxWidth: DIALOG_MAX_WIDTH, maxHeight: DIALOG_MAX_HEIGHT_VH };

  readonly filterOptions = [
    { label: 'Todos',     value: 'all' as FilterValue },
    { label: 'Hitos',     value: 'hito' as FilterValue },
    { label: 'Viajes',    value: 'traslado' as FilterValue },
    { label: 'Hospedaje', value: 'estadia' as FilterValue },
  ];

  readonly confirmedFilterOptions = [
    { label: 'Todos',          value: 'all' as ConfirmedFilterValue },
    { label: 'Confirmados',    value: 'confirmed' as ConfirmedFilterValue },
    { label: 'No confirmados', value: 'unconfirmed' as ConfirmedFilterValue },
  ];

  readonly cityFilterOptions = computed(() => [
    { label: 'Todas', value: 'all' as CityFilterValue },
    ...this.cities().map(c => ({ label: c.name, value: c.id as CityFilterValue })),
  ]);

  clearFilters(): void {
    this.typeFilter.set('all');
    this.cityFilter.set('all');
    this.confirmedFilter.set('all');
  }

  readonly filteredEvents = computed(() => {
    const events = this.reservasResource.value()?.events ?? [];
    const typeFilter = this.typeFilter();
    const cityFilter = this.cityFilter();
    const confirmedFilter = this.confirmedFilter();

    return events.filter(e => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      if (cityFilter !== 'all' && e.cityIn !== cityFilter) return false;
      if (confirmedFilter === 'confirmed' && !e.confirmed) return false;
      if (confirmedFilter === 'unconfirmed' && e.confirmed) return false;
      return true;
    });
  });
}
