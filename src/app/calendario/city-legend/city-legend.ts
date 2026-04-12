import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { City } from '../../shared/models';

@Component({
  selector: 'app-city-legend',
  imports: [],
  template: `
    <div class="flex flex-wrap gap-x-4 gap-y-1 justify-center items-center select-none text-xs text-surface-600">
      @for (city of uniqueCities(); track city.id; let last = $last) {
        <span class="inline-flex items-center gap-1.5">
          <span
            class="inline-block rounded-full"
            style="width: 0.5rem; height: 0.5rem;"
            [style.background-color]="city.color"
          ></span>
          <span>{{ city.name }}</span>
        </span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityLegend {
  readonly cities = input.required<City[]>();

  readonly uniqueCities = computed(() => {
    const cities = this.cities();
    return cities.filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);
  });
}
