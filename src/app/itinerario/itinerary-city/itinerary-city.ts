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
          @if (cityWeather()) {
            <div class="flex flex-wrap gap-x-3 gap-y-1 mt-2" style="opacity: 0.85">
              @for (day of filteredForecast(); track day.date) {
                <span class="text-xs flex items-center gap-1">
                  {{ wmoEmoji(day.weatherCode) }}
                  {{ day.date | date:'d MMM' }}
                  {{ day.tempMin }}°–{{ day.tempMax }}°
                </span>
              }
            </div>
          }
        </div>
        <div>
          @for (day of days(); track day.id; let last = $last) {
            <app-itinerary-day [day]="day" [isLast]="last" />
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

  wmoEmoji(code: number): string {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '🌨️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code === 85 || code === 86) return '🌨️';
    if (code === 95 || code === 96 || code === 99) return '⛈️';
    return '🌡️';
  }
}
