/** Shared geometry helpers: bearing math, SVG arrow icons, and icon-badge DivIcons. */

import type * as L from 'leaflet';

/** Computes the initial bearing in degrees (0–360) from point a to point b. */
export function bearing(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const dLon = toRad(b[1] - a[1]);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Creates a rotated SVG arrow DivIcon pointing in the given bearing direction. */
export function makeArrowIcon(Leaflet: typeof L, deg: number, color: string): L.DivIcon {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
    <polygon points="6,1 11,11 6,8 1,11" fill="${color}" fill-opacity="0.85" stroke="white" stroke-width="0.8"/>
  </svg>`;
  return Leaflet.divIcon({
    html: `<div style="transform:rotate(${deg}deg);transform-origin:center;width:12px;height:12px;line-height:1">${svg}</div>`,
    className: '',
    iconSize:   [12, 12],
    iconAnchor: [6, 6],
  });
}

/** Creates a circular PrimeIcon badge DivIcon with the given background color and icon class. */
export function makeIconBadge(Leaflet: typeof L, color: string, iconClass: string, size = 22): L.DivIcon {
  const glyph = size * 0.55;
  return Leaflet.divIcon({
    html: `<div style="
      width:${size}px; height:${size}px;
      background:${color};
      border-radius:50%;
      border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      display:flex; align-items:center; justify-content:center;
      color:#fff;
    "><i class="pi ${iconClass}" style="font-size:${glyph}px;line-height:1"></i></div>`,
    className: '',
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
