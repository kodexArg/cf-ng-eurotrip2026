import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EstadiaEvent } from '../../../shared/models/event.model';
import { MapsLinkButton } from './maps-link-button';

/**
 * Renders the body of an estadia (accommodation) booking card.
 *
 * @remarks
 * Input variants:
 * - `event` (required): the `EstadiaEvent` to display.
 * - `cityNameOf` (required): function that resolves a city ID to a display name or null.
 */
@Component({
  selector: 'app-estadia-body',
  standalone: true,
  imports: [DatePipe, MapsLinkButton],
  template: `
    <div class="flex items-start gap-2">
      <div class="flex-1 min-w-0">
        <div class="text-base font-bold select-none" style="color: var(--p-surface-900)">
          {{ event().accommodation || event().title }}
        </div>
        @if (event().accommodation && event().title && event().title !== event().accommodation) {
          <div class="text-sm" style="color: var(--p-surface-700)">{{ event().title }}</div>
        }
        @if (event().address) {
          <div class="text-xs mt-0.5" style="color: var(--p-surface-600)">{{ event().address }}</div>
        }
        @if (cityNameOf()(event().cityIn); as cname) {
          <div class="text-xs" style="color: var(--p-surface-500)">{{ cname }}</div>
        }
        <div class="text-xs mt-1 select-none" style="color: var(--p-surface-500)">
          {{ event().date | date:'EEE d MMM' }}
          @if (event().timestampOut) { → {{ event().timestampOut | date:'EEE d MMM' }} }
        </div>
        @if (event().platform) {
          <div class="text-xs mt-0.5" style="color: var(--p-surface-500)">
            {{ event().platform }}@if (event().bookingRef) { · {{ event().bookingRef }} }
          </div>
        }
      </div>
      @if (mapsUrl(); as url) {
        <app-maps-link-button [url]="url" class="mt-1" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadiaBody {
  readonly event = input.required<EstadiaEvent>();
  readonly cityNameOf = input.required<(id: string | null | undefined) => string | null>();

  mapsUrl(): string | null {
    const s = this.event();
    if (s.originLat == null || s.originLon == null) return null;
    return `https://www.google.com/maps/search/?api=1&query=${s.originLat},${s.originLon}`;
  }
}
