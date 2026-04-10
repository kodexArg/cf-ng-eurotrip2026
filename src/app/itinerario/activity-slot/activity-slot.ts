import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { Activity } from '../../shared/models';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';

@Component({
  selector: 'app-activity-slot',
  imports: [Tag, ConfirmedBadge],
  template: `
    <div class="flex items-start gap-2 py-1">
      <p-tag [value]="slotLabel()" severity="secondary" styleClass="text-xs min-w-16" />
      <div class="flex-1">
        <span class="text-sm" style="color: var(--p-surface-700)">{{ activity().description }}</span>
        @if (activity().costHint) {
          <span class="text-xs ml-2" style="color: var(--p-surface-400)">{{ activity().costHint }}</span>
        }
      </div>
      @if (activity().confirmed) {
        <app-confirmed-badge />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitySlot {
  readonly activity = input.required<Activity>();

  readonly slotLabel = computed(() => {
    const labels: Record<string, string> = {
      morning: 'Mañana',
      afternoon: 'Tarde',
      evening: 'Noche',
      'all-day': 'Todo el día',
    };
    return labels[this.activity().timeSlot] ?? this.activity().timeSlot;
  });
}
