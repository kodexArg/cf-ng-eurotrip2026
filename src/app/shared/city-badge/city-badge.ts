import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { CITY_MAP } from '../city-map';

@Component({
  selector: 'app-city-badge',
  standalone: true,
  imports: [Tag],
  template: `
    <div class="flex items-center gap-3 mb-2">
      <p-tag
        [value]="cityData().name"
        [style]="{ 'background-color': cityData().color, 'color': '#fff', 'font-size': '1.1rem', 'padding': '0.5rem 1rem' }"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityBadge {
  readonly slug = input.required<string>();
  readonly cityData = computed(() => CITY_MAP[this.slug()] ?? { name: this.slug(), color: '#888' });
}
