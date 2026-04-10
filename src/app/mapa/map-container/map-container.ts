// Deviation from ADR-005: Leaflet used because PrimeNG has no map component equivalent.
import { afterNextRender, ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { City } from '../../shared/models';

@Component({
  selector: 'app-map-container',
  template: `<div id="leaflet-map" style="height: 100%; width: 100%;"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapContainer {
  readonly cities = input<City[]>([]);
  private readonly router = inject(Router);
  private readonly mapReady = signal(false);

  private readonly _initMap = afterNextRender(() => {
    this.initMap().then(() => this.mapReady.set(true));
  });

  private readonly _cityPins = effect(() => {
    const cities = this.cities();
    if (this.mapReady() && cities.length > 0) {
      this.renderCityPins(cities);
    }
  });

  private map: import('leaflet').Map | null = null;
  private cityMarkersLayer: import('leaflet').LayerGroup | null = null;

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

    this.cityMarkersLayer = L.layerGroup().addTo(this.map);
    this.drawRouteLines(L);

    // Fit to European cities bounding box
    this.map.fitBounds([[39.9, -4.2], [48.9, 12.6]], { padding: [48, 48] });
  }

  private renderCityPins(cities: City[]): void {
    import('leaflet').then((L) => {
      this.cityMarkersLayer?.clearLayers();
      cities.forEach((city) => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:24px; height:24px;
            background:${city.color};
            border-radius:50%;
            border:2.5px solid #fff;
            box-shadow:0 2px 7px rgba(0,0,0,0.28);
            display:flex; align-items:center; justify-content:center;
            color:#fff; font-weight:700; font-size:10px;
            cursor:pointer;
          ">${city.name[0]}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([city.lat, city.lon], { icon });

        // Permanent city name label below marker
        marker.bindTooltip(city.name, {
          permanent: true,
          direction: 'bottom',
          offset: [0, 4],
          className: 'city-label',
        });

        // Popup with dates on click
        marker.bindPopup(
          `<div style="text-align:center">
            <strong style="font-size:14px">${city.name}</strong><br>
            <span style="color:#666;font-size:12px">${city.arrival} – ${city.departure}</span>
          </div>`,
          { offset: [0, -8] }
        );

        marker.on('click', () => {
          this.router.navigate(['/', city.slug]);
        });

        this.cityMarkersLayer?.addLayer(marker);
      });
    });
  }

  private drawRouteLines(L: typeof import('leaflet')): void {
    // Train routes with real intermediate rail waypoints
    const TRAIN_ROUTES: [number, number][][] = [
      // MAD → BCN (AVE): vía Zaragoza
      [
        [40.4168, -3.7038],   // Madrid-Atocha
        [41.6488, -0.8891],   // Zaragoza-Delicias
        [41.3874,  2.1686],   // Barcelona-Sants
      ],
      // BCN → PAR (TGV): vía Perpignan, Montpellier, Lyon
      [
        [41.3874,  2.1686],   // Barcelona-Sants
        [42.6976,  2.8954],   // Perpignan
        [43.6119,  3.8772],   // Montpellier
        [45.7640,  4.8357],   // Lyon-Part-Dieu
        [48.8566,  2.3522],   // Paris-Gare de Lyon
      ],
      // PAR → VCE (Thello/OuiGo): vía Dijon, Lausana, Milán
      [
        [48.8566,  2.3522],   // Paris-Gare de Lyon
        [47.3220,  5.0415],   // Dijon
        [46.5197,  6.6323],   // Lausanne
        [45.4654,  9.1859],   // Milano Centrale
        [45.4408, 12.3155],   // Venezia Santa Lucia
      ],
      // VCE → ROM (Frecciarossa): vía Bolonia, Florencia
      [
        [45.4408, 12.3155],   // Venezia Santa Lucia
        [44.4949, 11.3426],   // Bologna Centrale
        [43.7755, 11.2488],   // Firenze SMN
        [41.9028, 12.4964],   // Roma Termini
      ],
    ];

    // Day-trip routes (short, with a mid-bend for visibility)
    const DAYTRIP_ROUTES: [number, number][][] = [
      // MAD → Toledo (cercanías)
      [[40.4168, -3.7038], [39.8628, -4.0273]],
      // ROM → Pompeya (vía Nápoles)
      [[41.9028, 12.4964], [40.8518, 14.2681], [40.7506, 14.4893]],
    ];

    // Intercontinental flights as great-circle arcs
    const FLIGHT_ROUTES: Array<[[number, number], [number, number]]> = [
      [[-33.3933, -70.787], [40.4719, -3.5626]],  // SCL → MAD
      [[41.8003,  12.2389], [-34.8222, -58.5358]], // FCO → EZE
    ];

    const trainOpts: import('leaflet').PolylineOptions  = { color: '#16a34a', weight: 2.5, dashArray: '10,6', opacity: 0.85 };
    const daytripOpts: import('leaflet').PolylineOptions = { color: '#7c3aed', weight: 1.8, dashArray: '5,5', opacity: 0.75 };
    const flightOpts: import('leaflet').PolylineOptions  = { color: '#2563eb', weight: 1.8, opacity: 0.7 };

    TRAIN_ROUTES.forEach(pts => L.polyline(pts, trainOpts).addTo(this.map!));
    DAYTRIP_ROUTES.forEach(pts => L.polyline(pts, daytripOpts).addTo(this.map!));
    FLIGHT_ROUTES.forEach(([from, to]) =>
      L.polyline(this.greatCirclePoints(from, to, 80), flightOpts).addTo(this.map!)
    );
  }

  /**
   * Returns N+1 equally-spaced points along the great-circle arc from p1 to p2.
   * Uses spherical linear interpolation (slerp) — Earth is round.
   */
  private greatCirclePoints(
    p1: [number, number],
    p2: [number, number],
    n: number
  ): [number, number][] {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;

    const lat1 = toRad(p1[0]), lon1 = toRad(p1[1]);
    const lat2 = toRad(p2[0]), lon2 = toRad(p2[1]);

    // Convert to unit Cartesian
    const x1 = Math.cos(lat1) * Math.cos(lon1);
    const y1 = Math.cos(lat1) * Math.sin(lon1);
    const z1 = Math.sin(lat1);

    const x2 = Math.cos(lat2) * Math.cos(lon2);
    const y2 = Math.cos(lat2) * Math.sin(lon2);
    const z2 = Math.sin(lat2);

    const dot = Math.min(1, x1 * x2 + y1 * y2 + z1 * z2);
    const d = Math.acos(dot);

    if (d < 1e-9) return [p1, p2]; // same point

    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const A = Math.sin((1 - t) * d) / Math.sin(d);
      const B = Math.sin(t * d) / Math.sin(d);
      const x = A * x1 + B * x2;
      const y = A * y1 + B * y2;
      const z = A * z1 + B * z2;
      const lat = toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)));
      const lon = toDeg(Math.atan2(y, x));
      pts.push([lat, lon]);
    }
    return pts;
  }
}
