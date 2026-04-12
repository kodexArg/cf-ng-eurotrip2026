import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { BookingType } from '../../shared/models';

type TagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined;

const TYPE_CONFIG: Record<BookingType, { icon: string; severity: TagSeverity; label: string }> = {
  hito:      { icon: 'pi pi-flag',  severity: 'warn',    label: 'Hito' },
  viaje:     { icon: 'pi pi-send',  severity: 'info',    label: 'Viaje' },
  hospedaje: { icon: 'pi pi-home',  severity: 'secondary', label: 'Hospedaje' },
};

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
  readonly type = input.required<BookingType>();

  readonly config = computed(() => TYPE_CONFIG[this.type()]);
}
