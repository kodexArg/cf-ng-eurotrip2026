import type { City } from '../../shared/models/city.model';

export function createCityMarker(
  L: typeof import('leaflet'),
  city: City,
  onClick: (slug: string) => void
): import('leaflet').Marker {
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
    iconSize:   [24, 24],
    iconAnchor: [12, 12],
  });

  const marker = L.marker([city.lat, city.lon], { icon });

  marker.bindTooltip(city.name, {
    permanent: true,
    direction: 'bottom',
    offset: [0, 4],
    className: 'city-label',
  });

  marker.bindPopup(
    `<div style="text-align:center">
      <strong style="font-size:14px">${city.name}</strong><br>
      <span style="color:#666;font-size:12px">${city.arrival} – ${city.departure}</span>
    </div>`,
    { offset: [0, -8] }
  );
  marker.on('click', () => onClick(city.slug));

  return marker;
}
