import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Booking } from '../../shared/models';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';
import { BookingTypeChip } from '../booking-type-chip/booking-type-chip';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [DatePipe, ConfirmedBadge, BookingTypeChip],
  template: `
    <div class="flex items-start gap-3 py-3 px-4 rounded-lg border" style="border-color: var(--p-surface-200)">
      <app-booking-type-chip [type]="booking().type" />
      <div class="flex-1 min-w-0">
        @if (booking().type === 'viaje') {
          <div class="text-sm font-semibold" style="color: var(--p-surface-800)">
            {{ booking().origin }} → {{ booking().destination }}
          </div>
          <div class="text-xs mt-0.5" style="color: var(--p-surface-600)">{{ booking().description }}</div>
          <div class="text-xs mt-0.5" style="color: var(--p-surface-500)">
            {{ booking().sortDate | date:'EEE d MMM' }}
            @if (booking().time) { · {{ booking().time }}h }
            @if (booking().carrier) { · {{ booking().carrier }} }
          </div>
        } @else if (booking().type === 'hospedaje') {
          <div class="text-base font-bold" style="color: var(--p-surface-900)">
            {{ booking().accommodation || booking().description }}
          </div>
          @if (booking().accommodation && booking().description !== booking().accommodation) {
            <div class="text-sm" style="color: var(--p-surface-700)">{{ booking().description }}</div>
          }
          <div class="text-xs mt-1" style="color: var(--p-surface-500)">
            {{ booking().sortDate | date:'EEE d MMM' }}
            @if (booking().checkoutDate) { → {{ booking().checkoutDate | date:'EEE d MMM' }} }
          </div>
        } @else {
          <div class="text-sm font-semibold" style="color: var(--p-surface-800)">{{ booking().description }}</div>
          <div class="text-xs mt-1" style="color: var(--p-surface-500)">
            {{ booking().sortDate | date:'EEE d MMM' }}
            @if (booking().time) { · {{ booking().time }}h }
          </div>
        }
      </div>
      @if (booking().costUsd) {
        <span class="text-sm font-semibold" style="color: var(--p-surface-700)">US$ {{ booking().costUsd }}</span>
      }
      @if (booking().confirmed) {
        <app-confirmed-badge [editable]="editable()" (toggle)="toggleConfirmed.emit()" />
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
  readonly booking = input.required<Booking>();
  readonly editable = input(false);

  readonly edit = output<void>();
  readonly remove = output<void>();
  readonly toggleConfirmed = output<void>();
}
