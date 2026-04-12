-- Migration 0030: Revert hardcoded 'mad-escala' city from migration 0029
-- The clustering logic in the API now handles non-contiguous city days generically.
-- Move mad-day-may09-noche back under city 'mad' and delete the artificial 'mad-escala' city.

-- ─────────────────────────────────────────────────────
-- 1. DELETE activities and day from 'mad-escala'
-- ─────────────────────────────────────────────────────

DELETE FROM activities WHERE day_id = 'mad-day-may09-noche';
DELETE FROM days WHERE id = 'mad-day-may09-noche';
DELETE FROM cities WHERE id = 'mad-escala';

-- ─────────────────────────────────────────────────────
-- 2. RE-INSERT the day under the original 'mad' city
-- ─────────────────────────────────────────────────────

INSERT INTO days (id, city_id, date, label, variant) VALUES
  ('mad-day-may09-noche', 'mad', '2026-05-09', 'Escala nocturna · Sábado noche en Madrid', 'both');

-- ─────────────────────────────────────────────────────
-- 3. RE-INSERT the 6 activities (same day_id, unchanged)
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('mad-may09-noche-llegada',     'mad-day-may09-noche', 'evening', 'Aterrizaje 23:00 · T4 → Sol en metro L8 (noche de sábado, servicio 24h) · carry-on solo, salida rápida',  '€5 metro', 0, 'transport', 'Aeropuerto MAD'),
  ('mad-may09-noche-cena',        'mad-day-may09-noche', 'evening', 'Cena tardía en el centro — medianoche del sábado, restaurantes llenos y en pleno servicio',                 NULL,       0, 'food',      'Cena Madrid'),
  ('mad-may09-noche-plaza-mayor', 'mad-day-may09-noche', 'evening', 'Plaza Mayor de noche — sin turistas, iluminada, el Madrid más auténtico',                                   'gratis',   0, 'visit',     'Plaza Mayor'),
  ('mad-may09-noche-la-latina',   'mad-day-may09-noche', 'evening', 'Bares de vino y tapas tardías en Cava Baja — el corazón de la noche madrileña',                             NULL,       0, 'leisure',   'La Latina'),
  ('mad-may09-noche-gran-via',    'mad-day-may09-noche', 'evening', 'Paseo por Gran Vía iluminada — 03:30hs, la ciudad todavía despierta',                                       'gratis',   0, 'leisure',   'Gran Vía'),
  ('mad-may09-noche-regreso-t4',  'mad-day-may09-noche', 'morning', 'Metro L8 Nuevos Ministerios → T4 · 04:30hs · desayuno en terminal · vuelo IB0105 08:45 a EZE',             '€5 metro', 0, 'transport', 'Aeropuerto MAD');
