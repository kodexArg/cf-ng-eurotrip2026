import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MapContainer } from './map-container/map-container';
import { MapLegend } from './map-legend/map-legend';
import type { City, TripEventBase } from '../shared/models';

/**
 * Map page: full-viewport Leaflet map with an overlaid transport legend.
 *
 * @remarks
 * Fetches cities and map events in parallel from /api/cities and /api/map/events.
 * Delegates rendering to MapContainer; the legend is absolutely positioned over the map.
 * Only confirmed events (confirmed === true) are passed to the map renderer.
 */
@Component({
  selector: 'app-map',
  imports: [MapContainer, MapLegend],
  template: `
    <div class="relative" style="height: calc(100vh - 60px)">
      <app-map-container
        [cities]="citiesResource.value() ?? []"
        [events]="confirmedEvents()"
      />
      <app-map-legend
        class="absolute bottom-4 left-4 z-[1000]"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPage {
  readonly citiesResource = httpResource<City[]>(() => '/api/cities');
  readonly eventsResource = httpResource<TripEventBase[]>(() => '/api/map/events');

  /** Only render confirmed events — no planned, mandatory-only, or unconfirmed transfers. */
  readonly confirmedEvents = computed(() =>
    (this.eventsResource.value() ?? []).filter((ev) => ev.confirmed === true)
  );
}
