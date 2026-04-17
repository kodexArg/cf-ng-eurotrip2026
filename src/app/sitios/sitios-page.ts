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
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectButton } from 'primeng/selectbutton';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { CityCardList } from '../ciudades/city-card-list/city-card-list';
import { LoadingState } from '../shared/loading-state/loading-state';
import { ErrorState } from '../shared/error-state/error-state';
import type { City, Card } from '../shared/models';

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

interface DatePill {
  date: string;   // YYYY-MM-DD
  label: string;  // "28 Abr"
}

function cityDatePills(city: City): DatePill[] {
  const pills: DatePill[] = [];
  const arrival = new Date(city.arrival + 'T00:00:00');
  const departure = new Date(city.departure + 'T00:00:00');
  const cur = new Date(arrival);
  while (cur < departure) {
    pills.push({
      date: cur.toISOString().slice(0, 10),
      label: cur.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    });
    cur.setDate(cur.getDate() + 1);
  }
  return pills;
}

@Component({
  selector: 'app-sitios-page',
  imports: [FormsModule, SelectButton, Tabs, TabList, Tab, TabPanels, TabPanel, CityTabContent, LoadingState, ErrorState],
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
                <!-- Date pills for this city -->
                <div class="mt-3">
                  <p-selectbutton
                    [options]="dateOptions(city)"
                    [(ngModel)]="selectedDate"
                    optionLabel="label"
                    optionValue="value"
                    styleClass="filter-wrap"
                  />
                </div>
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
  readonly selectedDate = signal<string>('all');

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

  dateOptions(city: City): { label: string; value: string }[] {
    return [
      { label: 'Todas', value: 'all' },
      ...cityDatePills(city).map(p => ({ label: p.label, value: p.date })),
    ];
  }

  onTabChange(slug: string | number | undefined): void {
    if (slug === undefined) return;
    const s = String(slug);
    this.activeTab.set(s);
    this.selectedDate.set('all');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { c: s },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
