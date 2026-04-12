import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import { TripEvent, isTraslado, isEstadia, timeOf } from '../../shared/models/event.model';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';
import { BookingTypeChip } from '../booking-type-chip/booking-type-chip';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [DatePipe, ConfirmedBadge, BookingTypeChip, Tooltip],
  template: `
    <div class="flex items-start gap-3 py-3 px-4 rounded-lg border" style="border-color: var(--p-surface-200)">
      <app-booking-type-chip [type]="booking().type" />
      <div class="flex-1 min-w-0">
        @if (isTraslado(booking())) {
          <div class="text-sm font-semibold select-none" style="color: var(--p-surface-800)">
            {{ booking().cityIn }} → {{ booking().cityOut }}
          </div>
          <div class="text-xs mt-0.5" style="color: var(--p-surface-600)">{{ booking().title }}</div>
          <div class="text-xs mt-0.5 select-none" style="color: var(--p-surface-500)">
            {{ booking().date | date:'EEE d MMM' }}
            @if (booking().timestampIn) { · {{ timeOf(booking().timestampIn) }}h }
            @if (asTraslado().company) { · {{ asTraslado().company }} }
          </div>
        } @else if (isEstadia(booking())) {
          <div class="text-base font-bold select-none" style="color: var(--p-surface-900)">
            {{ asEstadia().accommodation || booking().title }}
          </div>
          @if (asEstadia().accommodation && booking().title !== asEstadia().accommodation) {
            <div class="text-sm" style="color: var(--p-surface-700)">{{ booking().title }}</div>
          }
          <div class="text-xs mt-1 select-none" style="color: var(--p-surface-500)">
            {{ booking().date | date:'EEE d MMM' }}
            @if (booking().timestampOut) { → {{ booking().timestampOut | date:'EEE d MMM' }} }
          </div>
        } @else {
          <div class="text-sm font-semibold select-none" style="color: var(--p-surface-800)">{{ booking().title }}</div>
          <div class="text-xs mt-1 select-none" style="color: var(--p-surface-500)">
            {{ booking().date | date:'EEE d MMM' }}
            @if (booking().timestampIn) { · {{ timeOf(booking().timestampIn) }}h }
          </div>
        }
      </div>
      @if (booking().confirmed) {
        <app-confirmed-badge [editable]="editable()" (toggle)="toggleConfirmed.emit()" />
      }
      @if (booking().usd) {
        <i
          class="pi pi-dollar text-xs ml-1"
          style="color: var(--p-surface-400)"
          [pTooltip]="'Precio: $' + booking().usd + ' USD'"
          tooltipPosition="top"
          [showDelay]="300"
        ></i>
      }
      @if (editable()) {
        <div class="flex gap-1">
          <button class="text-xs opacity-40 hover:opacity-100 transition-opacity" (click)="edit.emit()">
            <i class="pi pi-pencil"></i>
          </button>
          <button class="text-xs opacity-40 hover:opacity-100 transition-opacity text-red-400" (click)="remove.emit()">
            <i class="pi pi-trash"></i>
          </button>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingCard {
  readonly booking = input.required<TripEvent>();
  readonly editable = input(false);

  readonly edit = output<void>();
  readonly remove = output<void>();
  readonly toggleConfirmed = output<void>();

  readonly isTraslado = isTraslado;
  readonly isEstadia = isEstadia;
  readonly timeOf = timeOf;

  asTraslado() {
    return this.booking() as import('../../shared/models/event.model').TrasladoEvent;
  }

  asEstadia() {
    return this.booking() as import('../../shared/models/event.model').EstadiaEvent;
  }
}
