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
    const { text } = TIPO_CONFIG[this.tipo()];
    if (this.done()) {
      return { 'background-color': '#ffffff', color: '#b45309', 'border': '1px solid rgba(245,158,11,0.55)' };
    }
    // Solid white chip with a subtle type-colored border so it stays legible
    // on top of strongly-colored city cells (matches the accommodation chips).
    return {
      'background-color': '#ffffff',
      color: text,
      border: `1px solid ${text}33`,
      'box-shadow': '0 1px 1px rgba(0,0,0,0.08)',
    };
  });
}
