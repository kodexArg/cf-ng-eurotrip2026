import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { httpResource } from '@angular/common/http';
import { SelectButton } from 'primeng/selectbutton';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { TripEvent, EventType } from '../shared/models/event.model';
import { City } from '../shared/models/city.model';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';
import { BookingCard } from '../reservas/booking-card/booking-card';
import { AuthService } from '../shared/services/auth.service';
import { LoginPanel } from '../shared/login-panel/login-panel';
import { EventForm } from './event-form/event-form';
import {
  DIALOG_WIDTH,
  DIALOG_MAX_WIDTH,
  DIALOG_MAX_HEIGHT_VH,
} from '../shared/theme/spacing';

type FilterValue = EventType | 'all';

/**
 * Owner-only event management page for creating, editing, and deleting trip events.
 *
 * @remarks
 * Guarded by AuthService; shows LoginPanel when the user is not the owner.
 * Clicking a BookingCard opens a modal dialog with EventForm for editing.
 * The "+" button opens the dialog in add-new mode (no event pre-selected).
 * On save or delete the resource is reloaded and the dialog is closed.
 */
@Component({
  selector: 'app-modificaciones',
  standalone: true,
  imports: [FormsModule, SelectButton, Dialog, Button, LoadingState, ErrorState, BookingCard, LoginPanel, EventForm],
  template: `
    @if (auth.isOwner()) {
      <div class="max-w-2xl mx-auto p-4">
        <h1 class="text-2xl font-bold select-none mb-4" style="color: var(--p-surface-800)">Modificaciones</h1>

        <div class="flex items-center gap-2 mb-4">
          <p-button
            icon="pi pi-plus"
            severity="secondary"
            [rounded]="true"
            aria-label="Agregar evento"
            (onClick)="onAddNew()"
          />
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
                [showPrice]="auth.isOwner()"
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

    <p-dialog
      [header]="addMode() ? 'Nuevo evento' : 'Modificar evento'"
      [visible]="dialogVisible()"
      (visibleChange)="dialogVisible.set($event)"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [dismissableMask]="true"
      [closable]="true"
      [style]="dialogStyle"
      (onHide)="onDialogHide()"
    >
      <app-event-form
        [event]="selectedEvent()"
        [cities]="cities()"
        (saved)="onSaved()"
        (deleted)="onDeleted()"
        (cleared)="onCleared()"
      />
    </p-dialog>
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
  readonly dialogVisible = signal<boolean>(false);
  readonly addMode = signal<boolean>(false);

  protected readonly dialogStyle = {
    width: DIALOG_WIDTH,
    maxWidth: DIALOG_MAX_WIDTH,
    maxHeight: DIALOG_MAX_HEIGHT_VH,
  };

  onSelectToggle(event: TripEvent): void {
    this.selectedEvent.set(event);
    this.addMode.set(false);
    this.dialogVisible.set(true);
  }

  onAddNew(): void {
    this.selectedEvent.set(null);
    this.addMode.set(true);
    this.dialogVisible.set(true);
  }

  onDialogHide(): void {
    this.selectedEvent.set(null);
    this.addMode.set(false);
  }

  onSaved(): void {
    this.reservasResource.reload();
    this.dialogVisible.set(false);
  }

  onDeleted(): void {
    this.reservasResource.reload();
    this.dialogVisible.set(false);
  }

  onCleared(): void {
    // cleared only resets form fields; dialog stays open
  }

  readonly filteredEvents = computed(() => {
    const events = this.reservasResource.value()?.events ?? [];
    const filter = this.typeFilter();
    if (filter === 'all') return events;
    return events.filter((e) => e.type === filter);
  });
}
