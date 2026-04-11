import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityTipo } from '../../shared/models/activity.model';
import { EventChip } from '../event-chip/event-chip';

type CalEvent = { description: string; tipo: ActivityTipo; tag: string; confirmed: boolean };

@Component({
  selector: 'app-day-cell',
  imports: [EventChip, RouterLink],
  template: `
    @if (inactive()) {
      <div class="rounded-md min-h-20 opacity-20" style="background-color: var(--p-surface-200)"></div>
    } @else {
      <a
        [routerLink]="['/itinerario']"
        [queryParams]="{ date: dateStr() }"
        class="block rounded-md min-h-20 p-1 cursor-pointer hover:opacity-90 transition-opacity no-underline overflow-hidden"
        [style]="cellStyle()"
      >
        <span class="text-xs font-semibold block" [class]="dayNumberClass()">{{ dayNumber() }}</span>
        <div class="flex flex-col gap-0.5 mt-0.5">
          @for (event of events(); track event.tag) {
            <app-event-chip [label]="event.tag" [tipo]="event.tipo" [confirmed]="event.confirmed" />
          }
        </div>
      </a>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayCell {
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

  readonly dayNumberClass = computed(() =>
    (this.gradient() || this.bgColor()) ? 'text-white' : 'text-surface-600'
  );
}
