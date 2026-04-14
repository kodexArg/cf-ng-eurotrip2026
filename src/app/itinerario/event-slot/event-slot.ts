import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { City, TripEvent, isEstadia, isHito, isTraslado, timeOf } from '../../shared/models';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';
import { InfoRow } from '../info-row/info-row';

/**
 * Unified slot for rendering one row of any TripEvent type.
 * Branches on `event.type` to compose the right copy. All three
 * variants share the base InfoRow visual.
 *
 * In `compact` mode (used by the vertical stripe between cities)
 * the slot drops extra padding and decoration.
 */
@Component({
  selector: 'app-event-slot',
  imports: [InfoRow, ConfirmedBadge],
  template: `
    @switch (event().type) {
      @case ('hito') {
        @if (asHito(); as h) {
          <app-info-row
            [icon]="h.icon"
            [iconColor]="iconColor()"
            [text]="h.title"
            [class.opacity-60]="!h.confirmed"
          >
            @if (h.cardId) {
              <button
                type="button"
                class="pi pi-lightbulb text-xs opacity-60 hover:opacity-100 transition-opacity ml-1 bg-transparent border-none cursor-pointer"
                style="height: 1.25rem; color: var(--p-primary-color)"
                (click)="openInfo.emit()"
                title="Ver informacion del sitio"
              ></button>
            }
            @if (h.confirmed) {
              <app-confirmed-badge />
            }
          </app-info-row>
        }
      }
      @case ('traslado') {
        @if (asTraslado(); as t) {
          @if (showPartida()) {
            <app-info-row
              [icon]="trasladoPartidaIcon()"
              [iconColor]="iconColor()"
              [text]="trasladoPartidaText()"
              [class.opacity-60]="!t.confirmed"
            >
              @if (t.confirmed && t.renderMode === 'partida') {
                <app-confirmed-badge />
              }
            </app-info-row>
          }
          @if (showArribo()) {
            <app-info-row
              [icon]="trasladoArriboIcon()"
              [iconColor]="iconColor()"
              [text]="trasladoArriboText()"
              [class.opacity-60]="!t.confirmed"
            >
              @if (t.confirmed) {
                <app-confirmed-badge />
              }
            </app-info-row>
          }
        }
      }
      @case ('estadia') {
        @if (asEstadia(); as s) {
          <app-info-row
            [icon]="s.icon"
            [iconColor]="iconColor()"
            [text]="stayText()"
            [class.opacity-60]="!s.confirmed"
          >
            @if (s.confirmed) {
              <app-confirmed-badge />
            }
          </app-info-row>
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSlot {
  readonly event = input.required<TripEvent>();
  readonly cities = input<readonly City[]>([]);
  /** When set to 'checkout', estadía rows render as check-out instead of check-in. */
  readonly stayMode = input<'checkin' | 'checkout'>('checkin');
  readonly compact = input(false);

  readonly openInfo = output<void>();

  protected readonly asHito = computed(() => {
    const e = this.event();
    return isHito(e) ? e : null;
  });

  protected readonly asTraslado = computed(() => {
    const e = this.event();
    return isTraslado(e) ? e : null;
  });

  protected readonly asEstadia = computed(() => {
    const e = this.event();
    return isEstadia(e) ? e : null;
  });

  protected readonly iconColor = computed(() => 'var(--p-surface-600)');

  // When the itinerary splits a cross-city traslado into two halves it
  // tags each with `renderMode`. An un-tagged traslado is intra-city and
  // still shows both rows.
  protected readonly showPartida = computed(() => {
    const m = this.asTraslado()?.renderMode;
    return m === 'partida' || m === undefined;
  });
  protected readonly showArribo = computed(() => {
    const m = this.asTraslado()?.renderMode;
    return m === 'arribo' || m === undefined;
  });

  private readonly cityNameMap = computed(() =>
    new Map(this.cities().map((c) => [c.id, c.name]))
  );

  private resolveCityName(id: string | null): string {
    if (!id) return '—';
    return this.cityNameMap().get(id) ?? id.toUpperCase();
  }

  protected readonly trasladoPartidaIcon = computed((): string => {
    const t = this.asTraslado();
    if (t?.subtype === 'flight') return 'ms-flight_takeoff';
    if (t?.subtype === 'train') return 'ms-train';
    return 'pi-sign-out';
  });

  protected readonly trasladoArriboIcon = computed((): string => {
    const t = this.asTraslado();
    if (t?.subtype === 'flight') return 'ms-flight_land';
    if (t?.subtype === 'train') return 'ms-train';
    return 'pi-sign-in';
  });

  protected readonly trasladoPartidaText = computed((): string => {
    const t = this.asTraslado();
    if (!t) return '';
    const origin = this.resolveCityName(t.cityOut);
    const departTime = timeOf(t.timestampIn);
    const company = t.company?.trim() || '—';
    const vehicle = t.vehicleCode?.trim() || '';
    const service = vehicle ? `${company} ${vehicle}` : company;
    const verb = t.subtype === 'flight' ? 'Despega desde' : 'Sale de';
    return `${verb} ${origin} a las ${departTime} por ${service}`;
  });

  protected readonly trasladoArriboText = computed((): string => {
    const t = this.asTraslado();
    if (!t) return '';
    const dest = this.resolveCityName(t.cityIn);
    if (!t.timestampOut) return `Destino ${dest}`;
    const arriveTime = timeOf(t.timestampOut);
    const verb = t.subtype === 'flight' ? 'Aterriza en' : 'Llega a';
    return `${verb} ${dest} a las ${arriveTime}`;
  });

  protected readonly stayText = computed((): string => {
    const s = this.asEstadia();
    if (!s) return '';
    if (this.stayMode() === 'checkout') {
      const t = s.checkoutTime ? ` · ${s.checkoutTime}` : '';
      return `Check-out: ${s.accommodation}${t}`;
    }
    const t = s.checkinTime ? ` · ${s.checkinTime}` : '';
    return `Check-in: ${s.accommodation}${t}`;
  });
}
