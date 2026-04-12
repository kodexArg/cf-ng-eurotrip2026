import type { City } from '../../shared/models/city.model';
import type { TripEventBase } from '../../shared/models/event.model';

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

/**
 * Builds the HTML for the city hover popup: city header + list of confirmed
 * hitos. Hitos appear regardless of whether their coords are precise, since
 * the list is informational and doesn't place anything on the map.
 */
function buildCityPopupHtml(city: City, confirmedHitos: TripEventBase[]): string {
  const header = `
    <div style="text-align:center;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin-bottom:6px">
      <strong style="font-size:14px;color:${city.color}">${escapeHtml(city.name)}</strong><br>
      <span style="color:#666;font-size:11px">${escapeHtml(city.arrival)} – ${escapeHtml(city.departure)} · ${city.nights}n</span>
    </div>`;

  if (confirmedHitos.length === 0) {
    return header + `<div style="color:#999;font-size:11px;font-style:italic">Sin hitos confirmados</div>`;
  }

  const rows = confirmedHitos
    .map((h) => `
      <li style="display:flex;align-items:center;gap:6px;padding:2px 0;font-size:12px;color:#333">
        <i class="pi ${escapeHtml(h.icon || 'pi-map-marker')}" style="font-size:11px;color:${city.color};width:14px;text-align:center"></i>
        <span>${escapeHtml(h.title)}</span>
      </li>`)
    .join('');

  return header + `<ul style="list-style:none;margin:0;padding:0;max-height:240px;overflow-y:auto">${rows}</ul>`;
}

export function createCityMarker(
  L: typeof import('leaflet'),
  city: City,
  confirmedHitos: TripEventBase[],
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

  const marker = L.marker([city.lat, city.lon], { icon, zIndexOffset: 1000 });

  marker.bindTooltip(city.name, {
    permanent: true,
    direction: 'bottom',
    offset: [0, 4],
    className: 'city-label',
  });

  marker.bindPopup(buildCityPopupHtml(city, confirmedHitos), {
    offset: [0, -8],
    maxWidth: 260,
    minWidth: 180,
    className: 'city-hitos-popup',
    closeButton: false,
    autoPan: false,
  });

  marker.on('mouseover', () => marker.openPopup());
  marker.on('mouseout',  () => marker.closePopup());
  marker.on('click',     () => onClick(city.slug));

  return marker;
}
