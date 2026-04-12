import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import {
  TripEvent,
  TrasladoEvent,
  EstadiaEvent,
  isTraslado,
  isEstadia,
  timeOf,
} from '../../shared/models/event.model';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';
import { BookingTypeChip } from '../booking-type-chip/booking-type-chip';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [DatePipe, ConfirmedBadge, BookingTypeChip, Tooltip],
  template: `
    <div class="flex items-start gap-3 py-3 px-4 rounded-lg border" style="border-color: var(--p-surface-200)">
      <app-booking-type-chip [type]="event().type" />
      <div class="flex-1 min-w-0">
        @if (traslado(); as t) {
          <div class="text-sm font-semibold select-none" style="color: var(--p-surface-800)">
            {{ t.cityIn }} → {{ t.cityOut }}
          </div>
          <div class="text-xs mt-0.5" style="color: var(--p-surface-600)">{{ t.title }}</div>
          <div class="text-xs mt-0.5 select-none" style="color: var(--p-surface-500)">
            {{ t.date | date:'EEE d MMM' }}
            @if (t.timestampIn) { · {{ timeOf(t.timestampIn) }}h }
            @if (t.company) { · {{ t.company }} }
          </div>
        } @else if (estadia(); as s) {
          <div class="text-base font-bold select-none" style="color: var(--p-surface-900)">
            {{ s.accommodation || s.title }}
          </div>
          @if (s.accommodation && s.title !== s.accommodation) {
            <div class="text-sm" style="color: var(--p-surface-700)">{{ s.title }}</div>
          }
          <div class="text-xs mt-1 select-none" style="color: var(--p-surface-500)">
            {{ s.date | date:'EEE d MMM' }}
            @if (s.timestampOut) { → {{ s.timestampOut | date:'EEE d MMM' }} }
          </div>
        } @else {
          <div class="text-sm font-semibold select-none" style="color: var(--p-surface-800)">{{ event().title }}</div>
          <div class="text-xs mt-1 select-none" style="color: var(--p-surface-500)">
            {{ event().date | date:'EEE d MMM' }}
            @if (event().timestampIn) { · {{ timeOf(event().timestampIn) }}h }
          </div>
        }
      </div>
      @if (event().usd) {
        <i
          class="pi pi-dollar text-xs ml-1"
          style="color: var(--p-surface-400)"
          [pTooltip]="'Precio: $' + event().usd + ' USD'"
          tooltipPosition="top"
          [showDelay]="300"
        ></i>
      }
      @if (event().confirmed) {
        <app-confirmed-badge />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingCard {
  readonly event = input.required<TripEvent>();

  readonly traslado = computed<TrasladoEvent | null>(() => {
    const e = this.event();
    return isTraslado(e) ? e : null;
  });

  readonly estadia = computed<EstadiaEvent | null>(() => {
    const e = this.event();
    return isEstadia(e) ? e : null;
  });

  readonly timeOf = timeOf;
}
