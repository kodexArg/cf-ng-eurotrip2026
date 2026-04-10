import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CityBlock } from '../shared/models';
import { VariantService } from '../shared/services/variant.service';
import { MonthPanel } from './month-panel/month-panel';

@Component({
  selector: 'app-calendario',
  imports: [MonthPanel],
  template: `
    <div class="max-w-3xl mx-auto p-4 flex flex-col gap-6">
      <h1 class="text-2xl font-bold text-center text-surface-800">Calendario del viaje</h1>
      <app-month-panel [month]="4" [year]="2026" [activities]="confirmedActivities()" />
      <app-month-panel [month]="5" [year]="2026" [activities]="confirmedActivities()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarioPage {
  private readonly variantService = inject(VariantService);
  readonly itineraryResource = httpResource<CityBlock[]>(() => '/api/itinerary');

  readonly confirmedActivities = computed((): Array<{ date: string; description: string; confirmed: boolean }> => {
    const blocks = this.itineraryResource.value() ?? [];
    const v = this.variantService.variant();
    const result: Array<{ date: string; description: string; confirmed: boolean }> = [];
    for (const block of blocks) {
      for (const day of block.days) {
        for (const act of day.activities) {
          if (act.variant === 'both' || act.variant === v) {
            result.push({ date: day.date, description: act.description, confirmed: act.confirmed });
          }
        }
      }
    }
    return result;
  });
}
