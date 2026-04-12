import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { City, DayWeather, TripEvent } from '../../shared/models';
import { ItineraryDay, ItineraryDayInput } from '../itinerary-day/itinerary-day';
import { WeatherService } from '../../shared/services/weather.service';

/**
 * One city block: header with city name + date range, then a vertical
 * list of days. Each day is assembled by grouping the city's events by
 * `date`. Events are pre-filtered by the parent — this component only
 * receives rows whose cityIn matches `city.id`.
 */
@Component({
  selector: 'app-itinerary-city',
  imports: [DatePipe, ItineraryDay],
  template: `
    <div class="mb-6">
      <div class="rounded-lg overflow-hidden border border-surface-200">
        <div class="p-4 text-white flex items-start justify-between" [style.background-color]="city().color">
          <div>
            <h2 class="text-xl font-bold m-0 select-none">{{ city().name }}</h2>
            <p class="text-sm m-0 select-none" style="opacity: 0.9">
              @if (firstDay() === lastDay()) {
                {{ firstDay() | date:'d MMM' }} · {{ nightCount() }} noche
              } @else {
                {{ firstDay() | date:'d MMM' }} – {{ lastDay() | date:'d MMM' }} · {{ nightCount() }} noches
              }
            </p>
          </div>
          @if (hasUnconfirmed()) {
            <button
              type="button"
              class="bg-transparent border-none cursor-pointer flex items-center justify-center shrink-0"
              style="width: 2rem; height: 2rem; border-radius: 50%; transition: background-color 0.2s"
              [style.background-color]="showSuggestions() ? 'rgba(255,255,255,0.25)' : 'transparent'"
              (click)="showSuggestions.set(!showSuggestions())"
              [title]="showSuggestions() ? 'Ocultar sugerencias' : 'Mostrar sugerencias'"
            >
              <i class="pi pi-lightbulb text-base"
                [style.color]="showSuggestions() ? '#fff' : 'rgba(255,255,255,0.4)'"
              ></i>
            </button>
          }
        </div>
        <div>
          @for (day of days(); track day.date; let last = $last) {
            <app-itinerary-day
              [day]="day"
              [cities]="allCities()"
              [weather]="getWeatherForDay(day.date)"
              [isLast]="last"
              [showUnconfirmed]="showSuggestions()"
              (openEventInfo)="openEventInfo.emit($event)"
            />
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryCity {
  private readonly weatherService = inject(WeatherService);

  readonly city = input.required<City>();
  readonly allCities = input<readonly City[]>([]);
  readonly events = input.required<TripEvent[]>();
  readonly firstDay = input.required<string>();
  readonly lastDay = input.required<string>();
  readonly nightCount = input.required<number>();
  readonly openEventInfo = output<TripEvent>();

  readonly showSuggestions = signal(false);

  /**
   * Build the day-by-day view by bucketing events on their date.
   * Dates between firstDay..lastDay are always emitted, even if the
   * bucket is empty — it keeps the calendar grid consistent.
   */
  readonly days = computed((): ItineraryDayInput[] => {
    const events = this.events();
    const byDate = new Map<string, TripEvent[]>();
    for (const e of events) {
      const list = byDate.get(e.date) ?? [];
      list.push(e);
      byDate.set(e.date, list);
    }

    const out: ItineraryDayInput[] = [];
    const start = this.firstDay();
    const end = this.lastDay();
    for (const date of expandRange(start, end)) {
      out.push({ date, events: byDate.get(date) ?? [], cityId: this.city().id });
    }
    return out;
  });

  readonly hasUnconfirmed = computed(() =>
    this.events().some((e) => !e.confirmed)
  );

  readonly cityWeather = computed(() => this.weatherService.getWeather(this.city().slug)());

  readonly filteredForecast = computed((): DayWeather[] => {
    const weather = this.cityWeather();
    if (!weather) return [];
    const first = this.firstDay();
    const last = this.lastDay();
    return weather.daily.filter((d) => d.date >= first && d.date <= last);
  });

  getWeatherForDay(date: string): DayWeather | null {
    return this.filteredForecast()?.find((w) => w.date === date) ?? null;
  }
}

/** Emit every YYYY-MM-DD between start and end inclusive. */
function expandRange(start: string, end: string): string[] {
  const out: string[] = [];
  const startDate = new Date(start + 'T00:00:00Z');
  const endDate = new Date(end + 'T00:00:00Z');
  const cur = new Date(startDate);
  while (cur.getTime() <= endDate.getTime()) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}
