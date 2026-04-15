import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Chip } from 'primeng/chip';
import { CITY_MAP } from '../city-map';

/**
 * Renders a city chip badge using the city's color from CITY_MAP.
 *
 * @remarks
 * - `slug`: city identifier used to look up color and display name.
 * Falls back to the raw slug and grey color when the city is not found in CITY_MAP.
 */
@Component({
  selector: 'app-city-chip',
  imports: [Chip],
  template: `
    <p-chip
      [label]="cityData().name"
      [style]="{ 'background-color': cityData().color, 'color': '#fff' }"
      styleClass="text-xs"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityChip {
  readonly slug = input.required<string>();
  readonly cityData = computed(() => CITY_MAP[this.slug()] ?? { name: this.slug(), color: '#888' });
}
