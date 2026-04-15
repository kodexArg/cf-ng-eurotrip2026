import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TypeFilter, FilterValue } from '../../shared/type-filter/type-filter';
import { ItineraryFilterService } from '../itinerary-filter.service';

/**
 * Toolbar that controls which event type is visible in the itinerary.
 *
 * @remarks
 * Reads and writes through ItineraryFilterService so the filter state is shared
 * across all itinerary sub-components without prop drilling.
 * Single-select: Todos, Hitos, Viajes, or Hospedaje.
 */
@Component({
  selector: 'app-itinerary-filters',
  standalone: true,
  imports: [TypeFilter],
  template: `
    <app-type-filter [value]="filterValue" (valueChange)="filterValue = $event" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryFilters {
  protected readonly filters = inject(ItineraryFilterService);

  protected get filterValue(): FilterValue {
    return this.filters.filter();
  }

  protected set filterValue(v: FilterValue) {
    this.filters.setFilter(v);
  }
}
