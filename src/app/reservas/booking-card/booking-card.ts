import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import {
  TripEvent,
  TrasladoEvent,
  EstadiaEvent,
  HitoEvent,
  isTraslado,
  isEstadia,
  isHito,
} from '../../shared/models/event.model';
import { City } from '../../shared/models/city.model';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';
import { MandatoryBadge } from '../../shared/mandatory-badge/mandatory-badge';
import { BookingTypeChip } from '../booking-type-chip/booking-type-chip';
import { TrasladoBody } from './parts/traslado-body';
import { EstadiaBody } from './parts/estadia-body';
import { HitoBody } from './parts/hito-body';
import { AppIcon } from '../../shared/icon/icon';
import { resolveEventColor, resolveEventIcon } from '../../shared/transport-icon';

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
  imports: [ConfirmedBadge, MandatoryBadge, BookingTypeChip, Tooltip, TrasladoBody, EstadiaBody, HitoBody, AppIcon],
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
            @if (headerIcon()) {
              <app-icon
                [icon]="headerIcon()!"
                size="1.125rem"
                [color]="headerIconColor()"
                extraClass="shrink-0"
              />
            }
            @if (showPrice() && event().usd != null && event().usd! > 0) {
              <i
                class="pi pi-dollar text-xs"
                style="color: var(--p-surface-400)"
                [pTooltip]="'Precio: $' + event().usd + ' USD'"
                tooltipPosition="top"
                [showDelay]="300"
              ></i>
            } @else if (showPrice() && event().usd === 0) {
              <span
                class="uppercase tracking-wide"
                style="font-size: 9px; color: var(--p-surface-400); letter-spacing: 0.05em"
                pTooltip="Gratis"
                tooltipPosition="top"
                [showDelay]="300"
              >gratis</span>
            }
            @if (event().confirmed) {
              <app-confirmed-badge />
            } @else if (event().mandatory) {
              <app-mandatory-badge />
            }
          </div>
        </div>

        <div class="min-w-0">
          @if (traslado(); as t) {
            <app-traslado-body [event]="t" [cityNameOf]="cityNameOf" />
          } @else if (estadia(); as s) {
            <app-estadia-body [event]="s" [cityNameOf]="cityNameOf" />
          } @else if (hito(); as h) {
            <app-hito-body [event]="h" [cityNameOf]="cityNameOf" />
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

  private readonly cityNameMap = computed(
    () => new Map(this.cities().map((c) => [c.id, c.name])),
  );

  readonly cityNameOf = (id: string | null | undefined): string | null => {
    if (!id) return null;
    return this.cityNameMap().get(id) ?? null;
  };

  readonly headerIcon = computed<string | null>(() => {
    const icon = resolveEventIcon(this.event());
    return icon !== 'ms-directions_transit' ? icon : null;
  });

  readonly headerIconColor = computed<string>(() => resolveEventColor(this.event()));

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
}
