import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Fila de información reutilizable: ícono + texto alineados.
 * Base visual para actividades, clima, eventos y cualquier entrada del itinerario.
 */
@Component({
  selector: 'app-info-row',
  template: `
    <div class="flex items-start gap-2 py-0.5">
      <span class="inline-flex items-center shrink-0 select-none" style="height: 1.25rem">
        <i [class]="'pi ' + icon() + ' text-sm'" [style.color]="iconColor()"></i>
      </span>
      <span class="text-sm leading-5 flex-1 min-w-0" [style.color]="textColor()">{{ text() }}</span>
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoRow {
  readonly icon = input.required<string>();
  readonly iconColor = input<string>('var(--p-surface-500)');
  readonly text = input.required<string>();
  readonly textColor = input<string>('var(--p-surface-700)');
}
