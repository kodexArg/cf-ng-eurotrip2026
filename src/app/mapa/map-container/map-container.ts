import { afterNextRender, ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { City, MapPoi, MapRoute } from '../../shared/models';
import { createPoiMarker } from '../map-utils/marker-factory';
import { renderRoutes } from '../map-utils/route-renderer';

@Component({
  selector: 'app-map-container',
  template: `<div id="leaflet-map" style="height: 100%; width: 100%;"></div>`,
  host: { style: 'display: block; height: 100%; width: 100%;' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapContainer {
  readonly cities = input<City[]>([]);
  readonly pois   = input<MapPoi[]>([]);
  readonly routes = input<MapRoute[]>([]);

  private readonly router = inject(Router);
  private readonly mapReady = signal(false);

  private map: import('leaflet').Map | null = null;
  private poisLayer:   import('leaflet').LayerGroup | null = null;
  private routesLayer: import('leaflet').LayerGroup | null = null;

  private readonly _initMap = afterNextRender(() => {
    this.initMap().then(() => this.mapReady.set(true));
  });

  private readonly _renderPois = effect(() => {
    const pois = this.pois();
    const cities = this.cities();
    if (this.mapReady() && pois.length > 0) {
      import('leaflet').then((L) => this.renderPois(L, pois, cities));
    }
  });

  private readonly _renderRoutes = effect(() => {
    const routes = this.routes();
    if (this.mapReady() && routes.length > 0) {
      import('leaflet').then((L) => this.renderRoutesLayer(L, routes));
    }
  });

  private async initMap(): Promise<void> {
    const L = await import('leaflet');

    this.map = L.map('leaflet-map', {
      center: [46, 10],
      zoom: 5,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(this.map);

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    this.poisLayer   = L.layerGroup().addTo(this.map);
    this.routesLayer = L.layerGroup().addTo(this.map);

    this.map.fitBounds([[39.9, -4.2], [48.9, 12.6]], { padding: [48, 48] });
  }

  private renderPois(L: typeof import('leaflet'), pois: MapPoi[], cities: City[]): void {
    this.poisLayer?.clearLayers();
    const cityMap = new Map(cities.map((c) => [c.id, c]));
    pois.forEach((poi) => {
      const city = poi.cityId ? cityMap.get(poi.cityId) : undefined;
      createPoiMarker(L, poi, city, (slug) => this.router.navigate(['/', slug]))
        .addTo(this.poisLayer!);
    });
  }

  private renderRoutesLayer(L: typeof import('leaflet'), routes: MapRoute[]): void {
    this.routesLayer?.clearLayers();
    renderRoutes(L, this.map!, routes).getLayers()
      .forEach((layer) => this.routesLayer!.addLayer(layer));
  }
}
