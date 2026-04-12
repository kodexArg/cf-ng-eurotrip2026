import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { City, Day, DayWeather } from '../../shared/models';
import { ItineraryDay } from '../itinerary-day/itinerary-day';
import { WeatherService } from '../../shared/services/weather.service';

@Component({
  selector: 'app-itinerary-city',
  imports: [DatePipe, ItineraryDay],
  template: `
    <div class="mb-6">
      <div class="rounded-lg overflow-hidden border border-surface-200">
        <div class="p-4 text-white" [style.background-color]="city().color">
          <h2 class="text-xl font-bold m-0">{{ city().name }}</h2>
          <p class="text-sm m-0" style="opacity: 0.9">
            @if (firstDay() === lastDay()) {
              {{ firstDay() | date:'d MMM' }} · {{ nightCount() }} noche
            } @else {
              {{ firstDay() | date:'d MMM' }} – {{ lastDay() | date:'d MMM' }} · {{ nightCount() }} noches
            }
          </p>
        </div>
        <div>
          @for (day of days(); track day.id; let last = $last) {
            <app-itinerary-day [day]="day" [weather]="getWeatherForDay(day.date)" [isLast]="last" />
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
  readonly days = input.required<Day[]>();
  readonly firstDay = input.required<string>();
  readonly lastDay = input.required<string>();
  readonly nightCount = input.required<number>();

  readonly cityWeather = computed(() => this.weatherService.getWeather(this.city().slug)());

  readonly filteredForecast = computed((): DayWeather[] => {
    const weather = this.cityWeather();
    if (!weather) return [];
    const first = this.firstDay();
    const last = this.lastDay();
    return weather.daily.filter((d) => d.date >= first && d.date <= last);
  });

  getWeatherForDay(date: string): DayWeather | null {
    return this.filteredForecast()?.find(w => w.date === date) ?? null;
  }
}
