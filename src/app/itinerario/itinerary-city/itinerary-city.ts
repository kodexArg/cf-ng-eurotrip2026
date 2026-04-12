import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Activity, City, Day, DayWeather } from '../../shared/models';
import { ItineraryDay } from '../itinerary-day/itinerary-day';
import { WeatherService } from '../../shared/services/weather.service';

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
          @for (day of days(); track day.id; let last = $last) {
            <app-itinerary-day
              [day]="day"
              [weather]="getWeatherForDay(day.date)"
              [isLast]="last"
              [showUnconfirmed]="showSuggestions()"
              (openActivityInfo)="openActivityInfo.emit({ activity: $event, day: day })"
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
  readonly days = input.required<Day[]>();
  readonly firstDay = input.required<string>();
  readonly lastDay = input.required<string>();
  readonly nightCount = input.required<number>();
  readonly openActivityInfo = output<{ activity: Activity; day: Day }>();

  readonly showSuggestions = signal(false);

  readonly hasUnconfirmed = computed(() =>
    this.days().some(day => day.activities.some(a => !a.confirmed))
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
    return this.filteredForecast()?.find(w => w.date === date) ?? null;
  }
}
