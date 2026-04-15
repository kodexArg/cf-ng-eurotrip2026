import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { EventType } from '../models/event.model';
import { TypeFilterService } from './type-filter.service';

export type TypeFilterTuple = readonly [hito: boolean, traslado: boolean, estadia: boolean];

export const TYPE_FILTER_INDEX = { hito: 0, traslado: 1, estadia: 2 } as const satisfies Record<EventType, number>;

export function isTypeActive(tuple: TypeFilterTuple, type: EventType): boolean {
  return tuple[TYPE_FILTER_INDEX[type]];
}

const FILTER_OPTIONS: { label: string; value: EventType }[] = [
  { label: 'Hitos',     value: 'hito' },
  { label: 'Viajes',    value: 'traslado' },
  { label: 'Hospedaje', value: 'estadia' },
];

/**
 * Reusable event-type filter using a PrimeNG SelectButton.
 *
 * @remarks
 * Multi-toggle, three options: Hitos, Viajes, Hospedaje — each independently on or off.
 * The "Todos" option has been removed. All state is owned by TypeFilterService,
 * which persists selections to localStorage so they survive page reloads.
 * The component is self-contained via the service — no input/output bindings needed.
 * Consumed types: hito / traslado / estadia (mapped from EventType).
 */
@Component({
  selector: 'app-type-filter',
  standalone: true,
  imports: [FormsModule, SelectButton],
  template: `
    <p-selectbutton
      [options]="options"
      [ngModel]="selected()"
      (ngModelChange)="onChange($event)"
      [multiple]="true"
      optionLabel="label"
      optionValue="value"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeFilter {
  protected readonly filters = inject(TypeFilterService);
  protected readonly options = FILTER_OPTIONS;

  protected readonly selected = computed<EventType[]>(() => {
    const tuple = this.filters.active();
    const result: EventType[] = [];
    if (tuple[0]) result.push('hito');
    if (tuple[1]) result.push('traslado');
    if (tuple[2]) result.push('estadia');
    return result;
  });

  protected onChange(values: EventType[]): void {
    this.filters.set([
      values.includes('hito'),
      values.includes('traslado'),
      values.includes('estadia'),
    ] as const);
  }
}
