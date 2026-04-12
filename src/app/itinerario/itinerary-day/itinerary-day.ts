import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Tag } from 'primeng/tag';
import { Day } from '../../shared/models';
import { ActivitySlot } from '../activity-slot/activity-slot';

@Component({
  selector: 'app-itinerary-day',
  imports: [DatePipe, TitleCasePipe, Tag, ActivitySlot],
  template: `
    <div class="flex" [id]="'day-' + day().date">
      <!-- Date sidebar -->
      <div class="w-16 shrink-0 flex flex-col items-center justify-center py-3"
           style="background-color: var(--p-surface-50); border-right: 1px solid var(--p-surface-200)">
        <span class="text-xs uppercase tracking-wide" style="color: var(--p-surface-400)">
          {{ day().date | date:'EEE' | titlecase }}
        </span>
        <span class="text-2xl font-bold leading-none mt-0.5" style="color: var(--p-surface-700)">
          {{ day().date | date:'d' }}
        </span>
      </div>

      <!-- Activities panel -->
      <div class="flex-1 flex flex-col py-2 px-3 min-w-0">
        @if (day().label) {
          <div class="mb-1">
            <p-tag [value]="day().label!" severity="secondary" styleClass="text-xs" />
          </div>
        }
        <div class="flex flex-col gap-1 flex-1">
          @for (activity of day().activities; track activity.id) {
            <app-activity-slot [activity]="activity" />
          }
        </div>
        @if (costHints().length) {
          <div class="flex justify-end mt-1">
            <span class="text-xs" style="color: var(--p-surface-400)">
              {{ costHints().join(' \u00b7 ') }}
            </span>
          </div>
        }
      </div>
    </div>
    @if (!isLast()) {
      <div class="h-px" style="background: linear-gradient(to right, transparent, var(--p-surface-200), transparent)"></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryDay {
  readonly day = input.required<Day>();
  readonly isLast = input(false);

  protected readonly costHints = computed(() =>
    this.day().activities
      .map(a => a.costHint)
      .filter((hint): hint is string => hint !== null && hint !== '')
  );
}
