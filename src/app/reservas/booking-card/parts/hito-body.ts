import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HitoEvent, timeOf } from '../../../shared/models/event.model';
import { MapsLinkButton } from './maps-link-button';

/**
 * Renders the body of a hito (milestone) booking card.
 *
 * @remarks
 * Input variants:
 * - `event` (required): the `HitoEvent` to display.
 * - `cityNameOf` (required): function that resolves a city ID to a display name or null.
 */
@Component({
  selector: 'app-hito-body',
  standalone: true,
  imports: [DatePipe, MapsLinkButton],
  template: `
    <div class="flex items-start gap-2">
      <div class="flex-1 min-w-0">
        <div class="text-sm font-semibold select-none" style="color: var(--p-surface-800)">{{ event().title }}</div>
        @if (event().description) {
          <div class="text-xs mt-0.5" style="color: var(--p-surface-600)">{{ event().description }}</div>
        }
        @if (cityNameOf()(event().cityIn); as cname) {
          <div class="text-xs" style="color: var(--p-surface-500)">{{ cname }}</div>
        }
        <div class="text-xs mt-1 select-none" style="color: var(--p-surface-500)">
          {{ event().date | date:'EEE d MMM' }}
          @if (event().timestampIn) { · {{ timeOf(event().timestampIn) }}h }
        </div>
      </div>
      @if (mapsUrl(); as url) {
        <app-maps-link-button [url]="url" class="mt-1" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HitoBody {
  readonly event = input.required<HitoEvent>();
  readonly cityNameOf = input.required<(id: string | null | undefined) => string | null>();

  readonly timeOf = timeOf;

  mapsUrl(): string | null {
    const h = this.event();
    if (h.originLat == null || h.originLon == null) return null;
    return `https://www.google.com/maps/search/?api=1&query=${h.originLat},${h.originLon}`;
  }
}
