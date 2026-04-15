import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EstadiaEvent } from '../../../shared/models';

/**
 * Renders the accommodation detail section inside an event row.
 *
 * Displays accommodation name, address, check-in/check-out times, booking
 * platform, and booking reference. All fields except `accommodation` are
 * optional and conditionally rendered.
 *
 * @remarks
 * Variants:
 * - Full: accommodation + address + checkinTime + checkoutTime + platform + bookingRef
 * - Minimal: accommodation name only (all optionals null)
 *
 * Inputs:
 * - `estadia` (required) — narrowed EstadiaEvent (use isEstadia guard before passing)
 */
@Component({
  selector: 'app-estadia-detail',
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
        <i class="pi pi-home" style="font-size: 10px"></i>
        <span class="font-medium">{{ estadia().accommodation }}</span>
      </div>
      <div
        class="flex flex-col gap-1 mt-1.5"
        style="color: var(--p-surface-600)"
      >
        @if (estadia().address) {
          <div>
            <span style="color: var(--p-surface-400)">Dirección:</span>
            {{ estadia().address }}
          </div>
        }
        @if (estadia().checkinTime || estadia().checkoutTime) {
          <div class="flex gap-3">
            @if (estadia().checkinTime) {
              <span>
                <span style="color: var(--p-surface-400)">Check-in:</span>
                {{ estadia().checkinTime }}
              </span>
            }
            @if (estadia().checkoutTime) {
              <span>
                <span style="color: var(--p-surface-400)">Check-out:</span>
                {{ estadia().checkoutTime }}
              </span>
            }
          </div>
        }
        @if (estadia().platform) {
          <div>
            <span style="color: var(--p-surface-400)">Plataforma:</span>
            {{ estadia().platform }}
          </div>
        }
        @if (estadia().bookingRef) {
          <div>
            <span style="color: var(--p-surface-400)">Reserva:</span>
            {{ estadia().bookingRef }}
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadiaDetail {
  readonly estadia = input.required<EstadiaEvent>();
}
