import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ActivityTipo, TIPO_CONFIG } from '../../shared/models/activity.model';

/**
 * Compact inline badge for a single calendar event.
 *
 * @remarks
 * Variants via inputs:
 * - `tipo`: activity type that drives background and text colors from TIPO_CONFIG.
 * - `confirmed`: when false the chip renders at reduced opacity to signal a tentative event.
 * - `label`: display text rendered inside the badge.
 */
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
  readonly done      = input<boolean>(false);

  readonly chipStyle = computed(() => {
    const { bg, text } = TIPO_CONFIG[this.tipo()];
    if (this.done()) {
      return { 'background-color': 'rgba(245,158,11,0.15)', color: '#b45309', 'border': '1px solid rgba(245,158,11,0.4)' };
    }
    if (this.confirmed()) {
      return { 'background-color': 'rgba(255,255,255,0.9)', color: text };
    }
    return { 'background-color': bg, color: text };
  });
}
