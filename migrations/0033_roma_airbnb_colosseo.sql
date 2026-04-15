-- 0033_roma_airbnb_colosseo.sql
-- Nueva estadia Roma: Airbnb cerca del Coliseo, 3 noches (May 6→9 2026).
-- Check-in ~21:00 CEST tras Leonardo Express FCO→Termini (llega 20:02) + traslado Termini→hotel.
-- Check-out May 9 ~11:00 CEST. Precio total $451 USD. confirmed=0, ubicación exacta TBD.

-- ─────────────────────────────────────────────────────────────────────
-- 1. Evento principal en tabla events
-- ─────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events (
  id, type, subtype, slug, title,
  date, timestamp_in, timestamp_out,
  city_in, usd, icon, confirmed, variant,
  lat, lon,
  notes
) VALUES (
  'est-rom-airbnb-colosseo',
  'estadia', 'airbnb',
  'stay-rom-airbnb-colosseo-20260506',
  'Airbnb Colosseo',
  '2026-05-06',
  '2026-05-06T21:00:00+02:00',
  '2026-05-09T11:00:00+02:00',
  'rom',
  451.00,
  'pi-home',
  0,
  'both',
  41.8902, 12.4922,
  'Airbnb cerca del Coliseo, 3 noches. Total $451 USD. Ubicación exacta TBD.'
);

-- ─────────────────────────────────────────────────────────────────────
-- 2. Detalle de estadia en tabla events_estadia
-- ─────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events_estadia (
  event_id, accommodation, address,
  checkin_time, checkout_time,
  booking_ref, platform
) VALUES (
  'est-rom-airbnb-colosseo',
  'Airbnb Colosseo',
  NULL,
  '21:00',
  '11:00',
  NULL,
  'Airbnb'
);
