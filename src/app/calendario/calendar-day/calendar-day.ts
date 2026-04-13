import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ActivityTipo } from '../../shared/models/activity.model';
import { City, TripEvent, isHito, isTraslado, isEstadia, timeOf } from '../../shared/models';
import { EventChip } from '../event-chip/event-chip';

type CalEvent = { description: string; tipo: ActivityTipo; tag: string; confirmed: boolean };

const DOW_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MON_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function formatHoverHeader(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DOW_ES[dt.getUTCDay()]} ${d} ${MON_ES[m - 1]}`;
}

@Component({
  selector: 'app-calendar-day',
  imports: [EventChip],
  host: { class: 'block h-full' },
  template: `
    @if (inactive()) {
      <div class="rounded-md h-full opacity-20" style="background-color: var(--p-surface-200)"></div>
    } @else {
      <div
        class="relative h-full"
        (mouseenter)="onEnter()"
        (mouseleave)="onLeave()"
      >
        <div
          (click)="hasEvents() ? selectDate.emit(dateStr()) : null"
          class="block rounded-md h-full p-1 transition-opacity no-underline overflow-hidden select-none"
          [class.cursor-pointer]="hasEvents()"
          [class.hover:opacity-90]="hasEvents()"
          [style]="cellStyle()"
        >
          <span class="text-xs font-semibold block" [class]="dayNumberClass()">{{ dayNumber() }}</span>
          <div class="flex flex-col gap-0.5 mt-0.5">
            @for (event of events(); track event.tag) {
              <app-event-chip [label]="event.tag" [tipo]="event.tipo" [confirmed]="event.confirmed" />
            }
          </div>
        </div>

        @if (hovered() && hasEvents()) {
          <div
            class="absolute z-40 pointer-events-none"
            style="
              left: 50%;
              top: 100%;
              transform: translate(-50%, 6px);
              min-width: 220px;
              max-width: 280px;
              background: white;
              border-radius: 6px;
              box-shadow: 0 6px 20px rgba(0,0,0,0.18);
              border: 1px solid rgba(0,0,0,0.06);
              padding: 8px 10px;
            "
          >
            <div
              style="
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.6px;
                color: var(--p-surface-500);
                padding-bottom: 4px;
                border-bottom: 1px dashed var(--p-surface-200);
                margin-bottom: 5px;
                text-align: center;
              "
            >
              {{ hoverHeader() }}
            </div>
            <div class="flex flex-col gap-1">
              @for (row of hoverRows(); track row.id) {
                <div
                  class="flex items-start gap-1.5"
                  [style.opacity]="row.confirmed ? '1' : '0.62'"
                >
                  <span
                    style="
                      font-size: 9.5px;
                      color: #777;
                      font-variant-numeric: tabular-nums;
                      min-width: 30px;
                      text-align: right;
                      padding-top: 2px;
                      flex-shrink: 0;
                    "
                  >{{ row.time }}</span>
                  <i
                    [class]="'pi ' + row.icon"
                    [style.color]="row.color"
                    style="font-size: 11px; padding-top: 3px; width: 14px; text-align: center; flex-shrink: 0"
                  ></i>
                  <div style="flex: 1; min-width: 0">
                    <div
                      style="
                        font-size: 11px;
                        line-height: 1.3;
                        color: #222;
                        word-wrap: break-word;
                      "
                      [style.fontWeight]="row.confirmed ? '500' : '400'"
                    >{{ row.title }}</div>
                  </div>
                  @if (row.confirmed) {
                    <i
                      class="pi pi-check-circle"
                      style="font-size: 10px; color: #16a34a; padding-top: 3px; flex-shrink: 0"
                    ></i>
                  }
                </div>
              }
            </div>
            <div
              style="
                font-size: 9px;
                color: var(--p-surface-400);
                text-align: center;
                margin-top: 5px;
                padding-top: 4px;
                border-top: 1px dashed var(--p-surface-200);
                font-style: italic;
              "
            >
              Click para detalles
            </div>
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDay {
  readonly dateStr   = input<string>('');
  readonly dayNumber = input<number>(0);
  readonly events    = input<CalEvent[]>([]);
  readonly rawEvents = input<readonly TripEvent[]>([]);
  readonly cities    = input<readonly City[]>([]);
  readonly bgColor   = input<string | null>(null);
  readonly gradient  = input<string | null>(null);
  readonly inactive  = input<boolean>(false);

  readonly selectDate = output<string>();

  protected readonly hovered = signal(false);

  readonly cellStyle = computed(() => {
    const g = this.gradient();
    if (g) return { background: g };
    const c = this.bgColor();
    if (c) return { 'background-color': c, opacity: '0.85' };
    return { 'background-color': 'var(--p-surface-100)' };
  });

  readonly dayNumberClass = computed(() =>
    (this.gradient() || this.bgColor()) ? 'text-white' : 'text-surface-600'
  );

  readonly hasEvents = computed(() => this.rawEvents().length > 0 || this.events().length > 0);

  readonly hoverHeader = computed(() => formatHoverHeader(this.dateStr()));

  readonly hoverRows = computed(() => {
    const cityById = new Map(this.cities().map((c) => [c.id, c]));
    return [...this.rawEvents()]
      .sort((a, b) => (a.timestampIn ?? '').localeCompare(b.timestampIn ?? ''))
      .map((e) => {
        let color = 'var(--p-surface-600)';
        if (isTraslado(e)) color = '#475569';
        else if (isEstadia(e)) color = '#7c3aed';
        else if (isHito(e)) color = cityById.get(e.cityIn)?.color ?? color;
        return {
          id: e.id,
          time: e.timestampIn ? timeOf(e.timestampIn) : '',
          icon: e.icon || 'pi-circle',
          title: e.title,
          confirmed: e.confirmed,
          color,
        };
      });
  });

  protected onEnter(): void {
    if (this.hasEvents()) this.hovered.set(true);
  }

  protected onLeave(): void {
    this.hovered.set(false);
  }
}
