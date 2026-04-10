// Deviation from ADR-005: Leaflet used because PrimeNG has no map component equivalent.
import { afterNextRender, ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { City } from '../../shared/models';

@Component({
  selector: 'app-map-container',
  standalone: true,
  template: `<div id="leaflet-map" style="height: 100%; width: 100%;"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapContainer {
  readonly cities = input<City[]>([]);
  private readonly router = inject(Router);
  private readonly mapReady = signal(false);

  constructor() {
    afterNextRender(() => {
      this.initMap().then(() => this.mapReady.set(true));
    });

    effect(() => {
      const cities = this.cities();
      if (this.mapReady() && cities.length > 0) {
        this.renderCityPins(cities);
      }
    });
  }

  private map: import('leaflet').Map | null = null;
  private cityMarkersLayer: import('leaflet').LayerGroup | null = null;

  private async initMap(): Promise<void> {
    const L = await import('leaflet');

    this.map = L.map('leaflet-map', {
      center: [46, 10],
      zoom: 5,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(this.map);

    this.cityMarkersLayer = L.layerGroup().addTo(this.map);
    this.drawRouteLines(L);
  }

  private renderCityPins(cities: City[]): void {
    import('leaflet').then((L) => {
      this.cityMarkersLayer?.clearLayers();
      cities.forEach((city) => {
        const marker = L.circleMarker([city.lat, city.lon], {
          radius: 10,
          fillColor: city.color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        });

        marker.bindTooltip(`<strong>${city.name}</strong><br>${city.arrival} – ${city.departure}`, {
          permanent: false,
          direction: 'top',
        });

        marker.on('click', () => {
          this.router.navigate(['/', city.slug]);
        });

        this.cityMarkersLayer?.addLayer(marker);
      });
    });
  }

  private drawRouteLines(L: typeof import('leaflet')): void {
    const ROUTES: Array<{ from: [number, number]; to: [number, number]; mode: string }> = [
      { from: [40.4168, -3.7038], to: [41.3874, 2.1686], mode: 'train' },   // MAD → BCN AVE
      { from: [41.3874, 2.1686], to: [48.8566, 2.3522], mode: 'train' },    // BCN → PAR TGV
      { from: [48.8566, 2.3522], to: [45.4408, 12.3155], mode: 'train' },   // PAR → VCE
      { from: [45.4408, 12.3155], to: [41.9028, 12.4964], mode: 'train' },  // VCE → ROM
      { from: [40.4168, -3.7038], to: [39.8628, -4.0273], mode: 'daytrip' }, // Toledo
      { from: [41.9028, 12.4964], to: [40.7506, 14.4893], mode: 'daytrip' }, // Pompeya
      { from: [-33.3933, -70.787], to: [40.4719, -3.5626], mode: 'flight' }, // SCL → MAD
      { from: [41.8003, 12.2389], to: [-34.8222, -58.5358], mode: 'flight' }, // FCO → EZE
    ];

    ROUTES.forEach(({ from, to, mode }) => {
      let options: import('leaflet').PolylineOptions;
      if (mode === 'train') {
        options = { color: '#22c55e', weight: 2, dashArray: '8,6', opacity: 0.8 };
      } else if (mode === 'daytrip') {
        options = { color: '#8b5cf6', weight: 1.5, dashArray: '4,4', opacity: 0.7 };
      } else {
        options = { color: '#3b82f6', weight: 2, opacity: 0.8 };
      }
      L.polyline([from, to], options).addTo(this.map!);
    });
  }
}
