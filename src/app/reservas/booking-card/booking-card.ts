import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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

interface LocationPoint {
  label: string;       // human-readable (station / airport / POI / accommodation)
  cityName?: string;   // resolved city name when available
  time?: string;       // HH:MM when the event has a wall-clock
  lat?: number;
  lon?: number;
}

interface TrasladoView {
  origin: LocationPoint;
  destination: LocationPoint;
  durationLabel: string | null;
  service: string;                // "Ryanair FR28", "Eurostar 9001", etc.
  fare: string | null;
}

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [DatePipe, ConfirmedBadge, BookingTypeChip, Tooltip],
  template: `
    <div class="flex flex-col py-3 px-4 rounded-lg border" style="border-color: var(--p-surface-200)">
      <!-- Header: chip + badges -->
      <div class="flex items-center justify-between mb-2">
        <app-booking-type-chip [type]="event().type" />
        <div class="flex items-center gap-1">
          @if (event().usd) {
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

      <!-- Content -->
      <div class="min-w-0">
        @if (trasladoView(); as t) {
          <!-- Title: company + vehicle -->
          <div class="text-sm font-semibold select-none" style="color: var(--p-surface-900)">
            {{ t.service }}
          </div>

          <!-- Date -->
          <div class="text-xs mt-0.5 select-none" style="color: var(--p-surface-500)">
            {{ event().date | date:'EEE d MMM' }}
            @if (t.durationLabel) { · {{ t.durationLabel }} }
            @if (t.fare) { · {{ t.fare }} }
          </div>

          <!-- Origin row -->
          <div class="mt-2 flex items-start gap-2">
            <span class="pi pi-arrow-up-right text-xs mt-0.5 shrink-0" style="color: var(--p-surface-500)"></span>
            <div class="flex-1 min-w-0">
              <div class="text-sm" style="color: var(--p-surface-800)">
                <span class="font-medium">{{ t.origin.time || '—' }}</span>
                <span class="mx-1" style="color: var(--p-surface-400)">·</span>
                <span>{{ t.origin.label }}</span>
              </div>
              @if (t.origin.cityName) {
                <div class="text-xs" style="color: var(--p-surface-500)">{{ t.origin.cityName }}</div>
              }
            </div>
            @if (mapsUrl(t.origin); as url) {
              <a
                [href]="url"
                target="_blank"
                rel="noopener noreferrer"
                class="pi pi-map-marker text-sm shrink-0 no-underline hover:opacity-80"
                style="color: var(--p-primary-color)"
                [pTooltip]="'Abrir en Google Maps'"
                tooltipPosition="left"
                [showDelay]="300"
              ></a>
            }
          </div>

          <!-- Destination row -->
          <div class="mt-1 flex items-start gap-2">
            <span class="pi pi-arrow-down-right text-xs mt-0.5 shrink-0" style="color: var(--p-surface-500)"></span>
            <div class="flex-1 min-w-0">
              <div class="text-sm" style="color: var(--p-surface-800)">
                <span class="font-medium">{{ t.destination.time || '—' }}</span>
                <span class="mx-1" style="color: var(--p-surface-400)">·</span>
                <span>{{ t.destination.label }}</span>
              </div>
              @if (t.destination.cityName) {
                <div class="text-xs" style="color: var(--p-surface-500)">{{ t.destination.cityName }}</div>
              }
            </div>
            @if (mapsUrl(t.destination); as url) {
              <a
                [href]="url"
                target="_blank"
                rel="noopener noreferrer"
                class="pi pi-map-marker text-sm shrink-0 no-underline hover:opacity-80"
                style="color: var(--p-primary-color)"
                [pTooltip]="'Abrir en Google Maps'"
                tooltipPosition="left"
                [showDelay]="300"
              ></a>
            }
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
              <a
                [href]="url"
                target="_blank"
                rel="noopener noreferrer"
                class="pi pi-map-marker text-sm shrink-0 mt-1 no-underline hover:opacity-80"
                style="color: var(--p-primary-color)"
                [pTooltip]="'Abrir en Google Maps'"
                tooltipPosition="left"
                [showDelay]="300"
              ></a>
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
              <a
                [href]="url"
                target="_blank"
                rel="noopener noreferrer"
                class="pi pi-map-marker text-sm shrink-0 mt-1 no-underline hover:opacity-80"
                style="color: var(--p-primary-color)"
                [pTooltip]="'Abrir en Google Maps'"
                tooltipPosition="left"
                [showDelay]="300"
              ></a>
            }
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingCard {
  readonly event = input.required<TripEvent>();
  readonly cities = input<readonly City[]>([]);

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
