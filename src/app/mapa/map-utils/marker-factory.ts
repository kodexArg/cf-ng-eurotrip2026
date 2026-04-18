import type { City } from '../../shared/models/city.model';
import type { TripEventBase } from '../../shared/models/event.model';
import { timeOf } from '../../shared/models/event.model';
import { iconHtml } from '../../shared/icon/icon-html';
import {
  MARKER_POPUP_MAX_WIDTH,
  MARKER_POPUP_MIN_WIDTH,
  MARKER_POPUP_LIST_MAX_HEIGHT,
} from '../../shared/theme/spacing';
import {
  MARKER_TITLE_FS,
  MARKER_META_FS,
  MARKER_DAY_HEADER_FS,
  MARKER_HITO_TITLE_FS,
  MARKER_SMALL_FS,
  MARKER_ICON_FS,
  MARKER_BADGE_FS,
} from '../../shared/theme/typography';

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

// Spanish day/month abbreviations — deterministic, locale-independent.
const DOW_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MON_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "2026-04-27" → "Lun 27 abr". Naive local date, no TZ shifting. */
function formatDayHeader(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  // Date constructed as UTC then read with UTC getters → no TZ drift.
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DOW_ES[dt.getUTCDay()]} ${d} ${MON_ES[m - 1]}`;
}

/** "2026-04-27" → "27/04". */
function formatShortDate(ymd: string): string {
  const [, m, d] = ymd.split('-');
  return `${d}/${m}`;
}

/** Chronological sort: date ASC, then timestamp_in ASC (nulls last). */
function sortHitos(hitos: TripEventBase[]): TripEventBase[] {
  return [...hitos].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    const ta = a.timestampIn ?? '';
    const tb = b.timestampIn ?? '';
    if (!ta && !tb) return 0;
    if (!ta) return 1;
    if (!tb) return -1;
    return ta < tb ? -1 : 1;
  });
}

/** True when the hito has a real origin coordinate pair (placed on the map). */
function hasCoords(h: TripEventBase): boolean {
  return typeof h.originLat === 'number' && typeof h.originLon === 'number';
}

/** Soft background tinted from the city color (alpha ~14%). */
function tintBg(hex: string): string {
  // Accepts #rrggbb or named fallback; if unparseable, return a neutral gray.
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return 'rgba(0,0,0,0.04)';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `rgba(${r},${g},${b},0.09)`;
}

/**
 * Builds the HTML for the city hover popup. Receives ALL hitos for the city
 * (confirmed + planned). Confirmed ones get a check badge; unconfirmed stay
 * dimmer. Hitos with real coords get a tiny map-pin indicator to hint that
 * they're also drawn on the map.
 */
function buildCityPopupHtml(city: City, hitos: TripEventBase[]): string {
  const color = city.color;
  const bg = tintBg(color);

  const confirmedCount = hitos.filter((h) => h.confirmed).length;
  const totalCount = hitos.length;
  const totalUsd = hitos.reduce((acc, h) => acc + (h.usd ?? 0), 0);

  const header = `
    <div style="
      text-align:center;
      background:${bg};
      border-left:3px solid ${color};
      padding:8px 10px 6px;
      margin:-4px -4px 6px;
      border-radius:2px 2px 0 0;
    ">
      <div style="
        font-size:${MARKER_TITLE_FS};
        font-weight:700;
        color:${color};
        letter-spacing:0.2px;
        line-height:1.2;
      ">${escapeHtml(city.name)}</div>
      <div style="
        font-size:${MARKER_META_FS};
        color:#555;
        margin-top:3px;
        display:flex;
        justify-content:center;
        align-items:center;
        gap:6px;
        flex-wrap:wrap;
      ">
        <span>${iconHtml('pi-calendar', { size: '9px', extraStyle: 'margin-right:2px' })}${escapeHtml(formatShortDate(city.arrival))} – ${escapeHtml(formatShortDate(city.departure))}</span>
        <span style="color:#bbb">·</span>
        <span>${iconHtml('pi-moon', { size: '9px', extraStyle: 'margin-right:2px' })}${city.nights}n</span>
        ${totalCount > 0 ? `
          <span style="color:#bbb">·</span>
          <span>${iconHtml('pi-map-marker', { size: '9px', extraStyle: 'margin-right:2px' })}${confirmedCount}/${totalCount}</span>
        ` : ''}
        ${totalUsd > 0 ? `
          <span style="color:#bbb">·</span>
          <span>${iconHtml('pi-dollar', { size: '9px', extraStyle: 'margin-right:1px' })}${totalUsd}</span>
        ` : ''}
      </div>
    </div>`;

  if (totalCount === 0) {
    return header + `
      <div style="
        color:#999;
        font-size:11px;
        font-style:italic;
        text-align:center;
        padding:8px 4px 4px;
      ">Sin hitos registrados</div>`;
  }

  // Group by date → sorted list of [date, hitos[]].
  const sorted = sortHitos(hitos);
  const byDate = new Map<string, TripEventBase[]>();
  for (const h of sorted) {
    const list = byDate.get(h.date) ?? [];
    list.push(h);
    byDate.set(h.date, list);
  }

  const dayBlocks: string[] = [];
  for (const [date, dayHitos] of byDate) {
    const dayHeader = `
      <div style="
        font-size:${MARKER_DAY_HEADER_FS};
        font-weight:600;
        color:${color};
        text-transform:uppercase;
        letter-spacing:0.6px;
        padding:5px 2px 2px;
        border-bottom:1px dashed ${bg.replace('0.09', '0.35')};
        margin-bottom:3px;
      ">${escapeHtml(formatDayHeader(date))}</div>`;

    const rows = dayHitos.map((h) => renderHitoRow(h, color)).join('');
    dayBlocks.push(dayHeader + rows);
  }

  return header + `
    <div style="
      max-height:${MARKER_POPUP_LIST_MAX_HEIGHT};
      overflow-y:auto;
      padding-right:2px;
    ">${dayBlocks.join('')}</div>`;
}

/** Single hito row: time / icon / title / side metadata. */
function renderHitoRow(h: TripEventBase, cityColor: string): string {
  const confirmed = !!h.confirmed;
  const rowOpacity = confirmed ? '1' : '0.62';
  const iconName = h.icon || 'pi-map-marker';
  const time = h.timestampIn ? timeOf(h.timestampIn) : '';

  // Left gutter: time or a thin placeholder so icons align.
  const timeCell = time
    ? `<span style="
        font-size:${MARKER_SMALL_FS};
        color:#777;
        font-variant-numeric:tabular-nums;
        min-width:30px;
        text-align:right;
        padding-top:1px;
      ">${escapeHtml(time)}</span>`
    : `<span style="min-width:30px"></span>`;

  // Small map-pin suffix when the hito is drawn on the map.
  const mapIndicator = hasCoords(h)
    ? iconHtml('pi-map-marker', { size: '8px', color: cityColor, extraStyle: 'opacity:0.75;margin-left:3px' })
    : '';

  // Confirmed check or planned dot on the far right.
  const statusBadge = confirmed
    ? iconHtml('pi-check-circle', { size: '10px', color: '#16a34a', extraStyle: 'flex-shrink:0' })
    : iconHtml('pi-circle', { size: '9px', color: '#cbd5e1', extraStyle: 'flex-shrink:0' });

  // Optional $ before the status badge.
  const usdBadge = typeof h.usd === 'number' && h.usd > 0
    ? `<span style="font-size:${MARKER_BADGE_FS};color:#16a34a;font-weight:600;display:inline-flex;align-items:center;gap:1px;flex-shrink:0">${iconHtml('pi-dollar', { size: '8px' })}${h.usd}</span>`
    : '';

  // Optional one-line description underneath the title.
  const desc = h.description
    ? `<div style="
        font-size:${MARKER_DAY_HEADER_FS};
        color:#777;
        line-height:1.3;
        margin-top:1px;
      ">${escapeHtml(h.description)}</div>`
    : '';

  // Optional notes (shorter, even dimmer).
  const notes = h.notes
    ? `<div style="font-size:${MARKER_SMALL_FS};color:#999;font-style:italic;line-height:1.3;margin-top:1px">${iconHtml('pi-info-circle', { size: '8px', extraStyle: 'margin-right:2px' })}${escapeHtml(h.notes)}</div>`
    : '';

  return `
    <div style="
      display:flex;
      align-items:flex-start;
      gap:6px;
      padding:3px 2px;
      opacity:${rowOpacity};
    ">
      ${timeCell}
      ${iconHtml(iconName, { size: MARKER_ICON_FS, color: cityColor, extraStyle: 'width:14px;text-align:center;padding-top:1px;flex-shrink:0' })}
      <div style="flex:1;min-width:0">
        <div style="
          font-size:${MARKER_HITO_TITLE_FS};
          color:#222;
          line-height:1.3;
          font-weight:${confirmed ? '500' : '400'};
          word-wrap:break-word;
        ">${escapeHtml(h.title)}${mapIndicator}</div>
        ${desc}
        ${notes}
      </div>
      <div style="
        display:flex;
        align-items:center;
        gap:4px;
        padding-top:1px;
      ">
        ${usdBadge}
        ${statusBadge}
      </div>
    </div>`;
}

export function createCityMarker(
  L: typeof import('leaflet'),
  city: City,
  hitos: TripEventBase[],
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

  marker.bindPopup(buildCityPopupHtml(city, hitos), {
    offset: [0, -8],
    maxWidth: MARKER_POPUP_MAX_WIDTH,
    minWidth: MARKER_POPUP_MIN_WIDTH,
    className: 'city-hitos-popup',
    closeButton: false,
    autoPan: false,
  });

  marker.on('mouseover', () => marker.openPopup());
  marker.on('mouseout',  () => marker.closePopup());
  marker.on('click',     () => onClick(city.slug));

  return marker;
}
