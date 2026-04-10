import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getDayColor, getTravelGradient } from '../calendar-utils';
import { EventChip } from '../event-chip/event-chip';

@Component({
  selector: 'app-day-cell',
  standalone: true,
  imports: [EventChip, RouterLink],
  template: `
    <a
      [routerLink]="['/itinerario']"
      [queryParams]="{ date: dateStr() }"
      class="block rounded-md min-h-16 p-1 cursor-pointer hover:opacity-90 transition-opacity no-underline overflow-hidden"
      [style]="cellStyle()"
    >
      <span class="text-xs font-semibold block" [class]="dayNumberClass()">{{ dayNumber() }}</span>
      <div class="flex flex-col gap-0.5 mt-0.5">
        @for (event of events(); track event.description) {
          <app-event-chip [label]="event.description" [confirmed]="event.confirmed" />
        }
      </div>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayCell {
  readonly dateStr = input.required<string>();
  readonly dayNumber = input.required<number>();
  readonly events = input<Array<{ description: string; confirmed: boolean }>>([]);

  readonly cellStyle = computed(() => {
    const d = this.dateStr();
    const gradient = getTravelGradient(d);
    if (gradient) return { background: gradient };
    const color = getDayColor(d);
    if (color) return { 'background-color': color, opacity: '0.85' };
    return { 'background-color': 'var(--p-surface-100)' };
  });

  readonly dayNumberClass = computed(() => {
    const color = getDayColor(this.dateStr()) || getTravelGradient(this.dateStr());
    return color ? 'text-white' : 'text-surface-600';
  });
}
