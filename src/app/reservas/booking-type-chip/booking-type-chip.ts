import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { EventType } from '../../shared/models/event.model';

type TagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined;

const TYPE_CONFIG: Record<EventType, { icon: string; severity: TagSeverity; label: string }> = {
  hito:     { icon: 'pi pi-flag',  severity: 'warn',      label: 'Hito' },
  traslado: { icon: 'pi pi-send',  severity: 'info',      label: 'Viaje' },
  estadia:  { icon: 'pi pi-home',  severity: 'secondary', label: 'Hospedaje' },
};

/**
 * PrimeNG Tag badge that classifies a booking by its event type.
 *
 * @remarks
 * Variants driven by `type` input:
 * - `hito`: yellow warning tag with flag icon.
 * - `traslado`: blue info tag with send icon.
 * - `estadia`: grey secondary tag with home icon.
 */
@Component({
  selector: 'app-booking-type-chip',
  standalone: true,
  imports: [Tag],
  template: `
    <p-tag [value]="config().label" [severity]="config().severity" [icon]="config().icon" styleClass="text-xs" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingTypeChip {
  readonly type = input.required<EventType>();

  readonly config = computed(() => TYPE_CONFIG[this.type()]);
}
