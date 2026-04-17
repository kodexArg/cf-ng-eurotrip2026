import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../shared/icon/icon';

/**
 * Fila de información reutilizable: ícono + texto alineados.
 * Base visual para actividades, clima, eventos y cualquier entrada del itinerario.
 *
 * Soporta dos familias de iconos vía <app-icon>:
 *  - PrimeIcons: prefijo `pi-` (ej. `pi-heart`)
 *  - Material Symbols Outlined: prefijo `ms-` (ej. `ms-flight_takeoff`)
 */
@Component({
  selector: 'app-info-row',
  standalone: true,
  imports: [AppIcon],
  template: `
    <div class="flex items-center gap-2 py-0.5">
      <span class="inline-flex items-center justify-center shrink-0 select-none w-5" style="height: 1.25rem">
        <app-icon [icon]="icon()" [color]="iconColor()" size="1rem" />
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
