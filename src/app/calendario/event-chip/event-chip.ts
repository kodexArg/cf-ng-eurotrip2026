import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Chip } from 'primeng/chip';
import { ActivityTipo, TIPO_CONFIG } from '../../shared/models/activity.model';

@Component({
  selector: 'app-event-chip',
  imports: [Chip],
  template: `
    <p-chip
      [label]="shortLabel()"
      [style]="chipStyle()"
      [styleClass]="chipClass()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventChip {
  readonly label = input.required<string>();
  readonly tipo = input<ActivityTipo>('visit');
  readonly confirmed = input<boolean>(false);

  readonly shortLabel = computed(() => {
    const l = this.label();
    return l.length > 18 ? l.substring(0, 17) + '…' : l;
  });

  readonly chipStyle = computed(() => {
    const { bg, text } = TIPO_CONFIG[this.tipo()];
    return { 'background-color': bg, color: text };
  });

  readonly chipClass = computed(() =>
    'text-[10px] px-1 py-0 leading-tight' + (this.confirmed() ? ' outline outline-1 outline-white/80' : '')
  );
}
