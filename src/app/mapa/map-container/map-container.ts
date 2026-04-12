import { afterNextRender, ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import * as LeafletNs from 'leaflet';
import type { City, TripEventBase } from '../../shared/models';
import { createCityMarker } from '../map-utils/marker-factory';
import { renderEventsOnMap } from '../map-utils/route-renderer';

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
  readonly events = input<TripEventBase[]>([]);

  private readonly router = inject(Router);
  private readonly mapReady = signal(false);

  private map: LeafletNs.Map | null = null;
  private citiesLayer: LeafletNs.LayerGroup | null = null;
  private eventsLayer: LeafletNs.LayerGroup | null = null;

  private readonly _initMap = afterNextRender(() => {
    this.initMap();
    this.mapReady.set(true);
  });

  private readonly _renderCities = effect(() => {
    const cities = this.cities();
    if (this.mapReady() && cities.length > 0) {
      this.renderCities(cities);
    }
  });

  private readonly _renderEvents = effect(() => {
    const events = this.events();
    if (this.mapReady() && events.length > 0) {
      this.renderEvents(events);
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

    this.citiesLayer = L.layerGroup().addTo(map);
    this.eventsLayer = L.layerGroup().addTo(map);

    map.fitBounds([[39.9, -4.2], [48.9, 12.6]], { padding: [48, 48] });
  }

  private renderCities(cities: City[]): void {
    if (!this.citiesLayer) return;
    this.citiesLayer.clearLayers();
    cities.forEach((city) => {
      createCityMarker(L, city, (slug) => this.router.navigate(['/', slug]))
        .addTo(this.citiesLayer!);
    });
  }

  private renderEvents(events: TripEventBase[]): void {
    if (!this.map || !this.eventsLayer) return;
    this.eventsLayer.clearLayers();
    renderEventsOnMap(L, this.map, events).getLayers()
      .forEach((layer) => this.eventsLayer!.addLayer(layer));
  }
}
