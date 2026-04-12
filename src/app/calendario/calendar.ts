import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ActivityTipo } from '../shared/models/activity.model';
import { City, TripEvent, isHito } from '../shared/models';
import { CalendarMonth } from './calendar-month/calendar-month';
import { EventTypeLegend } from './event-type-legend/event-type-legend';
import { CityLegend } from './city-legend/city-legend';
import { SiteInfoModal } from '../shared/site-info-modal/site-info-modal';

interface ItineraryPayload {
  cities: City[];
  events: TripEvent[];
}

interface CalendarActivity {
  date: string;
  description: string;
  tipo: ActivityTipo;
  tag: string;
  confirmed: boolean;
  cityColor: string;
}

const SUBTYPE_TO_TIPO: Record<string, ActivityTipo> = {
  visit: 'visit',
  food: 'food',
  leisure: 'leisure',
  event: 'event',
  hotel: 'hotel',
  transfer: 'transport',
};

/**
 * Calendar page — month grid showing hito events as category chips.
 *
 * Kept in legacy shape (`CalendarActivity`) so calendar-month /
 * calendar-day / event-chip don't need to change. The API migration
 * only shows up here: we pull `{cities, events}` from /api/itinerary
 * and convert each `hito` event into the flat descriptor the inner
 * components expect.
 */
@Component({
  selector: 'app-calendar',
  imports: [CalendarMonth, EventTypeLegend, CityLegend, SiteInfoModal],
  template: `
    <div class="max-w-3xl mx-auto p-4 flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-center text-surface-800 select-none">Calendario del viaje</h1>
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
        [events]="data.events"
        [cities]="cities()"
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
  readonly itineraryResource = httpResource<ItineraryPayload>(() => '/api/itinerary');

  readonly selectedDate = signal<string | null>(null);
  readonly showIdeas    = signal(false);

  readonly cities = computed((): City[] => this.itineraryResource.value()?.cities ?? []);
  readonly events = computed((): TripEvent[] => this.itineraryResource.value()?.events ?? []);

  readonly allActivities = computed((): CalendarActivity[] => {
    const cityColor = new Map(this.cities().map((c) => [c.id, c.color]));
    const result: CalendarActivity[] = [];
    for (const e of this.events()) {
      if (!isHito(e)) continue;
      const tipo = SUBTYPE_TO_TIPO[e.subtype] ?? 'visit';
      result.push({
        date: e.date,
        description: e.description ?? e.title,
        tipo,
        tag: e.title,
        confirmed: e.confirmed,
        cityColor: cityColor.get(e.cityIn) ?? 'var(--p-surface-400)',
      });
    }
    return result;
  });

  readonly visibleActivities = computed(() =>
    this.showIdeas() ? this.allActivities() : this.allActivities().filter((a) => a.confirmed)
  );

  readonly selectedDayData = computed(() => {
    const date = this.selectedDate();
    if (!date) return null;
    const dayEvents = this.events().filter((e) => e.date === date);
    if (dayEvents.length === 0) return null;
    // Pick the dominant city for this date (the one with the most events,
    // falling back to the first one).
    const countByCity = new Map<string, number>();
    for (const e of dayEvents) {
      countByCity.set(e.cityIn, (countByCity.get(e.cityIn) ?? 0) + 1);
    }
    let cityId = dayEvents[0].cityIn;
    let best = -1;
    for (const [id, count] of countByCity) {
      if (count > best) {
        best = count;
        cityId = id;
      }
    }
    const city = this.cities().find((c) => c.id === cityId);
    if (!city) return null;
    return {
      events: dayEvents.filter((e) => e.cityIn === cityId),
      cityName: city.name,
      cityColor: city.color,
      citySlug: city.slug,
    };
  });

  openDay(date: string): void {
    this.selectedDate.set(date);
  }

  closeDay(): void {
    this.selectedDate.set(null);
  }
}
