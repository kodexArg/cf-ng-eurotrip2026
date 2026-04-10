import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TransportLeg } from '../../shared/models';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';

@Component({
  selector: 'app-transport-inline',
  standalone: true,
  imports: [ConfirmedBadge],
  template: `
    <div class="flex items-center gap-3 py-3 px-4 my-3 rounded-lg border"
         style="background-color: var(--p-surface-50); border-color: var(--p-surface-200)">
      <i [class]="modeIcon()" style="color: var(--p-primary-color); font-size: 1.125rem"></i>
      <div class="flex-1">
        <span class="text-sm font-medium" style="color: var(--p-surface-700)">{{ leg().label }}</span>
        @if (leg().duration) {
          <span class="text-xs ml-2" style="color: var(--p-surface-400)">{{ leg().duration }}</span>
        }
      </div>
      @if (leg().costHint) {
        <span class="text-xs" style="color: var(--p-surface-500)">{{ leg().costHint }}</span>
      }
      @if (leg().confirmed) {
        <app-confirmed-badge />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportInline {
  readonly leg = input.required<TransportLeg>();

  readonly modeIcon = computed(() => {
    const icons: Record<string, string> = {
      flight: 'pi pi-send',
      train: 'pi pi-arrow-right-arrow-left',
      daytrip: 'pi pi-map-marker',
      ferry: 'pi pi-compass',
    };
    return icons[this.leg().mode] ?? 'pi pi-car';
  });
}
