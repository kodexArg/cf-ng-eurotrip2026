-- Migration 0032: Revert Florence stopover — replace with direct PAR→ROM flight at noon
-- New route: Paris CDG ~12:00 → Roma FCO ~14:00 (May 5)
-- Roma: arrival May 5, 4 nights (May 5–8), departure May 9

-- ─────────────────────────────────────────────────────
-- 1. DELETE — Florence activities
-- ─────────────────────────────────────────────────────

DELETE FROM activities WHERE id IN (
  'fir-may05-am', 'fir-may05-pm', 'fir-may05-ev',
  'fir-may06-am', 'fir-may06-pm'
);

-- ─────────────────────────────────────────────────────
-- 2. DELETE — Florence days
-- ─────────────────────────────────────────────────────

DELETE FROM days WHERE city_id = 'fir';

-- ─────────────────────────────────────────────────────
-- 3. DELETE — Florence transport legs
-- ─────────────────────────────────────────────────────

DELETE FROM transport_legs WHERE id IN ('leg-par-fir', 'leg-fir-rom');

-- ─────────────────────────────────────────────────────
-- 4. DELETE — Florence map routes (must go before POI due to FK)
-- ─────────────────────────────────────────────────────

DELETE FROM map_routes WHERE sku IN ('par-fir', 'fir-rom');
DELETE FROM map_pois WHERE id = 'fir';

-- ─────────────────────────────────────────────────────
-- 5. DELETE — Florence city
-- ─────────────────────────────────────────────────────

DELETE FROM cities WHERE id = 'fir';

-- ─────────────────────────────────────────────────────
-- 6. RESTORE — Roma: arrival May 5, 4 nights
-- ─────────────────────────────────────────────────────

UPDATE cities SET arrival = '2026-05-05', nights = 4 WHERE id = 'rom';

-- ─────────────────────────────────────────────────────
-- 7. RESTORE — rom-day-may05 (arrival day)
-- ─────────────────────────────────────────────────────

INSERT INTO days (id, city_id, date, label, variant) VALUES
  ('rom-day-may05', 'rom', '2026-05-05', 'Llegada · Vuelo desde París al mediodía', 'both');

-- Revert rom-day-may06 label (was changed to arrival label in 0028)
UPDATE days SET label = NULL WHERE id = 'rom-day-may06';

-- ─────────────────────────────────────────────────────
-- 8. RESTORE — Activities for rom-day-may05
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('rom-may05-am', 'rom-day-may05', 'morning',   'Vuelo PAR → FCO · CDG ~12:00 → FCO ~14:00 · check-in hotel', NULL, 0, 'transport', 'Vueling / EasyJet'),
  ('rom-may05-pm', 'rom-day-may05', 'afternoon', 'Pantheon (€5 recomendado) + Fontana di Trevi · circuito central a pie · calles planas', '€5 Pantheon', 0, 'visit', 'Pantheon · Trevi'),
  ('rom-may05-ev', 'rom-day-may05', 'evening',   'Trastevere · cena en trattoria local · barrio fotogénico con adoquines y hiedra', NULL, 0, 'visit', 'Trastevere');

-- ─────────────────────────────────────────────────────
-- 9. INSERT — transport leg PAR→ROM (flight, noon May 5)
-- ─────────────────────────────────────────────────────

INSERT INTO transport_legs (id, from_city, to_city, date, mode, label, duration, cost_hint, confirmed, company) VALUES
  ('leg-par-rom', 'par', 'rom', '2026-05-05', 'flight', 'Vuelo París CDG → Roma FCO · ~12:00 → ~14:00', '~2h', NULL, 0, 'Vueling / EasyJet');

-- ─────────────────────────────────────────────────────
-- 10. INSERT — map route PAR→ROM (flight, southeast via Alps)
-- ─────────────────────────────────────────────────────

INSERT INTO map_routes (sku, from_poi, to_poi, mode, waypoints) VALUES (
  'par-rom',
  'par', 'rom',
  'flight',
  '[[48.8566,2.3522],[48.1,3.8],[47.2,5.3],[46.1,6.9],[44.9,8.5],[43.8,10.0],[43.0,11.2],[42.3,11.9],[41.9028,12.4964]]'
);
