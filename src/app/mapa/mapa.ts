import { ChangeDetectionStrategy, Component } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MapContainer } from './map-container/map-container';
import { MapLegend } from './map-legend/map-legend';
import type { City, MapPoi, MapRoute } from '../shared/models';

@Component({
  selector: 'app-mapa',
  imports: [MapContainer, MapLegend],
  template: `
    <div class="relative" style="height: calc(100vh - 60px)">
      <app-map-container
        [cities]="citiesResource.value() ?? []"
        [pois]="poisResource.value() ?? []"
        [routes]="routesResource.value() ?? []"
      />
      <app-map-legend
        class="absolute bottom-4 left-4 z-[1000]"
        [pois]="poisResource.value() ?? []"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapaPage {
  readonly citiesResource = httpResource<City[]>(() => '/api/cities');
  readonly poisResource   = httpResource<MapPoi[]>(() => '/api/map/pois');
  readonly routesResource = httpResource<MapRoute[]>(() => '/api/map/routes');
}
