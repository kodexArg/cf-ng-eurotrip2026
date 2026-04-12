import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivityTipo } from '../shared/models/activity.model';
import { City, CityBlock, Day } from '../shared/models';
import { VariantService } from '../shared/services/variant.service';
import { CalendarMonth } from './calendar-month/calendar-month';
import { EventTypeLegend } from './event-type-legend/event-type-legend';
import { ItineraryDay } from '../itinerario/itinerary-day/itinerary-day';

@Component({
  selector: 'app-calendar',
  imports: [CalendarMonth, EventTypeLegend, ItineraryDay],
  template: `
    <div class="max-w-3xl mx-auto p-4 flex flex-col gap-6">
      <h1 class="text-2xl font-bold text-center text-surface-800">Calendario del viaje</h1>
      <app-calendar-month [month]="4" [year]="2026" [activities]="confirmedActivities()" [cities]="cities()" (selectDate)="openDay($event)" />
      <app-calendar-month [month]="5" [year]="2026" [activities]="confirmedActivities()" [cities]="cities()" (selectDate)="openDay($event)" />
      <app-event-type-legend />
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
  private readonly variantService = inject(VariantService);
  readonly itineraryResource = httpResource<CityBlock[]>(() => '/api/itinerary');

  readonly selectedDate = signal<string | null>(null);

  readonly cities = computed((): City[] =>
    (this.itineraryResource.value() ?? []).map(block => block.city)
  );

  readonly selectedDayData = computed(() => {
    const date = this.selectedDate();
    if (!date) return null;
    const blocks = this.itineraryResource.value() ?? [];
    const v = this.variantService.variant();
    for (const block of blocks) {
      for (const day of block.days) {
        if (day.date === date && (day.variant === 'both' || day.variant === v)) {
          return {
            day: {
              ...day,
              activities: day.activities.filter(a => a.variant === 'both' || a.variant === v),
            },
            cityName: block.city.name,
            cityColor: block.city.color,
          };
        }
      }
    }
    return null;
  });

  readonly confirmedActivities = computed((): Array<{ date: string; description: string; tipo: ActivityTipo; tag: string; confirmed: boolean }> => {
    const blocks = this.itineraryResource.value() ?? [];
    const v = this.variantService.variant();
    const result: Array<{ date: string; description: string; tipo: ActivityTipo; tag: string; confirmed: boolean }> = [];
    for (const block of blocks) {
      for (const day of block.days) {
        for (const act of day.activities) {
          if (act.variant === 'both' || act.variant === v) {
            result.push({ date: day.date, description: act.description, tipo: act.tipo, tag: act.tag, confirmed: act.confirmed });
          }
        }
      }
    }
    return result;
  });

  openDay(date: string): void {
    this.selectedDate.set(date);
  }

  closeDay(): void {
    this.selectedDate.set(null);
  }
}
