import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import {
  TripEvent,
  TrasladoEvent,
  EstadiaEvent,
  HitoEvent,
  isTraslado,
  isEstadia,
  isHito,
  timeOf,
} from '../../shared/models/event.model';
import { City } from '../../shared/models/city.model';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';
import { BookingTypeChip } from '../booking-type-chip/booking-type-chip';
import { LocationRow } from './parts/location-row';
import { MapsLinkButton } from './parts/maps-link-button';

interface LocationPoint {
  label: string;
  cityName?: string;
  time?: string;
  lat?: number;
  lon?: number;
}

interface TrasladoView {
  origin: LocationPoint;
  destination: LocationPoint;
  durationLabel: string | null;
  service: string;
  fare: string | null;
}

/**
 * Booking card displaying a single trip event (traslado, estadia, or hito).
 *
 * @remarks
 * Input variants:
 * - `event` (required): the `TripEvent` to display.
 * - `cities` (optional, default `[]`): city list used to resolve city names from IDs.
 * - `showPrice` (optional, default `false`): shows a price indicator icon when `event.usd` is set.
 * - `selectable` (optional, default `false`): renders a vertical selection toggle on the left edge.
 * - `selected` (optional, default `false`): highlights the card when `selectable` is true.
 */
@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [DatePipe, ConfirmedBadge, BookingTypeChip, Tooltip, LocationRow, MapsLinkButton],
  template: `
    <div class="flex rounded-lg">
      @if (selectable()) {
        <button
          type="button"
          class="w-6 shrink-0 flex items-center justify-center rounded-l-lg border border-r-0 cursor-pointer transition-colors"
          [style]="selected()
            ? 'background: var(--p-primary-color); color: white; border-color: var(--p-primary-color)'
            : 'background: var(--p-surface-50); color: var(--p-surface-400); border-color: var(--p-surface-200)'"
          (click)="selectToggle.emit()"
        >
          <span class="text-[9px] font-medium tracking-widest select-none"
                style="writing-mode: vertical-rl; transform: rotate(180deg)">
            Seleccionar
          </span>
        </button>
      }
      <div
        class="flex flex-col py-3 px-4 flex-1 border"
        [class.rounded-lg]="!selectable()"
        [class.rounded-r-lg]="selectable()"
        [style]="selected()
          ? 'border-color: var(--p-primary-color)'
          : 'border-color: var(--p-surface-200)'"
      >
      <div class="flex items-center justify-between mb-2">
        <app-booking-type-chip [type]="event().type" />
        <div class="flex items-center gap-1">
          @if (showPrice() && event().usd) {
            <i
              class="pi pi-dollar text-xs"
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
      </div>

      <div class="min-w-0">
        @if (trasladoView(); as t) {
          <div class="text-sm font-semibold select-none" style="color: var(--p-surface-900)">
            {{ t.service }}
          </div>

          <div class="text-xs mt-0.5 select-none" style="color: var(--p-surface-500)">
            {{ event().date | date:'EEE d MMM' }}
            @if (t.durationLabel) { · {{ t.durationLabel }} }
            @if (t.fare) { · {{ t.fare }} }
          </div>

          <div class="mt-2">
            <app-location-row
              icon="pi pi-arrow-up-right"
              [time]="t.origin.time"
              [label]="t.origin.label"
              [city]="t.origin.cityName"
              [mapsUrl]="mapsUrl(t.origin) ?? undefined"
              variant="origin"
            />
          </div>

          <div class="mt-1">
            <app-location-row
              icon="pi pi-arrow-down-right"
              [time]="t.destination.time"
              [label]="t.destination.label"
              [city]="t.destination.cityName"
              [mapsUrl]="mapsUrl(t.destination) ?? undefined"
              variant="destination"
            />
          </div>
        } @else if (estadia(); as s) {
          <div class="flex items-start gap-2">
            <div class="flex-1 min-w-0">
              <div class="text-base font-bold select-none" style="color: var(--p-surface-900)">
                {{ s.accommodation || s.title }}
              </div>
              @if (s.accommodation && s.title && s.title !== s.accommodation) {
                <div class="text-sm" style="color: var(--p-surface-700)">{{ s.title }}</div>
              }
              @if (s.address) {
                <div class="text-xs mt-0.5" style="color: var(--p-surface-600)">{{ s.address }}</div>
              }
              @if (cityNameOf(s.cityIn); as cname) {
                <div class="text-xs" style="color: var(--p-surface-500)">{{ cname }}</div>
              }
              <div class="text-xs mt-1 select-none" style="color: var(--p-surface-500)">
                {{ s.date | date:'EEE d MMM' }}
                @if (s.timestampOut) { → {{ s.timestampOut | date:'EEE d MMM' }} }
              </div>
              @if (s.platform) {
                <div class="text-xs mt-0.5" style="color: var(--p-surface-500)">
                  {{ s.platform }}@if (s.bookingRef) { · {{ s.bookingRef }} }
                </div>
              }
            </div>
            @if (mapsUrlFor(s.originLat, s.originLon, s.accommodation || s.title); as url) {
              <app-maps-link-button [url]="url" class="mt-1" />
            }
          </div>
        } @else if (hito(); as h) {
          <div class="flex items-start gap-2">
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold select-none" style="color: var(--p-surface-800)">{{ h.title }}</div>
              @if (h.description) {
                <div class="text-xs mt-0.5" style="color: var(--p-surface-600)">{{ h.description }}</div>
              }
              @if (cityNameOf(h.cityIn); as cname) {
                <div class="text-xs" style="color: var(--p-surface-500)">{{ cname }}</div>
              }
              <div class="text-xs mt-1 select-none" style="color: var(--p-surface-500)">
                {{ h.date | date:'EEE d MMM' }}
                @if (h.timestampIn) { · {{ timeOf(h.timestampIn) }}h }
              </div>
            </div>
            @if (mapsUrlFor(h.originLat, h.originLon, h.title); as url) {
              <app-maps-link-button [url]="url" class="mt-1" />
            }
          </div>
        }
      </div>
    </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingCard {
  readonly event = input.required<TripEvent>();
  readonly cities = input<readonly City[]>([]);
  readonly showPrice = input(false);
  readonly selectable = input(false);
  readonly selected = input(false);
  readonly selectToggle = output<void>();

  readonly timeOf = timeOf;

  private readonly cityNameMap = computed(
    () => new Map(this.cities().map((c) => [c.id, c.name])),
  );

  cityNameOf(id: string | null | undefined): string | null {
    if (!id) return null;
    return this.cityNameMap().get(id) ?? null;
  }

  readonly traslado = computed<TrasladoEvent | null>(() => {
    const e = this.event();
    return isTraslado(e) ? e : null;
  });

  readonly estadia = computed<EstadiaEvent | null>(() => {
    const e = this.event();
    return isEstadia(e) ? e : null;
  });

  readonly hito = computed<HitoEvent | null>(() => {
    const e = this.event();
    return isHito(e) ? e : null;
  });

  readonly trasladoView = computed<TrasladoView | null>(() => {
    const t = this.traslado();
    if (!t) return null;

    const originCity = this.cityNameOf(t.cityOut);
    const destCity = this.cityNameOf(t.cityIn);

    const origin: LocationPoint = {
      label: t.originLabel ?? originCity ?? (t.cityOut ? t.cityOut.toUpperCase() : '—'),
      cityName: originCity ?? undefined,
      time: t.timestampIn ? timeOf(t.timestampIn) : undefined,
      lat: t.originLat,
      lon: t.originLon,
    };

    const destination: LocationPoint = {
      label: t.destinationLabel ?? destCity ?? (t.cityIn ? t.cityIn.toUpperCase() : '—'),
      cityName: destCity ?? undefined,
      time: t.timestampOut ? timeOf(t.timestampOut) : undefined,
      lat: t.destinationLat,
      lon: t.destinationLon,
    };

    const service = [t.company, t.vehicleCode].filter(Boolean).join(' ').trim() || t.title;

    return {
      origin,
      destination,
      durationLabel: formatDuration(t.durationMin),
      service,
      fare: t.fare,
    };
  });

  mapsUrl(point: LocationPoint): string | null {
    return mapsUrlFor(point.lat, point.lon, point.label);
  }

  mapsUrlFor(lat: number | undefined, lon: number | undefined, label?: string): string | null {
    return mapsUrlFor(lat, lon, label);
  }
}

function mapsUrlFor(lat: number | undefined, lon: number | undefined, _label?: string): string | null {
  if (lat == null || lon == null) return null;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}

function formatDuration(min: number | null): string | null {
  if (min == null || min <= 0) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
