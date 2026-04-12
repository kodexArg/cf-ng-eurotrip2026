import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ActivityTipo, TIPO_CONFIG } from '../../shared/models/activity.model';

@Component({
  selector: 'app-tipo-chip',
  imports: [],
  template: `
    <span
      class="text-xs rounded px-1 py-0.5 leading-none"
      [style]="chipStyle()"
    >{{ label() }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TipoChip {
  readonly tipo = input.required<ActivityTipo>();

  readonly label = computed(() => TIPO_CONFIG[this.tipo()].label);

  readonly chipStyle = computed(() => {
    const { bg, text } = TIPO_CONFIG[this.tipo()];
    return { 'background-color': bg, color: text };
  });
}
