import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ActivityTipo } from '../../shared/models/activity.model';
import { EventChip } from '../event-chip/event-chip';

type CalEvent = { description: string; tipo: ActivityTipo; tag: string; confirmed: boolean };

@Component({
  selector: 'app-calendar-day',
  imports: [EventChip],
  host: { class: 'block h-full overflow-hidden' },
  template: `
    @if (inactive()) {
      <div class="rounded-md h-full opacity-20" style="background-color: var(--p-surface-200)"></div>
    } @else {
      <div
        (click)="events().length ? selectDate.emit(dateStr()) : null"
        class="block rounded-md h-full p-1 transition-opacity no-underline overflow-hidden"
        [class.cursor-pointer]="events().length"
        [class.hover:opacity-90]="events().length"
        [style]="cellStyle()"
      >
        <span class="text-xs font-semibold block" [class]="dayNumberClass()">{{ dayNumber() }}</span>
        <div class="flex flex-col gap-0.5 mt-0.5">
          @for (event of events(); track event.tag) {
            <app-event-chip [label]="event.tag" [tipo]="event.tipo" [confirmed]="event.confirmed" />
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDay {
  readonly dateStr   = input<string>('');
  readonly dayNumber = input<number>(0);
  readonly events    = input<CalEvent[]>([]);
  readonly bgColor   = input<string | null>(null);
  readonly gradient  = input<string | null>(null);
  readonly inactive  = input<boolean>(false);

  readonly cellStyle = computed(() => {
    const g = this.gradient();
    if (g) return { background: g };
    const c = this.bgColor();
    if (c) return { 'background-color': c, opacity: '0.85' };
    return { 'background-color': 'var(--p-surface-100)' };
  });

  readonly selectDate = output<string>();

  readonly dayNumberClass = computed(() =>
    (this.gradient() || this.bgColor()) ? 'text-white' : 'text-surface-600'
  );
}
