import type { MapPoi } from '../../shared/models/map-poi.model';
import type { City } from '../../shared/models/city.model';

export function createPoiMarker(
  L: typeof import('leaflet'),
  poi: MapPoi,
  city: City | undefined,
  onCityClick: (slug: string) => void
): import('leaflet').Marker {
  const isCity = poi.type === 'city';

  const icon = L.divIcon({
    className: '',
    html: isCity
      ? `<div style="
          width:24px; height:24px;
          background:${poi.color};
          border-radius:50%;
          border:2.5px solid #fff;
          box-shadow:0 2px 7px rgba(0,0,0,0.28);
          display:flex; align-items:center; justify-content:center;
          color:#fff; font-weight:700; font-size:10px;
          cursor:pointer;
        ">${poi.name[0]}</div>`
      : `<div style="
          width:14px; height:14px;
          background:${poi.color};
          border-radius:50%;
          border:2px solid #fff;
          box-shadow:0 1px 4px rgba(0,0,0,0.22);
          opacity:0.85;
        "></div>`,
    iconSize: isCity ? [24, 24] : [14, 14],
    iconAnchor: isCity ? [12, 12] : [7, 7],
  });

  const marker = L.marker([poi.lat, poi.lon], { icon });

  marker.bindTooltip(poi.name, {
    permanent: isCity,
    direction: 'bottom',
    offset: [0, isCity ? 4 : 2],
    className: isCity ? 'city-label' : 'excursion-label',
  });

  if (isCity && city) {
    marker.bindPopup(
      `<div style="text-align:center">
        <strong style="font-size:14px">${city.name}</strong><br>
        <span style="color:#666;font-size:12px">${city.arrival} – ${city.departure}</span>
      </div>`,
      { offset: [0, -8] }
    );
    marker.on('click', () => onCityClick(city.slug));
  }

  return marker;
}
