import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ActivityTipo } from '../../shared/models/activity.model';
import { City } from '../../shared/models';
import { getDayColorFromCities, getTravelGradientFromCities, toDateStr } from '../calendar-utils';
import { DayCell } from '../day-cell/day-cell';

type CalEvent = { description: string; tipo: ActivityTipo; tag: string; confirmed: boolean };

type CellData = {
  key: string;
  day: number | null;
  dateStr: string;
  events: CalEvent[];
  bgColor: string | null;
  gradient: string | null;
  inactive: boolean;
};

@Component({
  selector: 'app-month-panel',
  imports: [DayCell],
  template: `
    <div>
      <h2 class="text-lg font-semibold text-center mb-3 capitalize">{{ monthName() }} {{ year() }}</h2>
      <div class="grid grid-cols-7 gap-1 mb-1">
        @for (d of dayNames; track d) {
          <div class="text-center text-xs font-medium text-surface-400 py-1">{{ d }}</div>
        }
      </div>
      <div class="grid grid-cols-7 gap-1">
        @for (cell of cells(); track cell.key) {
          <app-day-cell
            [dateStr]="cell.dateStr"
            [dayNumber]="cell.day ?? 0"
            [events]="cell.events"
            [bgColor]="cell.bgColor"
            [gradient]="cell.gradient"
            [inactive]="cell.inactive"
          />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthPanel {
  readonly month      = input.required<number>();
  readonly year       = input.required<number>();
  readonly activities = input<Array<{ date: string } & CalEvent>>([]);
  readonly cities     = input<City[]>([]);

  readonly dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  readonly monthName = computed(() => {
    const names = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return names[this.month() - 1];
  });

  readonly cells = computed((): CellData[] => {
    const year   = this.year();
    const month  = this.month();
    const acts   = this.activities();
    const cities = this.cities();

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay    = new Date(year, month - 1, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const cells: CellData[] = [];

    for (let i = 0; i < startOffset; i++) {
      cells.push({ key: 'empty-' + i, day: null, dateStr: '', events: [], bgColor: null, gradient: null, inactive: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = toDateStr(year, month, d);
      const events  = acts.filter(a => a.date === dateStr);
      const gradient = getTravelGradientFromCities(dateStr, cities);
      const bgColor  = gradient ? null : getDayColorFromCities(dateStr, cities);
      cells.push({ key: dateStr, day: d, dateStr, events, bgColor, gradient, inactive: false });
    }

    return cells;
  });
}
