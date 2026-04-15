import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { CityCardList } from '../ciudades/city-card-list/city-card-list';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';
import type { City, Card } from '../shared/models';

/**
 * Lazy content panel for a single city tab in the sitios page.
 *
 * @remarks
 * Only fetches cards when `active` is true to avoid unnecessary API calls for
 * non-visible tabs. Cards are loaded from /api/cards/:slug.
 */
@Component({
  selector: 'app-city-tab-content',
  imports: [CityCardList, LoadingState, ErrorState],
  template: `
    @if (cardsResource.isLoading()) {
      <div class="pt-4">
        <app-loading-state />
      </div>
    }
    @if (cardsResource.error()) {
      <div class="pt-4">
        <app-error-state
          message="No se pudieron cargar las actividades."
          (retry)="cardsResource.reload()"
        />
      </div>
    }
    @if (cardsResource.value() !== undefined) {
      <div class="pt-4">
        <app-city-card-list [cards]="cardsResource.value()!" />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityTabContent {
  readonly slug = input.required<string>();
  readonly active = input.required<boolean>();

  readonly cardsResource = httpResource<Card[]>(() => {
    const s = this.slug();
    if (!s || !this.active()) return undefined;
    return '/api/cards/' + s;
  });
}

/**
 * Sitios page: tabbed view of per-city activity and point-of-interest cards.
 *
 * @remarks
 * Fetches the city list from /api/cities and renders one tab per city.
 * The active tab is synced to the `c` query parameter so deep-linking works.
 * Card data is loaded lazily by CityTabContent only when its tab is active.
 */
@Component({
  selector: 'app-sitios-page',
  imports: [Tabs, TabList, Tab, TabPanels, TabPanel, CityTabContent, LoadingState, ErrorState],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-6">
      @if (citiesResource.isLoading()) {
        <app-loading-state />
      }

      @if (citiesResource.error()) {
        <app-error-state
          message="No se pudieron cargar las ciudades."
          (retry)="citiesResource.reload()"
        />
      }

      @if (cities().length > 0) {
        <p-tabs [value]="activeTab()" (valueChange)="onTabChange($event)">
          <p-tablist>
            @for (city of cities(); track city.slug) {
              <p-tab [value]="city.slug">
                <span class="flex items-center gap-2">
                  <span
                    class="inline-block w-2 h-2 rounded-full"
                    [style.background-color]="city.color"
                  ></span>
                  {{ city.name }}
                </span>
              </p-tab>
            }
          </p-tablist>

          <p-tabpanels>
            @for (city of cities(); track city.slug) {
              <p-tabpanel [value]="city.slug">
                <app-city-tab-content
                  [slug]="city.slug"
                  [active]="activeTab() === city.slug"
                />
              </p-tabpanel>
            }
          </p-tabpanels>
        </p-tabs>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SitiosPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly citiesResource = httpResource<City[]>(() => '/api/cities');

  readonly cities = computed(() => this.citiesResource.value() ?? []);

  readonly activeTab = signal<string>('');

  private readonly _initEffect = effect(() => {
    const cities = this.cities();
    if (!cities.length) return;

    untracked(() => {
      const qp = this.route.snapshot.queryParamMap.get('c');
      const valid = cities.find((c) => c.slug === qp);
      const initial = valid ? qp! : cities[0].slug;
      this.activeTab.set(initial);
    });
  });

  onTabChange(slug: string | number | undefined): void {
    if (slug === undefined) return;
    const s = String(slug);
    this.activeTab.set(s);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { c: s },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
