import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ActivityTipo } from '../../shared/models/activity.model';
import { City, TripEvent, isTraslado } from '../../shared/models';
import { getDayColorFromCities, getTravelGradientFromEvents, toDateStr } from '../calendar-utils';
import { CalendarDay } from '../calendar-day/calendar-day';

type CalEvent = { description: string; tipo: ActivityTipo; tag: string; confirmed: boolean; cityColor?: string };

type CellData = {
  key: string;
  day: number | null;
  dateStr: string;
  events: CalEvent[];
  rawEvents: TripEvent[];
  bgColor: string | null;
  gradient: string | null;
  inactive: boolean;
};

const EMPTY_EVENTS: CalEvent[] = [];
const EMPTY_RAW: TripEvent[] = [];
const MONTH_NAMES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

@Component({
  selector: 'app-calendar-month',
  imports: [CalendarDay],
  template: `
    <div>
      <h2 class="text-lg font-semibold text-center mb-3 capitalize select-none">{{ monthName() }} {{ year() }}</h2>
      <div class="grid grid-cols-7 gap-1 mb-1">
        @for (d of dayNames; track d) {
          <div class="text-center text-xs font-medium text-surface-400 py-1 select-none">{{ d }}</div>
        }
      </div>
      <div class="grid grid-cols-7 auto-rows-[5rem] gap-1">
        @for (cell of cells(); track cell.key) {
          <app-calendar-day
            [dateStr]="cell.dateStr"
            [dayNumber]="cell.day ?? 0"
            [events]="cell.events"
            [rawEvents]="cell.rawEvents"
            [cities]="cities()"
            [bgColor]="cell.bgColor"
            [gradient]="cell.gradient"
            [inactive]="cell.inactive"
            (selectDate)="selectDate.emit($event)"
          />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarMonth {
  readonly month           = input.required<number>();
  readonly year            = input.required<number>();
  readonly activitiesByDay = input<Map<string, CalEvent[]>>(new Map());
  readonly eventsByDay     = input<Map<string, TripEvent[]>>(new Map());
  readonly cities          = input<City[]>([]);

  readonly selectDate = output<string>();
  readonly dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  readonly monthName = computed(() => MONTH_NAMES[this.month() - 1]);

  readonly cells = computed((): CellData[] => {
    const year   = this.year();
    const month  = this.month();
    const actsByDay = this.activitiesByDay();
    const cities = this.cities();
    const eByDay = this.eventsByDay();

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay    = new Date(year, month - 1, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const gradientsByDay = new Map<string, string>();
    for (const [date, evs] of eByDay) {
      if (!evs.some(isTraslado)) continue;
      const g = getTravelGradientFromEvents(evs, cities);
      if (g) gradientsByDay.set(date, g);
    }

    const cells: CellData[] = [];

    for (let i = 0; i < startOffset; i++) {
      cells.push({ key: 'empty-' + i, day: null, dateStr: '', events: EMPTY_EVENTS, rawEvents: EMPTY_RAW, bgColor: null, gradient: null, inactive: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = toDateStr(year, month, d);
      const events  = actsByDay.get(dateStr) ?? EMPTY_EVENTS;
      const rawEvents = eByDay.get(dateStr) ?? EMPTY_RAW;
      const gradient = gradientsByDay.get(dateStr) ?? null;
      let bgColor = gradient ? null : getDayColorFromCities(dateStr, cities);
      if (!bgColor && !gradient && events.length > 0) {
        const confirmedEvent = events.find((e) => e.confirmed && e.cityColor);
        if (confirmedEvent?.cityColor) bgColor = confirmedEvent.cityColor;
      }
      cells.push({ key: dateStr, day: d, dateStr, events, rawEvents, bgColor, gradient, inactive: false });
    }

    return cells;
  });
}
