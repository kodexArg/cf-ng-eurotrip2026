import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { httpResource } from '@angular/common/http';
import { SelectButton } from 'primeng/selectbutton';
import { Button } from 'primeng/button';
import { TripEvent, EventType } from '../shared/models/event.model';
import { Booking } from '../shared/models';
import { AuthService } from '../shared/services/auth.service';
import { EditService, BookingPatch } from '../shared/services/edit.service';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';
import { BookingCard } from './booking-card/booking-card';
import { BookingDialog } from './booking-dialog/booking-dialog';

type FilterValue = EventType | 'all';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    FormsModule,
    SelectButton,
    Button,
    LoadingState,
    ErrorState,
    BookingCard,
    BookingDialog,
  ],
  template: `
    <div class="max-w-2xl mx-auto p-4">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold select-none" style="color: var(--p-surface-800)">Reservas</h1>
        @if (auth.isOwner()) {
          <p-button label="Agregar" icon="pi pi-plus" size="small" (onClick)="bookingDialog().openCreate()" />
        }
      </div>

      <div class="mb-4">
        <p-selectbutton [options]="filterOptions" [(ngModel)]="typeFilter" optionLabel="label" optionValue="value" />
      </div>

      @if (reservasResource.isLoading()) { <app-loading-state /> }
      @if (reservasResource.error()) {
        <app-error-state message="No se pudieron cargar las reservas." (retry)="reservasResource.reload()" />
      }

      @if (reservasResource.value()) {
        @for (event of filteredEvents(); track event.id) {
          <div class="mb-2">
            <app-booking-card
              [booking]="event"
              [editable]="auth.isOwner()"
              (edit)="openEdit(event)"
              (remove)="deleteEvent(event)"
              (toggleConfirmed)="toggleConfirmed(event)"
            />
          </div>
        } @empty {
          <p class="text-center text-sm py-8" style="color: var(--p-surface-400)">No hay reservas</p>
        }
      }

      <app-booking-dialog (saved)="onSaved($event)" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservasPage {
  readonly auth = inject(AuthService);
  private readonly editService = inject(EditService);

  readonly reservasResource = httpResource<{ events: TripEvent[] }>(() => '/api/reservas');
  readonly bookingDialog = viewChild.required(BookingDialog);

  readonly typeFilter = signal<FilterValue>('all');

  readonly filterOptions = [
    { label: 'Todos',     value: 'all' },
    { label: 'Hitos',     value: 'hito' },
    { label: 'Viajes',    value: 'traslado' },
    { label: 'Hospedaje', value: 'estadia' },
  ];

  readonly filteredEvents = computed(() => {
    const response = this.reservasResource.value();
    const events = response?.events ?? [];
    const filter = this.typeFilter();
    if (filter === 'all') return events;
    return events.filter((e) => e.type === filter);
  });

  openEdit(event: TripEvent): void {
    // BookingDialog still uses the legacy Booking shape — parallel worker owns cleanup.
    this.bookingDialog().openEdit(event as unknown as Booking);
  }

  onSaved(saved: { id?: string; data: Record<string, unknown> }): void {
    if (saved.id) {
      this.editService.patchBooking(saved.id, saved.data as BookingPatch).subscribe(() => {
        this.reservasResource.reload();
      });
    } else {
      this.editService.createBooking(saved.data as BookingPatch).subscribe(() => {
        this.reservasResource.reload();
      });
    }
  }

  deleteEvent(event: TripEvent): void {
    if (!confirm(`¿Eliminar "${event.title}"?`)) return;
    this.editService.deleteBooking(event.id).subscribe(() => {
      this.reservasResource.reload();
    });
  }

  toggleConfirmed(event: TripEvent): void {
    this.editService
      .patchBooking(event.id, { confirmed: !event.confirmed })
      .subscribe(() => {
        this.reservasResource.reload();
      });
  }
}
