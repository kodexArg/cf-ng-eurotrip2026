import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ActivityTipo } from '../shared/models/activity.model';
import { City, CityBlock } from '../shared/models';
import { CalendarMonth } from './calendar-month/calendar-month';
import { EventTypeLegend } from './event-type-legend/event-type-legend';
import { CityLegend } from './city-legend/city-legend';
import { SiteInfoModal } from '../shared/site-info-modal/site-info-modal';

@Component({
  selector: 'app-calendar',
  imports: [CalendarMonth, EventTypeLegend, CityLegend, SiteInfoModal],
  template: `
    <div class="max-w-3xl mx-auto p-4 flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-center text-surface-800">Calendario del viaje</h1>
        <button
          type="button"
          class="flex items-center justify-center shrink-0"
          style="width: 2rem; height: 2rem; border-radius: 50%; border: none; cursor: pointer; transition: background-color 0.2s"
          [style.background-color]="showIdeas() ? 'rgba(100,100,100,0.15)' : 'transparent'"
          (click)="showIdeas.set(!showIdeas())"
          [title]="showIdeas() ? 'Ocultar ideas' : 'Mostrar ideas'"
        >
          <i class="pi pi-lightbulb text-base"
            [style.color]="showIdeas() ? 'var(--p-surface-700)' : 'var(--p-surface-400)'"
          ></i>
        </button>
      </div>
      @if (cities().length) {
        <app-city-legend [cities]="cities()" />
      }
      <app-calendar-month [month]="4" [year]="2026" [activities]="visibleActivities()" [cities]="cities()" (selectDate)="openDay($event)" />
      <app-calendar-month [month]="5" [year]="2026" [activities]="visibleActivities()" [cities]="cities()" (selectDate)="openDay($event)" />
      <app-event-type-legend />
    </div>
    @if (selectedDayData(); as data) {
      <app-site-info-modal
        [day]="data.day"
        [cityName]="data.cityName"
        [cityColor]="data.cityColor"
        [citySlug]="data.citySlug"
        (close)="closeDay()"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarPage {
  readonly itineraryResource = httpResource<CityBlock[]>(() => '/api/itinerary');

  readonly selectedDate = signal<string | null>(null);
  readonly showIdeas    = signal(false);

  readonly cities = computed((): City[] =>
    (this.itineraryResource.value() ?? []).map(block => block.city)
  );

  readonly selectedDayData = computed(() => {
    const date = this.selectedDate();
    if (!date) return null;
    const blocks = this.itineraryResource.value() ?? [];
    for (const block of blocks) {
      for (const day of block.days) {
        if (day.date === date) {
          return {
            day,
            cityName: block.city.name,
            cityColor: block.city.color,
            citySlug: block.city.slug,
          };
        }
      }
    }
    return null;
  });

  readonly allActivities = computed((): Array<{ date: string; description: string; tipo: ActivityTipo; tag: string; confirmed: boolean; cityColor: string }> => {
    const blocks = this.itineraryResource.value() ?? [];
    const result: Array<{ date: string; description: string; tipo: ActivityTipo; tag: string; confirmed: boolean; cityColor: string }> = [];
    for (const block of blocks) {
      for (const day of block.days) {
        for (const act of day.activities) {
          result.push({ date: day.date, description: act.description, tipo: act.tipo, tag: act.tag, confirmed: act.confirmed, cityColor: block.city.color });
        }
      }
    }
    return result;
  });

  readonly visibleActivities = computed(() =>
    this.showIdeas() ? this.allActivities() : this.allActivities().filter(a => a.confirmed)
  );

  openDay(date: string): void {
    this.selectedDate.set(date);
  }

  closeDay(): void {
    this.selectedDate.set(null);
  }
}
