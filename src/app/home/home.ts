import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroBanner } from './hero-banner/hero-banner';
import { CityPreviewCard, CityPreview } from './city-preview-card/city-preview-card';
import { TripStats } from './trip-stats/trip-stats';
import { QuickNav } from './quick-nav/quick-nav';
import { CITY_COLORS } from '../shared/theme/colors';

const CITIES_PREVIEW: CityPreview[] = [
  { slug: 'madrid',    name: 'Madrid',    color: CITY_COLORS['madrid'],    dates: '20–24 abr',       nights: 4 },
  { slug: 'barcelona', name: 'Barcelona', color: CITY_COLORS['barcelona'], dates: '24–28 abr',       nights: 4 },
  { slug: 'palma',     name: 'Palma',     color: CITY_COLORS['palma'],     dates: '28 abr – 2 may',  nights: 4 },
  { slug: 'londres',   name: 'Londres',   color: CITY_COLORS['londres'],   dates: '2–5 may',         nights: 3 },
  { slug: 'roma',      name: 'Roma',      color: CITY_COLORS['roma'],      dates: '5–9 may',         nights: 4 },
];

@Component({
  selector: 'app-home',
  imports: [HeroBanner, CityPreviewCard, TripStats, QuickNav],
  template: `
    <div class="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <app-hero-banner />
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        @for (city of cities; track city.slug) {
          <app-city-preview-card [city]="city" />
        }
      </div>
      <app-trip-stats />
      <app-quick-nav />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly cities = CITIES_PREVIEW;
}
