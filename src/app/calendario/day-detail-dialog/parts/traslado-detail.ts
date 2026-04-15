import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TrasladoEvent } from '../../../shared/models';

/**
 * Renders the traslado-specific detail section inside an event row.
 *
 * Shows company, vehicle code, fare class, seat assignment, and computed
 * duration. Expects a pre-resolved route string from the parent so this
 * component stays free of city-lookup logic.
 *
 * @remarks
 * Variants:
 * - Full: all optional fields present (company, vehicleCode, fare, seat, durationMin)
 * - Minimal: only route string available — grid renders no rows
 *
 * Inputs:
 * - `traslado` (required) — narrowed TrasladoEvent (use isTraslado guard before passing)
 * - `route` (required) — precomputed "CityA → CityB" string from the parent
 */
@Component({
  selector: 'app-traslado-detail',
  standalone: true,
  imports: [],
  template: `
    <div
      class="mt-2 rounded p-2 text-xs"
      style="background-color: rgba(0,0,0,0.03)"
    >
      <div
        class="flex items-center gap-1.5"
        style="color: var(--p-surface-700)"
      >
        <i class="pi pi-send" style="font-size: 10px"></i>
        <span class="font-medium">{{ route() }}</span>
      </div>
      <div
        class="grid grid-cols-2 gap-x-3 gap-y-1 mt-1.5"
        style="color: var(--p-surface-600)"
      >
        @if (traslado().company) {
          <div>
            <span style="color: var(--p-surface-400)">Compañía:</span>
            {{ traslado().company }}
          </div>
        }
        @if (traslado().vehicleCode) {
          <div>
            <span style="color: var(--p-surface-400)">Código:</span>
            {{ traslado().vehicleCode }}
          </div>
        }
        @if (traslado().fare) {
          <div>
            <span style="color: var(--p-surface-400)">Tarifa:</span>
            {{ traslado().fare }}
          </div>
        }
        @if (traslado().seat) {
          <div>
            <span style="color: var(--p-surface-400)">Asiento:</span>
            {{ traslado().seat }}
          </div>
        }
        @if (traslado().durationMin) {
          <div>
            <span style="color: var(--p-surface-400)">Duración:</span>
            {{ formatDuration(traslado().durationMin!) }}
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrasladoDetail {
  readonly traslado = input.required<TrasladoEvent>();
  readonly route = input.required<string>();

  protected formatDuration(min: number): string {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
}
