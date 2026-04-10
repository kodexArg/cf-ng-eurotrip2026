import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Chip } from 'primeng/chip';

@Component({
  selector: 'app-event-chip',
  standalone: true,
  imports: [Chip],
  template: `
    <p-chip
      [label]="shortLabel()"
      [styleClass]="'text-[10px] px-1 py-0 leading-tight ' + (confirmed() ? 'bg-green-600 text-white' : 'bg-white/80 text-surface-700')"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventChip {
  readonly label = input.required<string>();
  readonly confirmed = input<boolean>(false);

  readonly shortLabel = computed(() => {
    const l = this.label();
    return l.length > 20 ? l.substring(0, 18) + '…' : l;
  });
}
