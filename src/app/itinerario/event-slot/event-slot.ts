import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { City, TripEvent, isEstadia, isHito, isTraslado, timeOf } from '../../shared/models';
import { DoneBadge } from '../../shared/done-badge/done-badge';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';
import { MandatoryBadge } from '../../shared/mandatory-badge/mandatory-badge';
import { InfoRow } from '../info-row/info-row';
import { resolveEventColor, resolveEventIcon, transportIcon } from '../../shared/transport-icon';
import { ICON_GREYS } from '../../shared/theme/colors';
import { AppIcon } from '../../shared/icon/icon';

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
  imports: [InfoRow, DoneBadge, ConfirmedBadge, MandatoryBadge, AppIcon],
  template: `
    @switch (event().type) {
      @case ('hito') {
        @if (asHito(); as h) {
          <app-info-row
            [icon]="hitoIcon()"
            [iconColor]="iconColor()"
            [text]="h.title"
            [class.opacity-60]="!h.done && !h.mandatory"
          >
            @if (h.cardId) {
              <button
                type="button"
                class="opacity-60 hover:opacity-100 transition-opacity ml-1 bg-transparent border-none cursor-pointer flex items-center"
                style="height: 1.25rem; color: var(--p-primary-color)"
                (click)="openInfo.emit()"
                title="Ver informacion del sitio"
              >
                <app-icon icon="pi-lightbulb" size="0.85rem" />
              </button>
            }
            @if (h.done) {
              <app-done-badge />
            } @else if (h.mandatory) {
              <app-mandatory-badge />
            }
          </app-info-row>
        }
      }
      @case ('traslado') {
        @if (asTraslado(); as t) {
          @if (isIntraCity()) {
            <app-info-row
              [icon]="intraCityIcon()"
              [iconColor]="iconColor()"
              [text]="intraCityText()"
              [class.opacity-60]="!t.done && !t.mandatory"
            >
              @if (t.done) {
                <app-done-badge />
              } @else if (t.mandatory) {
                <app-mandatory-badge />
              }
            </app-info-row>
          } @else {
            @if (showPartida()) {
              <app-info-row
                [icon]="trasladoPartidaIcon()"
                [iconColor]="iconColor()"
                [text]="trasladoPartidaText()"
                [class.opacity-60]="!t.done && !t.mandatory"
              >
                @if (t.done && t.renderMode === 'partida') {
                  <app-done-badge />
                } @else if (t.mandatory && t.renderMode === 'partida') {
                  <app-mandatory-badge />
                }
              </app-info-row>
            }
            @if (showArribo()) {
              <app-info-row
                [icon]="trasladoArriboIcon()"
                [iconColor]="iconColor()"
                [text]="trasladoArriboText()"
                [class.opacity-60]="!t.done && !t.mandatory"
              >
                @if (t.done) {
                  <app-done-badge />
                } @else if (t.mandatory) {
                  <app-mandatory-badge />
                }
              </app-info-row>
            }
          }
        }
      }
      @case ('estadia') {
        @if (asEstadia(); as s) {
          <app-info-row
            [icon]="estadiaIcon()"
            [iconColor]="iconColor()"
            [text]="stayText()"
            [class.opacity-60]="!s.done && !s.mandatory"
          >
            @if (s.done) {
              <app-done-badge />
            } @else if (s.mandatory) {
              <app-mandatory-badge />
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

  protected readonly hitoIcon = computed((): string => {
    const h = this.asHito();
    return h ? resolveEventIcon({ icon: h.icon, subtype: h.subtype }) : '';
  });

  protected readonly estadiaIcon = computed((): string => {
    const s = this.asEstadia();
    return s ? resolveEventIcon({ icon: s.icon, subtype: s.subtype }) : '';
  });

  protected readonly iconColor = computed((): string => {
    const e = this.event();
    // Intra-city transit gets a distinct muted grey — this is a UI-level override
    // that doesn't belong in the icon registry (same transport subtype can appear
    // in both intra-city and cross-city contexts with different visual weight).
    if (e.type === 'traslado' && this.isIntraCity()) return ICON_GREYS.transportIntra;
    return resolveEventColor(e);
  });

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
    // Partida: "sale de / despega desde" — always the departure glyph derived from subtype.
    // We ignore event.icon here because event.icon describes the arrival (aterriza, tren_llega, etc.).
    return transportIcon(this.asTraslado()?.subtype);
  });

  protected readonly trasladoArriboIcon = computed((): string => {
    const t = this.asTraslado();
    // Arribo: use event.icon as a semantic key (aterriza, tren_llega, ...) resolved via registry.
    // Fallback to subtype-specific arrival glyphs, then generic transport.
    const resolved = resolveEventIcon({ icon: t?.icon, subtype: t?.subtype });
    if (t?.icon?.trim()) return resolved;
    if (t?.subtype === 'flight') return 'ms-flight_land';
    if (t?.subtype === 'train') return 'ms-directions_railway';
    return resolved;
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

  // Intra-city transit (metro/bus/tram/taxi) collapses to a single row.
  // The cross-city "Sale de X / Llega a X" copy reads nonsensical when
  // origin and destination are the same city, so we switch to a compact
  // "<service> · <origin> → <destination> · HH:MM–HH:MM" format.
  protected readonly isIntraCity = computed((): boolean => {
    const t = this.asTraslado();
    if (!t) return false;
    return !!t.cityOut && t.cityOut === t.cityIn;
  });

  protected readonly intraCityIcon = computed((): string => resolveEventIcon(this.asTraslado() ?? {}));

  protected readonly intraCityText = computed((): string => {
    const t = this.asTraslado();
    if (!t) return '';
    const isWalk = t.subtype === 'walking' || t.subtype === 'walk' || t.subtype === 'scooter';
    const company = t.company?.trim() || '';
    const vehicle = t.vehicleCode?.trim() || '';
    // For walking the icon already conveys the mode; suppress the "walking" word.
    const service = isWalk
      ? ''
      : [company, vehicle].filter(Boolean).join(' ') || t.title;
    const origin = t.originLabel?.trim();
    const dest = t.destinationLabel?.trim();
    const depart = timeOf(t.timestampIn);
    const arrive = t.timestampOut ? timeOf(t.timestampOut) : '';
    const window = arrive ? `${depart}–${arrive}` : depart;
    const route = origin && dest ? `${origin} → ${dest}` : '';
    return [service, route, window].filter(Boolean).join(' · ');
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
