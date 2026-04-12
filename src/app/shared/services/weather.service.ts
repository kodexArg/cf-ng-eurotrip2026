import { Injectable, Signal, WritableSignal, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CityWeather } from '../models';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, WritableSignal<CityWeather | null>>();

  getWeather(citySlug: string): Signal<CityWeather | null> {
    if (!this.cache.has(citySlug)) {
      const sig = signal<CityWeather | null>(null);
      this.cache.set(citySlug, sig);
      firstValueFrom(this.http.get<CityWeather>(`/api/weather/${citySlug}`))
        .then(data => sig.set(data))
        .catch(() => {}); // silently fail — weather is non-critical
    }
    return this.cache.get(citySlug)!.asReadonly();
  }
}
