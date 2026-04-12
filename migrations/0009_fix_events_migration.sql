-- Fix events migration bugs from 0007_unified_events.sql
-- 4 bugs addressed: missing international flights, Park Güell duplicates,
-- train MAD→BCN missing timestamp/company, USD not propagated to intl flights

-- ───────────────────────────────────────────────
-- BUG 1: Traslados internacionales desaparecidos
-- SCL and EZE were not in cities, so the WHERE filter excluded them.
-- Insert virtual cities with nights=0 so FK constraint is satisfied.
-- ───────────────────────────────────────────────
INSERT OR IGNORE INTO cities (id, name, slug, arrival, departure, nights, color, lat, lon)
VALUES
  ('scl', 'Santiago',      'santiago',     '2026-04-18', '2026-04-19', 0, '#94a3b8', -33.45, -70.67),
  ('eze', 'Buenos Aires',  'buenos-aires', '2026-05-10', '2026-05-11', 0, '#94a3b8', -34.82, -58.54);

-- Insert the two missing traslado events
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant, notes)
VALUES
  (
    'ev-leg-scl-mad',
    'traslado',
    'flight',
    'flight-scl-mad-20260419',
    'Vuelo SCL → MAD',
    NULL,
    '2026-04-19',
    '2026-04-19T06:40:00',
    NULL,
    'mad',
    'scl',
    NULL,
    'pi-send',
    1,
    'both',
    NULL
  ),
  (
    'ev-leg-mad-eze',
    'traslado',
    'flight',
    'flight-mad-eze-20260510',
    'IB0105 MAD → EZE',
    NULL,
    '2026-05-10',
    '2026-05-10T08:45:00',
    '2026-05-10T16:25:00',
    'eze',
    'mad',
    NULL,
    'pi-send',
    1,
    'both',
    NULL
  );

-- Insert events_traslado rows for the two new flights
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, seat, duration_min)
VALUES
  ('ev-leg-scl-mad', 'Iberia', NULL, NULL, NULL, NULL),
  ('ev-leg-mad-eze', 'Iberia', NULL, NULL, NULL, NULL);

-- ───────────────────────────────────────────────
-- BUG 2: Park Güell cuadruplicado
-- Keep only ev-bcn-act-apr26-park-guell with corrected usd=59.0
-- Delete the other three duplicates
-- ───────────────────────────────────────────────
DELETE FROM events WHERE id = 'ev-bcn-apr25-guell';
UPDATE events SET usd = 59.0 WHERE id = 'ev-bcn-act-apr26-park-guell';
DELETE FROM events WHERE id = 'ev-bk-parkguell';
DELETE FROM events WHERE id = 'ev-booking-park-guell-apr26';

-- ───────────────────────────────────────────────
-- BUG 3: Train MAD→BCN missing timestamp and company
-- Fix timestamp using time from _legacy_bookings bk-mad-bcn
-- ───────────────────────────────────────────────
UPDATE events
SET
  timestamp_in  = '2026-04-24T08:57:00',
  timestamp_out = '2026-04-24T12:06:00'
WHERE id = 'ev-leg-mad-bcn';

UPDATE events_traslado
SET
  company      = 'Renfe AVE',
  vehicle_code = 'AVE'
WHERE event_id = 'ev-leg-mad-bcn';

-- ───────────────────────────────────────────────
-- BUG 4: USD not propagated to international flights
-- SCL→MAD costs 1609.0 (from bk-scl-mad); MAD→EZE has no price → leave NULL
-- ───────────────────────────────────────────────
UPDATE events SET usd = 1609.0 WHERE id = 'ev-leg-scl-mad';
-- ev-leg-mad-eze: bk-mad-eze has no cost_usd → usd remains NULL
