import { afterNextRender, ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import * as LeafletNs from 'leaflet';
import type { City, MapPoi, MapRoute } from '../../shared/models';
import { createPoiMarker } from '../map-utils/marker-factory';
import { renderRoutes } from '../map-utils/route-renderer';

// Leaflet ships as UMD/CJS; esbuild may wrap it as { default: L } or spread it.
// Unwrap once here so the rest of the file gets the real Leaflet namespace.
const L = ((LeafletNs as any).default ?? LeafletNs) as typeof LeafletNs;

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

  private map: LeafletNs.Map | null = null;
  private poisLayer:   LeafletNs.LayerGroup | null = null;
  private routesLayer: LeafletNs.LayerGroup | null = null;

  private readonly _initMap = afterNextRender(() => {
    this.initMap();
    this.mapReady.set(true);
  });

  private readonly _renderPois = effect(() => {
    const pois = this.pois();
    const cities = this.cities();
    if (this.mapReady() && pois.length > 0) {
      this.renderPois(pois, cities);
    }
  });

  private readonly _renderRoutes = effect(() => {
    const routes = this.routes();
    if (this.mapReady() && routes.length > 0) {
      this.renderRoutesLayer(routes);
    }
  });

  private initMap(): void {
    const map = L.map('leaflet-map', {
      center: [46, 10],
      zoom: 5,
      zoomControl: false,
    });
    this.map = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    this.poisLayer   = L.layerGroup().addTo(map);
    this.routesLayer = L.layerGroup().addTo(map);

    map.fitBounds([[39.9, -4.2], [48.9, 12.6]], { padding: [48, 48] });
  }

  private renderPois(pois: MapPoi[], cities: City[]): void {
    if (!this.poisLayer) return;
    this.poisLayer.clearLayers();
    const cityMap = new Map(cities.map((c) => [c.id, c]));
    pois.forEach((poi) => {
      const city = poi.cityId ? cityMap.get(poi.cityId) : undefined;
      createPoiMarker(L, poi, city, (slug) => this.router.navigate(['/', slug]))
        .addTo(this.poisLayer!);
    });
  }

  private renderRoutesLayer(routes: MapRoute[]): void {
    if (!this.map || !this.routesLayer) return;
    this.routesLayer.clearLayers();
    renderRoutes(L, this.map, routes).getLayers()
      .forEach((layer) => this.routesLayer!.addLayer(layer));
  }
}
