import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivityTipo } from '../shared/models/activity.model';
import { City, CityBlock } from '../shared/models';
import { VariantService } from '../shared/services/variant.service';
import { CalendarMonth } from './calendar-month/calendar-month';
import { EventTypeLegend } from './event-type-legend/event-type-legend';

@Component({
  selector: 'app-calendar',
  imports: [CalendarMonth, EventTypeLegend],
  template: `
    <div class="max-w-3xl mx-auto p-4 flex flex-col gap-6">
      <h1 class="text-2xl font-bold text-center text-surface-800">Calendario del viaje</h1>
      <app-calendar-month [month]="4" [year]="2026" [activities]="confirmedActivities()" [cities]="cities()" />
      <app-calendar-month [month]="5" [year]="2026" [activities]="confirmedActivities()" [cities]="cities()" />
      <app-event-type-legend />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarPage {
  private readonly variantService = inject(VariantService);
  readonly itineraryResource = httpResource<CityBlock[]>(() => '/api/itinerary');

  readonly cities = computed((): City[] =>
    (this.itineraryResource.value() ?? []).map(block => block.city)
  );

  readonly confirmedActivities = computed((): Array<{ date: string; description: string; tipo: ActivityTipo; tag: string; confirmed: boolean }> => {
    const blocks = this.itineraryResource.value() ?? [];
    const v = this.variantService.variant();
    const result: Array<{ date: string; description: string; tipo: ActivityTipo; tag: string; confirmed: boolean }> = [];
    for (const block of blocks) {
      for (const day of block.days) {
        for (const act of day.activities) {
          if (act.variant === 'both' || act.variant === v) {
            result.push({ date: day.date, description: act.description, tipo: act.tipo, tag: act.tag, confirmed: act.confirmed });
          }
        }
      }
    }
    return result;
  });
}
