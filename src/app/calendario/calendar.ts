import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ActivityTipo } from '../shared/models/activity.model';
import { City, CityBlock } from '../shared/models';
import { CalendarMonth } from './calendar-month/calendar-month';
import { EventTypeLegend } from './event-type-legend/event-type-legend';
import { ItineraryDay } from '../itinerario/itinerary-day/itinerary-day';

@Component({
  selector: 'app-calendar',
  imports: [CalendarMonth, EventTypeLegend, ItineraryDay],
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
      <app-event-type-legend />
      <app-calendar-month [month]="4" [year]="2026" [activities]="visibleActivities()" [cities]="cities()" (selectDate)="openDay($event)" />
      <app-calendar-month [month]="5" [year]="2026" [activities]="visibleActivities()" [cities]="cities()" (selectDate)="openDay($event)" />
    </div>
    @if (selectedDayData(); as data) {
      <div
        class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        (click)="closeDay()"
      >
        <div
          class="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center justify-between px-4 pt-4">
            <span class="text-sm font-medium" [style.color]="data.cityColor">{{ data.cityName }}</span>
            <button class="text-surface-400 hover:text-surface-700 text-xl leading-none" (click)="closeDay()">✕</button>
          </div>
          <app-itinerary-day [day]="data.day" [isLast]="true" />
        </div>
      </div>
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
