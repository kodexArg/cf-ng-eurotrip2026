import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { City, TripEvent, isEstadia, isHito, isTraslado, timeOf } from '../../shared/models';
import { ConfirmedBadge } from '../../shared/confirmed-badge/confirmed-badge';
import { InfoRow } from '../info-row/info-row';
import { TrasladoPhrasePipe } from './traslado-phrase.pipe';

/**
 * Unified slot for rendering one row of any TripEvent type.
 * Branches on `event.type` to compose the right copy. All three
 * variants share the base InfoRow visual.
 *
 * In `compact` mode (used by the vertical stripe between cities)
 * the slot drops extra padding and decoration.
 */
@Component({
  selector: 'app-event-slot',
  imports: [InfoRow, ConfirmedBadge, TrasladoPhrasePipe],
  template: `
    @switch (event().type) {
      @case ('hito') {
        @if (asHito(); as h) {
          <app-info-row
            [icon]="h.icon"
            [iconColor]="iconColor()"
            [text]="h.title"
            [class.opacity-60]="!h.confirmed"
          >
            @if (h.cardId) {
              <button
                type="button"
                class="pi pi-lightbulb text-xs opacity-60 hover:opacity-100 transition-opacity ml-1 bg-transparent border-none cursor-pointer"
                style="height: 1.25rem; color: var(--p-primary-color)"
                (click)="openInfo.emit()"
                title="Ver informacion del sitio"
              ></button>
            }
            @if (h.confirmed) {
              <app-confirmed-badge />
            }
          </app-info-row>
        }
      }
      @case ('traslado') {
        @if (asTraslado(); as t) {
          <app-info-row
            [icon]="t.icon"
            [iconColor]="iconColor()"
            [text]="t | trasladoPhrase:cities()"
            [class.opacity-60]="!t.confirmed"
          >
            @if (t.fare || t.vehicleCode) {
              <span class="text-xs shrink-0 ml-1 select-none" style="color: var(--p-surface-500)">
                {{ t.fare || t.vehicleCode }}
              </span>
            }
            @if (t.confirmed) {
              <app-confirmed-badge />
            }
          </app-info-row>
        }
      }
      @case ('estadia') {
        @if (asEstadia(); as s) {
          <app-info-row
            [icon]="s.icon"
            [iconColor]="iconColor()"
            [text]="stayText()"
            [class.opacity-60]="!s.confirmed"
          >
            @if (s.confirmed) {
              <app-confirmed-badge />
            }
          </app-info-row>
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSlot {
  readonly event = input.required<TripEvent>();
  readonly cities = input<readonly City[]>([]);
  /** When set to 'checkout', estadía rows render as check-out instead of check-in. */
  readonly stayMode = input<'checkin' | 'checkout'>('checkin');
  readonly compact = input(false);

  readonly openInfo = output<void>();

  protected readonly asHito = computed(() => {
    const e = this.event();
    return isHito(e) ? e : null;
  });

  protected readonly asTraslado = computed(() => {
    const e = this.event();
    return isTraslado(e) ? e : null;
  });

  protected readonly asEstadia = computed(() => {
    const e = this.event();
    return isEstadia(e) ? e : null;
  });

  protected readonly iconColor = computed(() => 'var(--p-surface-600)');

  protected readonly stayText = computed((): string => {
    const s = this.asEstadia();
    if (!s) return '';
    if (this.stayMode() === 'checkout') {
      const t = s.checkoutTime ? ` · ${s.checkoutTime}` : '';
      return `Check-out: ${s.accommodation}${t}`;
    }
    const t = s.checkinTime ? ` · ${s.checkinTime}` : '';
    return `Check-in: ${s.accommodation}${t}`;
  });
}
