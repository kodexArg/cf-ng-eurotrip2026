import { afterNextRender, ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import * as LeafletNs from 'leaflet';
import type { City, TripEventBase } from '../../shared/models';
import { makeIconBadge } from '../map-utils/geometry';
import { createCityMarker } from '../map-utils/marker-factory';
import { renderEventsOnMap } from '../map-utils/route-renderer';

// Leaflet ships as UMD/CJS; esbuild may wrap it as { default: L } or spread it.
// Unwrap once here so the rest of the file gets the real Leaflet namespace.
const L = ((LeafletNs as any).default ?? LeafletNs) as typeof LeafletNs;

/**
 * Leaflet map container that renders city markers and travel route overlays.
 *
 * @remarks
 * Initializes the map after the first render using `afterNextRender` to avoid SSR issues.
 * - `cities`: drives city marker placement and popup content via marker-factory.
 * - `events`: drives route polylines via route-renderer.
 * Clicking a city marker navigates to its detail route.
 */
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
  private homeLayer: LeafletNs.LayerGroup | null = null;
  private eventsLayer: LeafletNs.LayerGroup | null = null;

  private readonly _initMap = afterNextRender(() => {
    this.initMap();
    this.mapReady.set(true);
  });

  private readonly _renderCities = effect(() => {
    const cities = this.cities();
    const events = this.events();
    if (this.mapReady() && cities.length > 0) {
      this.renderCities(cities, events);
    }
  });

  private readonly _renderEvents = effect(() => {
    const events = this.events();
    if (this.mapReady() && events.length > 0) {
      this.renderEvents(events);
      this.renderHome(events);
    }
  });

  private initMap(): void {
    const map = L.map('leaflet-map', {
      center: [48, 7],
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

    // Layer order (DOM + zIndexOffset): events (hitos, transportes) debajo,
    // home (estadías, ícono hogar rojo) en medio, cities encima.
    this.eventsLayer = L.layerGroup().addTo(map);
    this.homeLayer = L.layerGroup().addTo(map);
    this.citiesLayer = L.layerGroup().addTo(map);

    map.fitBounds([[39.9, -4.2], [48.9, 12.6]], { padding: [48, 48] });
  }

  private renderCities(cities: City[], events: TripEventBase[]): void {
    if (!this.citiesLayer) return;
    this.citiesLayer.clearLayers();
    // Only confirmed hitos reach here (filtered upstream in MapPage).
    // Build a per-city index for the popup.
    const hitosByCity = new Map<string, TripEventBase[]>();
    for (const ev of events) {
      if (ev.type !== 'hito') continue;
      const list = hitosByCity.get(ev.cityIn) ?? [];
      list.push(ev);
      hitosByCity.set(ev.cityIn, list);
    }
    cities.forEach((city) => {
      const cityHitos = hitosByCity.get(city.id) ?? [];
      createCityMarker(L, city, cityHitos, (slug) => this.router.navigate(['/', slug]))
        .addTo(this.citiesLayer!);
    });
  }

  private renderEvents(events: TripEventBase[]): void {
    if (!this.map || !this.eventsLayer) return;
    this.eventsLayer.clearLayers();
    // Estadías se renderizan en homeLayer con ícono hogar; excluirlas acá evita el badge verde duplicado.
    const nonStay = events.filter((ev) => ev.type !== 'estadia');
    renderEventsOnMap(L, this.map, nonStay).getLayers()
      .forEach((layer) => this.eventsLayer!.addLayer(layer));
  }

  private renderHome(events: TripEventBase[]): void {
    if (!this.homeLayer) return;
    this.homeLayer.clearLayers();
    const icon = makeIconBadge(L, '#ef4444', 'pi-home');
    for (const ev of events) {
      if (ev.type !== 'estadia') continue;
      if (ev.originLat == null || ev.originLon == null) continue;
      L.marker([ev.originLat, ev.originLon], { icon, zIndexOffset: 500 })
        .bindTooltip(ev.title, { direction: 'top', offset: [0, -12] })
        .addTo(this.homeLayer);
    }
  }
}
