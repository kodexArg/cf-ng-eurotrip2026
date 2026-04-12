-- Unified events model
-- Master table + optional sub-tables (traslado / estadia)
-- Migrates data from activities, transport_legs, bookings → events

-- ───────────────────────────────────────────────
-- 1. Create master events table
-- ───────────────────────────────────────────────
CREATE TABLE events (
  id            TEXT PRIMARY KEY,
  type          TEXT NOT NULL CHECK(type IN ('hito','traslado','estadia')),
  subtype       TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  description   TEXT,
  date          DATE NOT NULL,
  timestamp_in  TEXT NOT NULL,
  timestamp_out TEXT,
  city_in       TEXT NOT NULL REFERENCES cities(id),
  city_out      TEXT REFERENCES cities(id),
  usd           REAL,
  icon          TEXT NOT NULL,
  confirmed     INTEGER NOT NULL DEFAULT 0,
  variant       TEXT NOT NULL DEFAULT 'both',
  card_id       TEXT REFERENCES cards(id),
  notes         TEXT,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_time ON events(timestamp_in);
CREATE INDEX idx_events_city_in ON events(city_in, date);
CREATE INDEX idx_events_type ON events(type);

-- ───────────────────────────────────────────────
-- 2. Create optional sub-tables
-- ───────────────────────────────────────────────
CREATE TABLE events_traslado (
  event_id     TEXT PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
  company      TEXT,
  fare         TEXT,
  vehicle_code TEXT,
  seat         TEXT,
  duration_min INTEGER
);

CREATE TABLE events_estadia (
  event_id       TEXT PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
  accommodation  TEXT NOT NULL,
  address        TEXT,
  checkin_time   TEXT,
  checkout_time  TEXT,
  booking_ref    TEXT,
  platform       TEXT
);

-- ───────────────────────────────────────────────
-- 3. Backfill missing leg: BCN→PMI (vive en activities+bookings pero no en legs)
-- ───────────────────────────────────────────────
INSERT INTO transport_legs (id, from_city, to_city, date, mode, label, duration, cost_hint, confirmed, fare, company, departure_time, arrival_time)
VALUES ('leg-bcn-pmi', 'bcn', 'pmi', '2026-04-28', 'flight',
        'Vueling BCN → PMI', '~55m', 'USD 95 (2 pax)', 1, 'BASIC', 'Vueling', '09:05', '10:00');

-- ───────────────────────────────────────────────
-- 4. Migrate transport_legs → events (type=traslado)
-- ───────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant, notes)
SELECT
  'ev-' || id,
  'traslado',
  mode,
  mode || '-' || lower(from_city) || '-' || lower(to_city) || '-' || replace(date, '-', ''),
  label,
  NULL,
  date,
  date || 'T' || COALESCE(departure_time, '00:00') || ':00',
  CASE WHEN arrival_time IS NOT NULL THEN date || 'T' || arrival_time || ':00' ELSE NULL END,
  lower(to_city),
  lower(from_city),
  NULL,
  CASE mode
    WHEN 'flight'  THEN 'pi-send'
    WHEN 'train'   THEN 'pi-directions'
    WHEN 'ferry'   THEN 'pi-compass'
    WHEN 'daytrip' THEN 'pi-map'
    ELSE 'pi-car' END,
  confirmed,
  'both',
  duration
FROM transport_legs
WHERE lower(to_city) IN (SELECT id FROM cities)
  AND lower(from_city) IN (SELECT id FROM cities);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
SELECT 'ev-' || id, company, fare, NULL, NULL
FROM transport_legs
WHERE lower(to_city) IN (SELECT id FROM cities)
  AND lower(from_city) IN (SELECT id FROM cities);

-- ───────────────────────────────────────────────
-- 5. Migrate non-transport activities → events (type=hito)
--    Derive timestamp from time_slot bucket midpoint
-- ───────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant, card_id, notes)
SELECT
  'ev-' || a.id,
  'hito',
  a.tipo,
  lower(d.city_id) || '-' || replace(d.date, '-', '') || '-' || substr(a.id, 1, 40),
  CASE WHEN a.tag != '' THEN a.tag ELSE substr(a.description, 1, 80) END,
  a.description,
  d.date,
  d.date || 'T' || CASE a.time_slot
    WHEN 'morning'   THEN '10:00:00'
    WHEN 'afternoon' THEN '15:00:00'
    WHEN 'evening'   THEN '20:00:00'
    ELSE '09:00:00' END,
  CASE WHEN a.time_slot = 'all-day' THEN d.date || 'T21:00:00' ELSE NULL END,
  d.city_id,
  NULL,
  NULL,
  CASE a.tipo
    WHEN 'visit'   THEN 'pi-eye'
    WHEN 'food'    THEN 'pi-receipt'
    WHEN 'leisure' THEN 'pi-heart'
    WHEN 'event'   THEN 'pi-sparkles'
    WHEN 'hotel'   THEN 'pi-home'
    ELSE 'pi-circle' END,
  a.confirmed,
  a.variant,
  a.card_id,
  NULL
FROM activities a
JOIN days d ON d.id = a.day_id
WHERE a.tipo != 'transport';

-- ───────────────────────────────────────────────
-- 6. Migrate "local" transport activities (transfers, airport arrivals) → hitos
--    These are NOT inter-city legs, so they stay as hitos (subtype=transfer)
-- ───────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, card_id)
SELECT
  'ev-' || a.id,
  'hito',
  'transfer',
  lower(d.city_id) || '-' || replace(d.date, '-', '') || '-' || substr(a.id, 1, 40),
  CASE WHEN a.tag != '' THEN a.tag ELSE substr(a.description, 1, 80) END,
  a.description,
  d.date,
  d.date || 'T' || CASE a.time_slot
    WHEN 'morning'   THEN '08:00:00'
    WHEN 'afternoon' THEN '15:00:00'
    WHEN 'evening'   THEN '19:00:00'
    ELSE '09:00:00' END,
  NULL,
  d.city_id,
  NULL,
  'pi-car',
  a.confirmed,
  a.variant,
  a.card_id
FROM activities a
JOIN days d ON d.id = a.day_id
WHERE a.tipo = 'transport'
  AND a.id IN (
    'mad-act-apr20-transfer',
    'rom-may09-pm',
    'mad-may09-noche-llegada',
    'mad-may09-noche-regreso-t4'
  );

-- (Los otros activities tipo='transport' — mad-act-apr20-arrival, pmi-apr28-am,
--  bcn-apr28-am, lon-may02-am, rom-may05-am — son duplicados de legs y se
--  descartan. Los legs ya se migraron arriba como traslados.)

-- ───────────────────────────────────────────────
-- 7. Migrate bookings hospedaje → events_estadia
-- ───────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, notes)
SELECT
  'ev-stay-' || b.id,
  'estadia',
  'apartment',
  'stay-' || lower(COALESCE(c.id, 'unknown')) || '-' || replace(c.arrival, '-', ''),
  b.description,
  b.notes,
  c.arrival,
  c.arrival || 'T15:00:00',
  c.departure || 'T11:00:00',
  c.id,
  b.cost_usd,
  'pi-home',
  b.confirmed,
  'both',
  b.accommodation
FROM bookings b
JOIN cities c ON (
  (b.id = 'bk-madrid-airbnb' AND c.id = 'mad') OR
  (b.id = 'bk-bcn-airbnb'    AND c.id = 'bcn')
)
WHERE b.type = 'hospedaje';

INSERT INTO events_estadia (event_id, accommodation, address, platform)
SELECT
  'ev-stay-' || b.id,
  b.description,
  b.accommodation,
  'airbnb'
FROM bookings b
WHERE b.type = 'hospedaje'
  AND b.id IN ('bk-madrid-airbnb', 'bk-bcn-airbnb');

-- ───────────────────────────────────────────────
-- 8. Crear estadías implícitas para ciudades sin booking de hospedaje
-- ───────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, icon, confirmed, variant)
SELECT
  'ev-stay-auto-' || c.id,
  'estadia',
  'hotel',
  'stay-' || c.id || '-' || replace(c.arrival, '-', ''),
  'Alojamiento en ' || c.name,
  NULL,
  c.arrival,
  c.arrival || 'T15:00:00',
  c.departure || 'T11:00:00',
  c.id,
  'pi-home',
  0,
  'both'
FROM cities c
WHERE c.id NOT IN ('mad', 'bcn');

INSERT INTO events_estadia (event_id, accommodation)
SELECT 'ev-stay-auto-' || c.id, 'Hotel por definir en ' || c.name
FROM cities c
WHERE c.id NOT IN ('mad', 'bcn');

-- ───────────────────────────────────────────────
-- 9. Enriquecer traslados con usd y carrier desde bookings
-- ───────────────────────────────────────────────
UPDATE events
SET usd = (
  SELECT b.cost_usd FROM bookings b
  WHERE b.type = 'viaje'
    AND b.sort_date = events.date
    AND lower(b.mode) = events.subtype
    AND b.cost_usd IS NOT NULL
  LIMIT 1
)
WHERE type = 'traslado'
  AND usd IS NULL;

-- ───────────────────────────────────────────────
-- 10. Absorber bookings tipo=hito (entradas a sitios) como events hito
--     (si no existen ya como activity)
-- ───────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant)
SELECT
  'ev-' || b.id,
  'hito',
  'event',
  'booking-' || b.id,
  b.description,
  b.notes,
  b.sort_date,
  b.sort_date || 'T' || COALESCE(b.time, '12:00') || ':00',
  NULL,
  CASE
    WHEN b.id LIKE '%parkguell%' OR b.id LIKE '%park-guell%' OR b.id LIKE '%sagrada%' THEN 'bcn'
    ELSE 'bcn' END,
  b.cost_usd,
  'pi-ticket',
  b.confirmed,
  'both'
FROM bookings b
WHERE b.type = 'hito';

-- ───────────────────────────────────────────────
-- 11. Rename legacy tables (preservan datos para rollback/inspección)
-- ───────────────────────────────────────────────
ALTER TABLE activities      RENAME TO _legacy_activities;
ALTER TABLE transport_legs  RENAME TO _legacy_transport_legs;
ALTER TABLE bookings        RENAME TO _legacy_bookings;
ALTER TABLE days            RENAME TO _legacy_days;
