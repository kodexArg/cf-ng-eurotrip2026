import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import {
  City,
  TripEvent,
  isEstadia,
  isHito,
  isTraslado,
  timeOf,
} from '../../shared/models';

const DOW_ES_FULL = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
const MON_ES_FULL = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** "2026-04-27" → "Lunes 27 de abril 2026" — UTC-built to avoid TZ drift. */
function formatLongDate(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DOW_ES_FULL[dt.getUTCDay()]} ${d} de ${MON_ES_FULL[m - 1]} ${y}`;
}

/**
 * Modal dialog showing the full detail of every event for a single day.
 *
 * Used by the calendar — clicking any day cell opens this dialog. Unlike
 * the city-scoped SiteInfoModal, this one shows ALL event types for the
 * day (hitos + traslados + estadías), regardless of which city dominates
 * the day. This is what the user expects: a flight from Madrid to Palma
 * is shown in BOTH cities' days.
 */
@Component({
  selector: 'app-day-detail-dialog',
  imports: [Dialog],
  template: `
    <p-dialog
      [visible]="visible()"
      (visibleChange)="onVisibleChange($event)"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [dismissableMask]="true"
      [closable]="true"
      [showHeader]="false"
      [style]="{ width: '520px', maxWidth: '95vw' }"
      [contentStyle]="{ padding: '0', maxHeight: '80vh', overflowY: 'auto' }"
      styleClass="day-detail-dialog"
    >
      @if (date(); as d) {
        <div
          class="px-4 pt-4 pb-3"
          [style.background]="headerBg()"
          [style.borderLeft]="'4px solid ' + cityColor()"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div
                class="text-base font-bold capitalize leading-tight"
                [style.color]="cityColor()"
              >
                {{ longDate() }}
              </div>
              @if (cityName()) {
                <div
                  class="text-xs mt-1 flex items-center gap-1.5"
                  style="color: var(--p-surface-600)"
                >
                  <i class="pi pi-map-marker" style="font-size: 10px"></i>
                  <span>{{ cityName() }}</span>
                  @if (isTravelDay()) {
                    <span style="color: var(--p-surface-400)">·</span>
                    <span
                      class="font-medium"
                      style="color: var(--p-surface-700)"
                    >día de viaje</span>
                  }
                </div>
              }
            </div>
            <button
              type="button"
              class="bg-transparent border-none cursor-pointer text-lg leading-none flex-shrink-0"
              style="color: var(--p-surface-400)"
              (click)="close.emit()"
              aria-label="Cerrar"
            >✕</button>
          </div>
          @if (totalUsd() > 0 || sortedEvents().length > 0) {
            <div
              class="text-xs mt-2 flex items-center gap-3 flex-wrap"
              style="color: var(--p-surface-500)"
            >
              <span class="flex items-center gap-1">
                <i class="pi pi-list" style="font-size: 9px"></i>
                {{ sortedEvents().length }}
                {{ sortedEvents().length === 1 ? 'evento' : 'eventos' }}
              </span>
              @if (totalUsd() > 0) {
                <span style="color: var(--p-surface-300)">·</span>
                <span class="flex items-center gap-1" style="color: #16a34a">
                  <i class="pi pi-dollar" style="font-size: 9px"></i>
                  USD {{ totalUsd() }}
                </span>
              }
            </div>
          }
        </div>

        <div class="flex flex-col px-4 py-3 gap-2">
          @for (e of sortedEvents(); track e.id) {
            <div
              class="rounded-lg border p-3"
              [style.borderColor]="rowBorderColor(e)"
              [style.backgroundColor]="rowBgColor(e)"
              [style.opacity]="e.confirmed ? '1' : '0.7'"
            >
              <div class="flex items-start gap-2">
                <i
                  [class]="'pi ' + (e.icon || 'pi-circle')"
                  [style.color]="rowIconColor(e)"
                  style="font-size: 14px; padding-top: 2px; width: 18px; text-align: center; flex-shrink: 0"
                ></i>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      <div
                        class="text-sm font-semibold leading-snug"
                        style="color: var(--p-surface-800); word-wrap: break-word"
                      >
                        {{ e.title }}
                      </div>
                      <div
                        class="text-xs mt-0.5 flex items-center gap-1.5 flex-wrap"
                        style="color: var(--p-surface-500)"
                      >
                        <span
                          class="uppercase font-semibold tracking-wide"
                          style="font-size: 9px"
                          [style.color]="rowIconColor(e)"
                        >
                          {{ typeLabel(e) }}
                        </span>
                        @if (timeRange(e); as tr) {
                          <span style="color: var(--p-surface-300)">·</span>
                          <span style="font-variant-numeric: tabular-nums">
                            <i
                              class="pi pi-clock"
                              style="font-size: 9px; margin-right: 2px"
                            ></i>
                            {{ tr }}
                          </span>
                        }
                      </div>
                    </div>
                    <div class="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                      @if (e.usd && e.usd > 0) {
                        <span
                          class="text-xs font-semibold flex items-center"
                          style="color: #16a34a"
                        >
                          <i
                            class="pi pi-dollar"
                            style="font-size: 9px"
                          ></i>{{ e.usd }}
                        </span>
                      }
                      @if (e.confirmed) {
                        <i
                          class="pi pi-check-circle"
                          title="Confirmado"
                          style="font-size: 12px; color: #16a34a"
                        ></i>
                      } @else {
                        <i
                          class="pi pi-circle"
                          title="Planeado"
                          style="font-size: 11px; color: #cbd5e1"
                        ></i>
                      }
                    </div>
                  </div>

                  @if (e.description) {
                    <div
                      class="text-xs mt-1.5 leading-snug"
                      style="color: var(--p-surface-600)"
                    >
                      {{ e.description }}
                    </div>
                  }

                  @if (asTraslado(e); as t) {
                    <div
                      class="mt-2 rounded p-2 text-xs"
                      style="background-color: rgba(0,0,0,0.03)"
                    >
                      <div
                        class="flex items-center gap-1.5"
                        style="color: var(--p-surface-700)"
                      >
                        <i class="pi pi-send" style="font-size: 10px"></i>
                        <span class="font-medium">{{ trasladoRoute(t) }}</span>
                      </div>
                      <div
                        class="grid grid-cols-2 gap-x-3 gap-y-1 mt-1.5"
                        style="color: var(--p-surface-600)"
                      >
                        @if (t.company) {
                          <div>
                            <span style="color: var(--p-surface-400)">Compañía:</span>
                            {{ t.company }}
                          </div>
                        }
                        @if (t.vehicleCode) {
                          <div>
                            <span style="color: var(--p-surface-400)">Código:</span>
                            {{ t.vehicleCode }}
                          </div>
                        }
                        @if (t.fare) {
                          <div>
                            <span style="color: var(--p-surface-400)">Tarifa:</span>
                            {{ t.fare }}
                          </div>
                        }
                        @if (t.seat) {
                          <div>
                            <span style="color: var(--p-surface-400)">Asiento:</span>
                            {{ t.seat }}
                          </div>
                        }
                        @if (t.durationMin) {
                          <div>
                            <span style="color: var(--p-surface-400)">Duración:</span>
                            {{ formatDuration(t.durationMin) }}
                          </div>
                        }
                      </div>
                    </div>
                  }

                  @if (asEstadia(e); as s) {
                    <div
                      class="mt-2 rounded p-2 text-xs"
                      style="background-color: rgba(0,0,0,0.03)"
                    >
                      <div
                        class="flex items-center gap-1.5"
                        style="color: var(--p-surface-700)"
                      >
                        <i class="pi pi-home" style="font-size: 10px"></i>
                        <span class="font-medium">{{ s.accommodation }}</span>
                      </div>
                      <div
                        class="flex flex-col gap-1 mt-1.5"
                        style="color: var(--p-surface-600)"
                      >
                        @if (s.address) {
                          <div>
                            <span style="color: var(--p-surface-400)">Dirección:</span>
                            {{ s.address }}
                          </div>
                        }
                        @if (s.checkinTime || s.checkoutTime) {
                          <div class="flex gap-3">
                            @if (s.checkinTime) {
                              <span>
                                <span style="color: var(--p-surface-400)">Check-in:</span>
                                {{ s.checkinTime }}
                              </span>
                            }
                            @if (s.checkoutTime) {
                              <span>
                                <span style="color: var(--p-surface-400)">Check-out:</span>
                                {{ s.checkoutTime }}
                              </span>
                            }
                          </div>
                        }
                        @if (s.platform) {
                          <div>
                            <span style="color: var(--p-surface-400)">Plataforma:</span>
                            {{ s.platform }}
                          </div>
                        }
                        @if (s.bookingRef) {
                          <div>
                            <span style="color: var(--p-surface-400)">Reserva:</span>
                            {{ s.bookingRef }}
                          </div>
                        }
                      </div>
                    </div>
                  }

                  @if (e.notes) {
                    <div
                      class="text-xs mt-1.5 italic flex items-start gap-1"
                      style="color: var(--p-surface-500)"
                    >
                      <i
                        class="pi pi-info-circle"
                        style="font-size: 10px; padding-top: 2px"
                      ></i>
                      <span>{{ e.notes }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          } @empty {
            <div
              class="text-center text-sm py-6"
              style="color: var(--p-surface-400)"
            >
              Sin eventos registrados para este día.
            </div>
          }
        </div>
      }
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayDetailDialog {
  readonly visible = input<boolean>(false);
  readonly date = input<string | null>(null);
  readonly events = input<readonly TripEvent[]>([]);
  readonly cities = input<readonly City[]>([]);
  readonly cityName = input<string>('');
  readonly cityColor = input<string>('var(--p-surface-500)');
  readonly isTravelDay = input<boolean>(false);

  readonly close = output<void>();

  onVisibleChange(v: boolean): void {
    if (!v) this.close.emit();
  }

  protected readonly longDate = computed(() => {
    const d = this.date();
    return d ? formatLongDate(d) : '';
  });

  protected readonly sortedEvents = computed((): TripEvent[] =>
    [...this.events()].sort((a, b) => {
      // Hito-first vs traslado is irrelevant — chronological is clearer.
      const ta = a.timestampIn ?? '';
      const tb = b.timestampIn ?? '';
      if (ta && tb) return ta.localeCompare(tb);
      if (ta) return -1;
      if (tb) return 1;
      return 0;
    })
  );

  protected readonly totalUsd = computed(() =>
    this.events().reduce((acc, e) => acc + (e.usd ?? 0), 0)
  );

  protected readonly headerBg = computed(() => {
    const c = this.cityColor();
    if (!c || c.startsWith('var(')) return 'rgba(0,0,0,0.03)';
    return tintHex(c, 0.1);
  });

  protected asTraslado(e: TripEvent) {
    return isTraslado(e) ? e : null;
  }

  protected asEstadia(e: TripEvent) {
    return isEstadia(e) ? e : null;
  }

  protected typeLabel(e: TripEvent): string {
    if (isHito(e)) return 'hito';
    if (isTraslado(e)) return 'traslado';
    if (isEstadia(e)) return 'estadía';
    return '';
  }

  protected rowIconColor(e: TripEvent): string {
    if (isTraslado(e)) return '#475569'; // slate
    if (isEstadia(e)) return '#7c3aed'; // violet
    return this.cityColor() || 'var(--p-surface-600)';
  }

  protected rowBorderColor(e: TripEvent): string {
    if (isTraslado(e)) return 'rgba(71,85,105,0.25)';
    if (isEstadia(e)) return 'rgba(124,58,237,0.25)';
    return 'var(--p-surface-200)';
  }

  protected rowBgColor(e: TripEvent): string {
    if (isTraslado(e)) return 'rgba(71,85,105,0.04)';
    if (isEstadia(e)) return 'rgba(124,58,237,0.04)';
    return 'var(--p-surface-50)';
  }

  protected timeRange(e: TripEvent): string | null {
    const tin = e.timestampIn ? timeOf(e.timestampIn) : '';
    const tout = e.timestampOut ? timeOf(e.timestampOut) : '';
    if (tin && tout) return `${tin} – ${tout}`;
    if (tin) return tin;
    return null;
  }

  protected trasladoRoute(t: ReturnType<DayDetailDialog['asTraslado']>): string {
    if (!t) return '';
    const cityById = new Map(this.cities().map((c) => [c.id, c.name]));
    const from = t.cityOut
      ? cityById.get(t.cityOut) ?? t.cityOut.toUpperCase()
      : '—';
    const to = cityById.get(t.cityIn) ?? t.cityIn.toUpperCase();
    return `${from} → ${to}`;
  }

  protected formatDuration(min: number): string {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
}

/** Tint a #rrggbb color to an `rgba()` string at the given alpha. */
function tintHex(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return `rgba(0,0,0,${alpha})`;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `rgba(${r},${g},${b},${alpha})`;
}
