import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { City, Day } from '../../shared/models';
import { ItineraryDay } from '../itinerary-day/itinerary-day';

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
            <app-itinerary-day [day]="day" [isLast]="last" />
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryCity {
  readonly city = input.required<City>();
  readonly days = input.required<Day[]>();
  readonly firstDay = input.required<string>();
  readonly lastDay = input.required<string>();
  readonly nightCount = input.required<number>();
}
