import { Injectable, Signal, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CityWeather } from '../models';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, Signal<CityWeather | null>>();

  getWeather(citySlug: string): Signal<CityWeather | null> {
    if (this.cache.has(citySlug)) {
      return this.cache.get(citySlug)!;
    }

    const weatherSignal = signal<CityWeather | null>(null);
    this.cache.set(citySlug, weatherSignal);

    this.http
      .get<CityWeather>(`/api/weather/${citySlug}`)
      .subscribe({
        next: (data) => weatherSignal.set(data),
        error: () => weatherSignal.set(null),
      });

    return weatherSignal;
  }
}
