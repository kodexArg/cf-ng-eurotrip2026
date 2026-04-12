-- Migration 0021: Reschedule PMI/PAR/ROM
-- New distribution: Palma 5n (Apr28–May3) · París 2n (May3–May5) · Roma 4n (May5–May9)
-- Motivation: extend cheap cities (Palma, Roma), minimize expensive one (París)

-- ─────────────────────────────────────────────────────
-- 1. CITIES — update dates and nights
-- ─────────────────────────────────────────────────────

UPDATE cities SET arrival = '2026-04-28', departure = '2026-05-03', nights = 5
  WHERE id = 'pmi';

UPDATE cities SET arrival = '2026-05-03', departure = '2026-05-05', nights = 2
  WHERE id = 'par';

UPDATE cities SET arrival = '2026-05-05', departure = '2026-05-09', nights = 4
  WHERE id = 'rom';

-- ─────────────────────────────────────────────────────
-- 2. DAYS — replace PMI/PAR/ROM days
-- ─────────────────────────────────────────────────────

DELETE FROM days WHERE city_id IN ('pmi', 'par', 'rom');

-- Palma de Mallorca: Apr 28 – May 2 (5 días)
INSERT INTO days (id, city_id, date, label, variant) VALUES
  ('pmi-day-apr28', 'pmi', '2026-04-28', 'Llegada ferry · mañana libre', 'both'),
  ('pmi-day-apr29', 'pmi', '2026-04-29', NULL, 'both'),
  ('pmi-day-apr30', 'pmi', '2026-04-30', NULL, 'both'),
  ('pmi-day-may01', 'pmi', '2026-05-01', NULL, 'both'),
  ('pmi-day-may02', 'pmi', '2026-05-02', NULL, 'both');

-- París: May 3 – May 4 (2 días)
INSERT INTO days (id, city_id, date, label, variant) VALUES
  ('par-day-may03', 'par', '2026-05-03', NULL, 'both'),
  ('par-day-may04', 'par', '2026-05-04', NULL, 'both');

-- Roma: May 5 – May 8 (4 días)
INSERT INTO days (id, city_id, date, label, variant) VALUES
  ('rom-day-may05', 'rom', '2026-05-05', NULL, 'both'),
  ('rom-day-may06', 'rom', '2026-05-06', NULL, 'both'),
  ('rom-day-may07', 'rom', '2026-05-07', NULL, 'both'),
  ('rom-day-may08', 'rom', '2026-05-08', NULL, 'both');

-- ─────────────────────────────────────────────────────
-- 3. TRANSPORT LEGS — update departure dates
-- ─────────────────────────────────────────────────────

-- BCN→PMI stays Apr 28 (ferry nocturno ~23:30, llega madrugada Apr 29)
UPDATE transport_legs SET
  label    = 'Ferry Barcelona → Palma · nocturno ~23:30',
  duration = '~7h'
WHERE id = 'leg-bcn-pmi';

-- PMI→PAR: now May 3
UPDATE transport_legs SET date = '2026-05-03',
  label = 'Vuelo Palma → París'
WHERE id = 'leg-pmi-par';

-- PAR→ROM: now May 5
UPDATE transport_legs SET date = '2026-05-05',
  label = 'Vuelo París → Roma'
WHERE id = 'leg-par-rom';

-- ─────────────────────────────────────────────────────
-- 4. MAP ROUTES — add legs not yet mapped
-- ─────────────────────────────────────────────────────

-- Remove old map_routes for these legs if they exist
DELETE FROM map_routes WHERE sku IN ('bcn-pmi', 'pmi-par', 'par-rom');

-- BCN → PMI (ferry, Mediterráneo occidental)
INSERT INTO map_routes (sku, from_poi, to_poi, mode, waypoints) VALUES (
  'bcn-pmi',
  'bcn', 'pmi',
  'ferry',
  '[[41.3874,2.1686],[41.1,2.25],[40.7,2.38],[40.3,2.5],[39.9,2.57],[39.5696,2.6502]]'
);

-- PMI → PAR (vuelo, norte por Francia)
INSERT INTO map_routes (sku, from_poi, to_poi, mode, waypoints) VALUES (
  'pmi-par',
  'pmi', 'par',
  'flight',
  '[[39.5696,2.6502],[40.5,2.6],[41.5,2.52],[42.7,2.5],[43.9,2.46],[45.1,2.42],[46.3,2.4],[47.5,2.37],[48.8566,2.3522]]'
);

-- PAR → ROM (vuelo, sureste por Alpes)
INSERT INTO map_routes (sku, from_poi, to_poi, mode, waypoints) VALUES (
  'par-rom',
  'par', 'rom',
  'flight',
  '[[48.8566,2.3522],[48.1,3.8],[47.2,5.3],[46.1,6.9],[44.9,8.5],[43.8,10.0],[43.0,11.2],[42.3,11.9],[41.9028,12.4964]]'
);

-- ROM → MAD (already exists as rom-mad? add if missing)
INSERT OR IGNORE INTO map_routes (sku, from_poi, to_poi, mode, waypoints) VALUES (
  'rom-mad',
  'rom', 'mad',
  'flight',
  '[[41.9028,12.4964],[41.5,11.2],[41.0,9.8],[40.5,8.2],[40.0,6.5],[39.7,4.8],[39.5,3.1],[39.5,1.5],[40.0,-0.1],[40.4,-1.6],[40.4,-3.7038]]'
);
