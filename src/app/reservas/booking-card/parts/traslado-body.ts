import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TrasladoEvent, timeOf } from '../../../shared/models/event.model';
import { LocationRow } from './location-row';

interface LocationPoint {
  label: string;
  cityName?: string;
  time?: string;
  lat?: number;
  lon?: number;
}

/**
 * Renders the body of a traslado booking card.
 *
 * @remarks
 * Input variants:
 * - `event` (required): the `TrasladoEvent` to display.
 * - `cityNameOf` (required): function that resolves a city ID to a display name or null.
 */
@Component({
  selector: 'app-traslado-body',
  standalone: true,
  imports: [DatePipe, LocationRow],
  template: `
    <div class="text-sm font-semibold select-none" style="color: var(--p-surface-900)">
      {{ service() }}
    </div>

    <div class="text-xs mt-0.5 select-none" style="color: var(--p-surface-500)">
      {{ event().date | date:'EEE d MMM' }}
      @if (durationLabel()) { · {{ durationLabel() }} }
      @if (event().fare) { · {{ event().fare }} }
    </div>

    <div class="mt-2">
      <app-location-row
        icon="pi pi-arrow-up-right"
        [time]="origin().time"
        [label]="origin().label"
        [city]="origin().cityName"
        [mapsUrl]="mapsUrl(origin()) ?? undefined"
        variant="origin"
      />
    </div>

    <div class="mt-1">
      <app-location-row
        icon="pi pi-arrow-down-right"
        [time]="destination().time"
        [label]="destination().label"
        [city]="destination().cityName"
        [mapsUrl]="mapsUrl(destination()) ?? undefined"
        variant="destination"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrasladoBody {
  readonly event = input.required<TrasladoEvent>();
  readonly cityNameOf = input.required<(id: string | null | undefined) => string | null>();

  readonly origin = computed<LocationPoint>(() => {
    const t = this.event();
    const cityName = this.cityNameOf()(t.cityOut) ?? undefined;
    return {
      label: t.originLabel ?? cityName ?? (t.cityOut ? t.cityOut.toUpperCase() : '—'),
      cityName,
      time: t.timestampIn ? timeOf(t.timestampIn) : undefined,
      lat: t.originLat,
      lon: t.originLon,
    };
  });

  readonly destination = computed<LocationPoint>(() => {
    const t = this.event();
    const cityName = this.cityNameOf()(t.cityIn) ?? undefined;
    return {
      label: t.destinationLabel ?? cityName ?? (t.cityIn ? t.cityIn.toUpperCase() : '—'),
      cityName,
      time: t.timestampOut ? timeOf(t.timestampOut) : undefined,
      lat: t.destinationLat,
      lon: t.destinationLon,
    };
  });

  readonly service = computed<string>(() => {
    const t = this.event();
    return [t.company, t.vehicleCode].filter(Boolean).join(' ').trim() || t.title;
  });

  readonly durationLabel = computed<string | null>(() => formatDuration(this.event().durationMin));

  mapsUrl(point: LocationPoint): string | null {
    if (point.lat == null || point.lon == null) return null;
    return `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lon}`;
  }
}

function formatDuration(min: number | null): string | null {
  if (min == null || min <= 0) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
