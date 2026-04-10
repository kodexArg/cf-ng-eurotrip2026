import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { City, Day } from '../../shared/models';
import { DayBlock } from '../day-block/day-block';

@Component({
  selector: 'app-city-block',
  imports: [DatePipe, DayBlock],
  template: `
    <div class="mb-6">
      <div class="rounded-lg overflow-hidden border border-surface-200">
        <div class="p-4 text-white" [style.background-color]="city().color">
          <h2 class="text-xl font-bold m-0">{{ city().name }}</h2>
          <p class="text-sm m-0" style="opacity: 0.9">
            {{ city().arrival | date:'d MMM' }} – {{ city().departure | date:'d MMM' }} · {{ city().nights }} noches
          </p>
        </div>
        <div class="divide-y divide-surface-100">
          @for (day of days(); track day.id) {
            <app-day-block [day]="day" />
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityBlock {
  readonly city = input.required<City>();
  readonly days = input.required<Day[]>();
}
