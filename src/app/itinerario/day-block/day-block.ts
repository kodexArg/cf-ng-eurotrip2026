import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Tag } from 'primeng/tag';
import { Day } from '../../shared/models';
import { ActivitySlot } from '../activity-slot/activity-slot';

@Component({
  selector: 'app-day-block',
  imports: [DatePipe, TitleCasePipe, Tag, ActivitySlot],
  template: `
    <div class="p-3" [id]="'day-' + day().date">
      <div class="flex items-center gap-2 mb-2">
        <span class="font-semibold" style="color: var(--p-surface-800)">
          {{ day().date | date:'EEEE d' | titlecase }}
        </span>
        @if (day().label) {
          <p-tag [value]="day().label!" severity="secondary" />
        }
      </div>
      @for (activity of day().activities; track activity.id) {
        <app-activity-slot [activity]="activity" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayBlock {
  readonly day = input.required<Day>();
}
