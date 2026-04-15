import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { EventType } from '../models/event.model';

export type FilterValue = EventType | 'all';

const FILTER_OPTIONS: { label: string; value: FilterValue }[] = [
  { label: 'Todos',     value: 'all' },
  { label: 'Hitos',     value: 'hito' },
  { label: 'Viajes',    value: 'traslado' },
  { label: 'Hospedaje', value: 'estadia' },
];

/**
 * Reusable event-type filter using a PrimeNG SelectButton.
 *
 * @remarks
 * Single-select, four options: Todos, Hitos, Viajes, Hospedaje.
 * - `value`: two-way `model<FilterValue>` signal. 'all' means no filter.
 * Use on any page that lists TripEvents and wants a stock filter toolbar.
 */
@Component({
  selector: 'app-type-filter',
  standalone: true,
  imports: [FormsModule, SelectButton],
  template: `
    <p-selectbutton
      [options]="options"
      [(ngModel)]="value"
      optionLabel="label"
      optionValue="value"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeFilter {
  readonly value = model<FilterValue>('all');
  protected readonly options = FILTER_OPTIONS;
}
