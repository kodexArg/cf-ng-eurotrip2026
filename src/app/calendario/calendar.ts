import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ActivityTipo } from '../shared/models/activity.model';
import { City, TripEvent, isHito, isTraslado, isEstadia } from '../shared/models';
import { CalendarMonth } from './calendar-month/calendar-month';
import { EventTypeLegend } from './event-type-legend/event-type-legend';
import { CityLegend } from './city-legend/city-legend';
import { DayDetailDialog } from './day-detail-dialog/day-detail-dialog';
import { getTravelGradientFromCities } from './calendar-utils';

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

const HITO_SUBTYPE_TO_TIPO: Record<string, ActivityTipo> = {
  visit: 'visit',
  food: 'food',
  leisure: 'leisure',
  event: 'event',
  hotel: 'hotel',
  transfer: 'transport',
};

/**
 * Calendar page — month grid showing all confirmed (and optionally
 * planned) trip events as category chips.
 *
 * Includes ALL event types: `hito`, `traslado` (flights, trains,
 * transfers), and `estadia` (lodging). The legacy `CalendarActivity`
 * shape is still used by calendar-month / calendar-day / event-chip for
 * the visible chips, but the page also threads the raw `TripEvent[]`
 * down so the day cell can show a hover popup and a click-to-open
 * detail dialog with full info.
 */
@Component({
  selector: 'app-calendar',
  imports: [CalendarMonth, EventTypeLegend, CityLegend, DayDetailDialog],
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
      <app-calendar-month
        [month]="4"
        [year]="2026"
        [activities]="visibleActivities()"
        [eventsByDay]="visibleEventsByDay()"
        [cities]="cities()"
        (selectDate)="openDay($event)"
      />
      <app-calendar-month
        [month]="5"
        [year]="2026"
        [activities]="visibleActivities()"
        [eventsByDay]="visibleEventsByDay()"
        [cities]="cities()"
        (selectDate)="openDay($event)"
      />
      <app-event-type-legend />
    </div>

    <app-day-detail-dialog
      [visible]="!!selectedDate()"
      [date]="selectedDate()"
      [events]="selectedDayEvents()"
      [cities]="cities()"
      [cityName]="selectedDayCityName()"
      [cityColor]="selectedDayCityColor()"
      [isTravelDay]="selectedDayIsTravel()"
      (close)="closeDay()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarPage {
  readonly itineraryResource = httpResource<ItineraryPayload>(() => '/api/itinerary');

  readonly selectedDate = signal<string | null>(null);
  readonly showIdeas    = signal(false);

  readonly cities = computed((): City[] => this.itineraryResource.value()?.cities ?? []);
  readonly events = computed((): TripEvent[] => this.itineraryResource.value()?.events ?? []);

  /**
   * Convert each event into a flat `CalendarActivity` so existing chip
   * components keep working. Hitos use their subtype-derived tipo;
   * traslados render as `transport` chips; estadías as `hotel` chips.
   */
  readonly allActivities = computed((): CalendarActivity[] => {
    const cityColor = new Map(this.cities().map((c) => [c.id, c.color]));
    const result: CalendarActivity[] = [];
    for (const e of this.events()) {
      let tipo: ActivityTipo;
      let tag: string;
      let description: string;
      if (isHito(e)) {
        tipo = HITO_SUBTYPE_TO_TIPO[e.subtype] ?? 'visit';
        tag = e.title;
        description = e.description ?? e.title;
      } else if (isTraslado(e)) {
        tipo = 'transport';
        tag = e.title;
        description = e.description ?? e.title;
      } else if (isEstadia(e)) {
        tipo = 'hotel';
        tag = e.title;
        description = e.description ?? e.title;
      } else {
        continue;
      }
      result.push({
        date: e.date,
        description,
        tipo,
        tag,
        confirmed: e.confirmed,
        cityColor: cityColor.get(e.cityIn) ?? 'var(--p-surface-400)',
      });
    }
    return result;
  });

  readonly visibleActivities = computed(() =>
    this.showIdeas() ? this.allActivities() : this.allActivities().filter((a) => a.confirmed)
  );

  /** Map date → raw TripEvent[] for hover popup & click dialog. */
  readonly visibleEventsByDay = computed((): Map<string, TripEvent[]> => {
    const showAll = this.showIdeas();
    const map = new Map<string, TripEvent[]>();
    for (const e of this.events()) {
      if (!showAll && !e.confirmed) continue;
      const list = map.get(e.date);
      if (list) list.push(e);
      else map.set(e.date, [e]);
    }
    return map;
  });

  readonly selectedDayEvents = computed((): TripEvent[] => {
    const date = this.selectedDate();
    if (!date) return [];
    return this.visibleEventsByDay().get(date) ?? [];
  });

  readonly selectedDayCity = computed((): City | null => {
    const date = this.selectedDate();
    if (!date) return null;
    // Prefer the city whose [arrival, departure] interval contains the day.
    for (const c of this.cities()) {
      if (date >= c.arrival && date <= c.departure) return c;
    }
    // Fallback: dominant cityIn from events of the day.
    const evs = this.selectedDayEvents();
    if (evs.length === 0) return null;
    const counts = new Map<string, number>();
    for (const e of evs) counts.set(e.cityIn, (counts.get(e.cityIn) ?? 0) + 1);
    let bestId = evs[0].cityIn;
    let bestN = -1;
    for (const [id, n] of counts) {
      if (n > bestN) {
        bestN = n;
        bestId = id;
      }
    }
    return this.cities().find((c) => c.id === bestId) ?? null;
  });

  readonly selectedDayCityName = computed(() => this.selectedDayCity()?.name ?? '');
  readonly selectedDayCityColor = computed(
    () => this.selectedDayCity()?.color ?? 'var(--p-surface-500)'
  );

  readonly selectedDayIsTravel = computed(() => {
    const date = this.selectedDate();
    if (!date) return false;
    return getTravelGradientFromCities(date, this.cities()) !== null;
  });

  openDay(date: string): void {
    this.selectedDate.set(date);
  }

  closeDay(): void {
    this.selectedDate.set(null);
  }
}
