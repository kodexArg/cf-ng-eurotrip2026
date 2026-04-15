import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MapsLinkButton } from './maps-link-button';

/**
 * Renders a single origin-or-destination row with icon, time, label, city and optional maps link.
 *
 * @remarks
 * Input variants:
 * - `icon` (required): PrimeIcons CSS class for the leading icon (e.g. `'pi pi-arrow-up-right'`).
 * - `time` (optional): wall-clock string in HH:MM format; renders `'—'` when absent.
 * - `label` (required): human-readable station / airport / POI name.
 * - `city` (optional): resolved city name shown below the label row.
 * - `mapsUrl` (optional): Google Maps URL; renders `MapsLinkButton` when provided.
 * - `variant` (optional, default `'origin'`): semantic hint — `'origin'` or `'destination'`.
 */
@Component({
  selector: 'app-location-row',
  standalone: true,
  imports: [MapsLinkButton],
  template: `
    <div class="flex items-start gap-2">
      <span
        [class]="icon() + ' text-xs mt-0.5 shrink-0'"
        style="color: var(--p-surface-500)"
      ></span>
      <div class="flex-1 min-w-0">
        <div class="text-sm" style="color: var(--p-surface-800)">
          <span class="font-medium">{{ time() || '—' }}</span>
          <span class="mx-1" style="color: var(--p-surface-400)">·</span>
          <span>{{ label() }}</span>
        </div>
        @if (city()) {
          <div class="text-xs" style="color: var(--p-surface-500)">{{ city() }}</div>
        }
      </div>
      @if (mapsUrl(); as url) {
        <app-maps-link-button [url]="url" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationRow {
  readonly icon = input.required<string>();
  readonly time = input<string | undefined>(undefined);
  readonly label = input.required<string>();
  readonly city = input<string | undefined>(undefined);
  readonly mapsUrl = input<string | undefined>(undefined);
  readonly variant = input<'origin' | 'destination'>('origin');
}
