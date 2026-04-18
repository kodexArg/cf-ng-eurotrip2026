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
import {
  DIALOG_WIDTH,
  DIALOG_MAX_WIDTH,
  DIALOG_MAX_HEIGHT_VH,
} from '../../shared/theme/spacing';
import { EventDetailRow } from './parts/event-detail-row';
import { AppIcon } from '../../shared/icon/icon';

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
  imports: [Dialog, EventDetailRow, AppIcon],
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
      [style]="dialogStyle"
      [contentStyle]="dialogContentStyle"
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
                class="text-base font-bold leading-tight"
                [style.color]="cityColor()"
              >
                {{ longDate() }}
              </div>
              @if (cityName()) {
                <div
                  class="text-xs mt-1 flex items-center gap-1.5"
                  style="color: var(--p-surface-600)"
                >
                  <app-icon icon="pi-map-marker" size="0.625rem" />
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
                <app-icon icon="pi-list" size="0.5625rem" />
                {{ sortedEvents().length }}
                {{ sortedEvents().length === 1 ? 'evento' : 'eventos' }}
              </span>
              @if (totalUsd() > 0) {
                <span style="color: var(--p-surface-300)">·</span>
                <span class="flex items-center gap-1" style="color: #16a34a">
                  USD {{ totalUsd() }}
                </span>
              }
            </div>
          }
        </div>

        <div class="flex flex-col px-4 py-3 gap-2">
          @for (e of sortedEvents(); track e.id) {
            <app-event-detail-row
              [event]="e"
              [iconColor]="rowIconColor(e)"
              [borderColor]="rowBorderColor(e)"
              [bgColor]="rowBgColor(e)"
              [trasladoRoute]="trasladoRouteFor(e)"
            />
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
  protected readonly dialogStyle = { width: DIALOG_WIDTH, maxWidth: DIALOG_MAX_WIDTH };
  protected readonly dialogContentStyle = { padding: '0', maxHeight: DIALOG_MAX_HEIGHT_VH, overflowY: 'auto' };

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

  protected rowIconColor(e: TripEvent): string {
    if (isTraslado(e)) return '#475569';
    if (isEstadia(e)) return '#7c3aed';
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

  protected trasladoRouteFor(e: TripEvent): string {
    if (!isTraslado(e)) return '';
    const cityById = new Map(this.cities().map((c) => [c.id, c.name]));
    const from = e.cityOut
      ? cityById.get(e.cityOut) ?? e.cityOut.toUpperCase()
      : '—';
    const to = cityById.get(e.cityIn) ?? e.cityIn.toUpperCase();
    return `${from} → ${to}`;
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
