import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';
import { ActivityTipo, TIPO_CONFIG } from '../../shared/models/activity.model';

/**
 * Color-coded pill legend listing all visible activity types in the calendar.
 *
 * @remarks
 * Reads TIPO_CONFIG for colors and labels. Transport (traslado) entries are
 * excluded because travel days are hidden from the calendar view.
 */
@Component({
  selector: 'app-event-type-legend',
  imports: [Card],
  template: `
    <p-card>
      <div class="flex flex-wrap gap-2 justify-center select-none">
        @for (entry of tipos; track entry[0]) {
          <span
            class="text-[11px] px-2 py-0.5 rounded-full font-medium"
            [style]="{ 'background-color': entry[1].bg, color: entry[1].text }"
          >{{ entry[1].label }}</span>
        }
      </div>
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTypeLegend {
  // traslados ocultos en calendario
  readonly tipos = (Object.entries(TIPO_CONFIG) as [ActivityTipo, (typeof TIPO_CONFIG)[ActivityTipo]][]).filter(([key]) => key !== 'transport');
}
