-- Migration 0025: BCN→PMI flight — departure activity + day labels
-- Flight Barcelona (BCN) → Palma de Mallorca (PMI), April 28, 2026
-- Status: not confirmed (confirmed = 0)
-- leg-bcn-pmi already exists (seeded 0019, updated to flight in 0022)

-- ─────────────────────────────────────────────────────
-- 0. DAYS — ensure bcn-day-apr28 exists
-- (was seeded in 0003 but removed by 0017; 0019 did not re-add it)
-- ─────────────────────────────────────────────────────

INSERT OR IGNORE INTO days (id, city_id, date, label, variant) VALUES
  ('bcn-day-apr28', 'bcn', '2026-04-28', NULL, 'both');

-- ─────────────────────────────────────────────────────
-- 1. DAYS — update labels to reflect flight (not ferry)
-- ─────────────────────────────────────────────────────

-- BCN: Apr 28 is departure day to PMI
UPDATE days SET label = 'Salida · Vuelo BCN → PMI'
  WHERE id = 'bcn-day-apr28';

-- PMI: Apr 28 arrival was labeled as ferry — update to flight
UPDATE days SET label = 'Llegada vuelo desde BCN · check-in hotel'
  WHERE id = 'pmi-day-apr28';

-- ─────────────────────────────────────────────────────
-- 2. ACTIVITIES — BCN departure (bcn-day-apr28)
-- No activity existed yet for this day
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('bcn-apr28-am', 'bcn-day-apr28', 'morning',
   'Vuelo BCN → PMI · salida temprana · traslado aeropuerto El Prat (T1/T2)',
   NULL, 0, 'transport', 'Vueling / Ryanair');
