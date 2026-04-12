-- Migration 0029: Fix Madrid escala nocturna city isolation
-- Move mad-day-may09-noche from city 'mad' (Apr 20-24) to a new city 'mad-escala' (May 9-10)
-- so it renders as a separate block AFTER Rome (May 6-9), ordered by arrival date.

-- ─────────────────────────────────────────────────────
-- 1. DELETE activities and day from 'mad' city
-- ─────────────────────────────────────────────────────

DELETE FROM activities WHERE day_id = 'mad-day-may09-noche';
DELETE FROM days WHERE id = 'mad-day-may09-noche';

-- ─────────────────────────────────────────────────────
-- 2. CREATE new city 'mad-escala' for the return stopover
-- ─────────────────────────────────────────────────────

INSERT INTO cities (id, name, slug, arrival, departure, nights, color, lat, lon) VALUES
  ('mad-escala', 'Madrid', 'madrid-escala', '2026-05-09', '2026-05-10', 1, '#e8a74e', 40.4168, -3.7038);

-- ─────────────────────────────────────────────────────
-- 3. RE-INSERT the day under the new city
-- ─────────────────────────────────────────────────────

INSERT INTO days (id, city_id, date, label, variant) VALUES
  ('mad-day-may09-noche', 'mad-escala', '2026-05-09', 'Escala nocturna · Sábado noche en Madrid', 'both');

-- ─────────────────────────────────────────────────────
-- 4. RE-INSERT the 6 activities (same day_id, unchanged)
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('mad-may09-noche-llegada',     'mad-day-may09-noche', 'evening', 'Aterrizaje 23:00 · T4 → Sol en metro L8 (noche de sábado, servicio 24h) · carry-on solo, salida rápida',                    '€5 metro',          0, 'transport', 'Aeropuerto MAD'),
  ('mad-may09-noche-cena',        'mad-day-may09-noche', 'evening', 'Cena tardía en el centro — medianoche del sábado, restaurantes llenos y en pleno servicio',                                   NULL,                0, 'food',      'Cena Madrid'),
  ('mad-may09-noche-plaza-mayor', 'mad-day-may09-noche', 'evening', 'Plaza Mayor de noche — sin turistas, iluminada, el Madrid más auténtico',                                                     'gratis',            0, 'visit',     'Plaza Mayor'),
  ('mad-may09-noche-la-latina',   'mad-day-may09-noche', 'evening', 'Bares de vino y tapas tardías en Cava Baja — el corazón de la noche madrileña',                                               NULL,                0, 'leisure',   'La Latina'),
  ('mad-may09-noche-gran-via',    'mad-day-may09-noche', 'evening', 'Paseo por Gran Vía iluminada — 03:30hs, la ciudad todavía despierta',                                                         'gratis',            0, 'leisure',   'Gran Vía'),
  ('mad-may09-noche-regreso-t4',  'mad-day-may09-noche', 'morning', 'Metro L8 Nuevos Ministerios → T4 · 04:30hs · desayuno en terminal · vuelo IB0105 08:45 a EZE',                               '€5 metro',          0, 'transport', 'Aeropuerto MAD');
