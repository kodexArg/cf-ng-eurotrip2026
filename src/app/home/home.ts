import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroBanner } from './hero-banner/hero-banner';
import { CityPreviewCard, CityPreview } from './city-preview-card/city-preview-card';
import { TripStats } from './trip-stats/trip-stats';
import { QuickNav } from './quick-nav/quick-nav';

const CITIES_PREVIEW: CityPreview[] = [
  { slug: 'madrid', name: 'Madrid', color: '#e8a74e', dates: '20–24 abr', nights: 4 },
  { slug: 'barcelona', name: 'Barcelona', color: '#e07b5a', dates: '24–30 abr', nights: 6 },
  { slug: 'paris', name: 'París', color: '#7e8cc4', dates: '30 abr – 2 may', nights: 2 },
  { slug: 'venecia', name: 'Venecia', color: '#0d9488', dates: '2–4 may', nights: 2 },
  { slug: 'roma', name: 'Roma', color: '#c27ba0', dates: '4–9 may', nights: 5 },
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
