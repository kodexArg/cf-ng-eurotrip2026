-- Migration 0027: Madrid nocturna · escala de regreso FCO→MAD→EZE
-- IB0656 llega T4 23:00 sábado 9 mayo · IB0105 sale 08:45 domingo 10 mayo
-- Metro L8 (Aeropuerto T4 ↔ Nuevos Ministerios) opera 24h los fines de semana
-- Viajeros con carry-on únicamente (10kg c/u) — salida rápida sin espera de equipaje

-- ─────────────────────────────────────────────────────
-- 1. DÍA — escala nocturna en Madrid (9 mayo)
-- ─────────────────────────────────────────────────────

INSERT INTO days (id, city_id, date, label, variant) VALUES
  ('mad-day-may09-noche', 'mad', '2026-05-09', 'Escala nocturna · Sábado noche en Madrid', 'both');

-- ─────────────────────────────────────────────────────
-- 2. ACTIVITIES — Madrid noche (may09) y madrugada (may10)
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('mad-may09-noche-llegada',     'mad-day-may09-noche', 'evening', 'Aterrizaje 23:00 · T4 → Sol en metro L8 (noche de sábado, servicio 24h) · carry-on solo, salida rápida',                    '€5 metro',          0, 'transport', 'Aeropuerto MAD'),
  ('mad-may09-noche-cena',        'mad-day-may09-noche', 'evening', 'Cena tardía en el centro — medianoche del sábado, restaurantes llenos y en pleno servicio',                                   NULL,                0, 'food',      'Cena Madrid'),
  ('mad-may09-noche-plaza-mayor', 'mad-day-may09-noche', 'evening', 'Plaza Mayor de noche — sin turistas, iluminada, el Madrid más auténtico',                                                     'gratis',            0, 'visit',     'Plaza Mayor'),
  ('mad-may09-noche-la-latina',   'mad-day-may09-noche', 'evening', 'Bares de vino y tapas tardías en Cava Baja — el corazón de la noche madrileña',                                               NULL,                0, 'leisure',   'La Latina'),
  ('mad-may09-noche-gran-via',    'mad-day-may09-noche', 'evening', 'Paseo por Gran Vía iluminada — 03:30hs, la ciudad todavía despierta',                                                         'gratis',            0, 'leisure',   'Gran Vía'),
  ('mad-may09-noche-regreso-t4',  'mad-day-may09-noche', 'morning', 'Metro L8 Nuevos Ministerios → T4 · 04:30hs · desayuno en terminal · vuelo IB0105 08:45 a EZE',                               '€5 metro',          0, 'transport', 'Aeropuerto MAD');
