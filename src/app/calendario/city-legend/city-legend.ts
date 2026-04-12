import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { City } from '../../shared/models';

const CITY_EMOJI: Record<string, string> = {
  madrid:    '🇪🇸',
  barcelona: '🇪🇸',
  palma:     '🇪🇸',
  paris:     '🇫🇷',
  roma:      '🇮🇹',
};

@Component({
  selector: 'app-city-legend',
  imports: [],
  template: `
    <div class="flex flex-wrap gap-2 justify-center">
      @for (city of uniqueCities(); track city.id) {
        <div
          class="flex items-center gap-1.5 rounded-md px-2 py-1 border-2 text-sm font-medium"
          [style.border-color]="city.color"
          [style.background-color]="city.color + '1a'"
        >
          <span
            class="flex items-center justify-center rounded text-base leading-none"
            style="width: 1.75rem; height: 1.75rem;"
          >{{ emoji(city.slug) }}</span>
          <span [style.color]="city.color">{{ city.name }}</span>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityLegend {
  readonly cities = input.required<City[]>();

  // Deduplicate cities by id, keeping only the first occurrence
  readonly uniqueCities = computed(() => {
    const cities = this.cities();
    return cities.filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);
  });

  emoji(slug: string): string {
    return CITY_EMOJI[slug] ?? '📍';
  }
}
