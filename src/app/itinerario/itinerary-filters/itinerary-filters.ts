import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TypeFilter } from '../../shared/type-filter/type-filter';

/**
 * Thin wrapper that renders the shared TypeFilter toolbar inside the itinerary layout.
 *
 * @remarks
 * No bridge getters or setters — filter state is owned entirely by TypeFilterService,
 * which is injected directly by TypeFilter. This component exists solely so the
 * itinerary parent template can use a stable selector without change.
 */
@Component({
  selector: 'app-itinerary-filters',
  standalone: true,
  imports: [TypeFilter],
  template: `<app-type-filter />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryFilters {}
