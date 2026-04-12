import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { httpResource } from '@angular/common/http';
import { SelectButton } from 'primeng/selectbutton';
import { Button } from 'primeng/button';
import { Booking, BookingType } from '../shared/models';
import { AuthService } from '../shared/services/auth.service';
import { EditService, BookingPatch } from '../shared/services/edit.service';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';
import { BookingCard } from './booking-card/booking-card';
import { BookingDialog } from './booking-dialog/booking-dialog';

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
        <h1 class="text-2xl font-bold" style="color: var(--p-surface-800)">Reservas</h1>
        @if (auth.isOwner()) {
          <p-button label="Agregar" icon="pi pi-plus" size="small" (onClick)="bookingDialog().openCreate()" />
        }
      </div>

      <div class="mb-4">
        <p-selectbutton [options]="filterOptions" [(ngModel)]="typeFilter" optionLabel="label" optionValue="value" />
      </div>

      @if (bookingsResource.isLoading()) { <app-loading-state /> }
      @if (bookingsResource.error()) {
        <app-error-state message="No se pudieron cargar las reservas." (retry)="bookingsResource.reload()" />
      }

      @if (bookingsResource.value()) {
        @for (booking of filteredBookings(); track booking.id) {
          <div class="mb-2">
            <app-booking-card
              [booking]="booking"
              [editable]="auth.isOwner()"
              (edit)="openEdit(booking)"
              (remove)="deleteBooking(booking)"
              (toggleConfirmed)="toggleConfirmed(booking)"
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

  readonly bookingsResource = httpResource<Booking[]>(() => '/api/bookings');
  readonly bookingDialog = viewChild.required(BookingDialog);

  readonly typeFilter = signal<BookingType | 'all'>('all');

  readonly filterOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Hitos', value: 'hito' },
    { label: 'Viajes', value: 'viaje' },
    { label: 'Hospedaje', value: 'hospedaje' },
  ];

  readonly filteredBookings = computed(() => {
    const bookings = this.bookingsResource.value() ?? [];
    const filter = this.typeFilter();
    if (filter === 'all') return bookings;
    return bookings.filter((b) => b.type === filter);
  });

  openEdit(booking: Booking): void {
    this.bookingDialog().openEdit(booking);
  }

  onSaved(event: { id?: string; data: Record<string, unknown> }): void {
    if (event.id) {
      this.editService.patchBooking(event.id, event.data as BookingPatch).subscribe(() => {
        this.bookingsResource.reload();
      });
    } else {
      this.editService.createBooking(event.data as BookingPatch).subscribe(() => {
        this.bookingsResource.reload();
      });
    }
  }

  deleteBooking(booking: Booking): void {
    if (!confirm(`¿Eliminar "${booking.description}"?`)) return;
    this.editService.deleteBooking(booking.id).subscribe(() => {
      this.bookingsResource.reload();
    });
  }

  toggleConfirmed(booking: Booking): void {
    this.editService
      .patchBooking(booking.id, { confirmed: !booking.confirmed })
      .subscribe(() => {
        this.bookingsResource.reload();
      });
  }
}
