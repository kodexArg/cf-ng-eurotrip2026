import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ActivityTipo, TIPO_CONFIG } from '../../shared/models/activity.model';

@Component({
  selector: 'app-event-chip',
  imports: [],
  template: `
    <span
      class="block truncate rounded text-xs leading-none px-1 py-0.5 w-full"
      [class.opacity-60]="!confirmed()"
      [style]="chipStyle()"
    >{{ label() }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventChip {
  readonly label     = input.required<string>();
  readonly tipo      = input<ActivityTipo>('visit');
  readonly confirmed = input<boolean>(false);

  readonly chipStyle = computed(() => {
    const { bg, text } = TIPO_CONFIG[this.tipo()];
    return { 'background-color': bg, color: text };
  });
}
