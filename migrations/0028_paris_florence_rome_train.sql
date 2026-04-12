-- Migration 0028: Replace PAR→ROM flight with train via Florence overnight
-- New route: Paris Gare de Lyon → Milan → Florence SMN (May 5, overnight)
--            Florence SMN → Roma Termini (May 6 morning)
-- Florence becomes a 1-night city (fir)

-- ─────────────────────────────────────────────────────
-- 1. DELETE — activities for ROM May 5 (replaced by Florence)
-- ─────────────────────────────────────────────────────

DELETE FROM activities WHERE id IN ('rom-may05-am', 'rom-may05-pm', 'rom-may05-ev');

-- ─────────────────────────────────────────────────────
-- 2. DELETE — ROM May 5 day (replaced by Florence day)
-- ─────────────────────────────────────────────────────

DELETE FROM days WHERE id = 'rom-day-may05';

-- ─────────────────────────────────────────────────────
-- 3. DELETE — old PAR→ROM transport leg and map route
-- ─────────────────────────────────────────────────────

DELETE FROM transport_legs WHERE id = 'leg-par-rom';
DELETE FROM map_routes WHERE sku = 'par-rom';

-- ─────────────────────────────────────────────────────
-- 4. UPDATE — ROM arrival shifts to May 6, nights 4→3
-- ─────────────────────────────────────────────────────

UPDATE cities SET arrival = '2026-05-06', nights = 3 WHERE id = 'rom';

-- ─────────────────────────────────────────────────────
-- 5. INSERT — Florence city
-- ─────────────────────────────────────────────────────

INSERT INTO cities (id, name, slug, arrival, departure, nights, color, lat, lon) VALUES
  ('fir', 'Florencia', 'florencia', '2026-05-05', '2026-05-06', 1, '#d97706', 43.7696, 11.2558);

-- ─────────────────────────────────────────────────────
-- 6. INSERT — Florence days
-- ─────────────────────────────────────────────────────

INSERT INTO days (id, city_id, date, label, variant) VALUES
  ('fir-day-may05', 'fir', '2026-05-05', 'Llegada · Florencia por la tarde', 'both'),
  ('fir-day-may06', 'fir', '2026-05-06', 'Salida · Tren a Roma', 'both');

-- ─────────────────────────────────────────────────────
-- 7. INSERT — Florence activities
-- ─────────────────────────────────────────────────────

-- May 5 · arrival via train from Paris
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('fir-may05-am', 'fir-day-may05', 'morning',   'Frecciarossa Paris → Milan · 06:28 Gare de Lyon → 13:50 Milan Centrale · 7h22m',                          NULL, 0, 'transport', 'Trenitalia'),
  ('fir-may05-pm', 'fir-day-may05', 'afternoon', 'Conexion Milan · Frecciarossa 14:50 → Florencia SMN ~17:40 · ~2h50m',                                      NULL, 0, 'transport', 'Trenitalia'),
  ('fir-may05-ev', 'fir-day-may05', 'evening',   'Piazza della Signoria y Duomo de noche · Cena en Oltrarno · Ponte Vecchio al amanecer manana',              NULL, 0, 'visit',     'Florencia');

-- May 6 · morning departure to Rome
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('fir-may06-am', 'fir-day-may06', 'morning',   'Frecciarossa Florencia SMN → Roma Termini · ~09:00 → 10:35 · 1h35m por la Toscana',                        NULL, 0, 'transport', 'Trenitalia'),
  ('fir-may06-pm', 'fir-day-may06', 'afternoon', 'Opcional: madrugada en Ponte Vecchio antes del tren · ultima vista del Arno',                               NULL, 0, 'visit',     'Florencia');

-- ─────────────────────────────────────────────────────
-- 8. INSERT — new transport legs
-- ─────────────────────────────────────────────────────

INSERT INTO transport_legs (id, from_city, to_city, date, mode, label, duration, cost_hint, confirmed, company) VALUES
  ('leg-par-fir', 'par', 'fir', '2026-05-05', 'train', 'Frecciarossa Paris → Milan → Florencia · 06:28 → ~17:40', '~11h', NULL, 0, 'Trenitalia'),
  ('leg-fir-rom', 'fir', 'rom', '2026-05-06', 'train', 'Frecciarossa Florencia SMN → Roma Termini · ~09:00 → 10:35', '~1h35m', NULL, 0, 'Trenitalia');

-- ─────────────────────────────────────────────────────
-- 9. MAP — add Florence POI + replace par-rom route with two train routes
-- ─────────────────────────────────────────────────────

INSERT INTO map_pois (id, name, type, lat, lon, color, city_id) VALUES
  ('fir', 'Florencia', 'city', 43.7696, 11.2558, '#d97706', 'fir');

-- PAR → FIR (train, through Alps via Lyon, Turin, Milan, then south to Florence)
INSERT INTO map_routes (sku, from_poi, to_poi, mode, waypoints) VALUES (
  'par-fir',
  'par', 'fir',
  'train',
  '[[48.8566,2.3522],[47.8,3.8],[46.8,4.8],[45.8,5.5],[45.5,6.2],[45.4,7.0],[45.3,7.7],[45.1,8.6],[45.4,9.2],[45.0,10.0],[44.4,10.8],[43.7696,11.2558]]'
);

-- FIR → ROM (train, south through Tuscany and Lazio)
INSERT INTO map_routes (sku, from_poi, to_poi, mode, waypoints) VALUES (
  'fir-rom',
  'fir', 'rom',
  'train',
  '[[43.7696,11.2558],[43.3,11.6],[42.9,11.8],[42.5,12.0],[42.1,12.2],[41.9028,12.4964]]'
);

-- ─────────────────────────────────────────────────────
-- 10. UPDATE — ROM May 6 day label (now arrival day)
-- ─────────────────────────────────────────────────────

UPDATE days SET label = 'Llegada · Primer dia en Roma' WHERE id = 'rom-day-may06';
