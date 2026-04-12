-- Migration 0019: Seed full itinerary for eurotrip2026
-- Creates days for BCN, PMI, PAR, ROM; Sagrada Família activity; transport legs

-- ─────────────────────────────────────────────────────
-- 1. DAYS
-- ─────────────────────────────────────────────────────

-- Barcelona (bcn): Apr 24-27
INSERT INTO days (id, city_id, date, label, variant) VALUES
  ('bcn-day-apr24', 'bcn', '2026-04-24', NULL, 'both'),
  ('bcn-day-apr25', 'bcn', '2026-04-25', NULL, 'both'),
  ('bcn-day-apr26', 'bcn', '2026-04-26', NULL, 'both'),
  ('bcn-day-apr27', 'bcn', '2026-04-27', NULL, 'both');

-- Palma de Mallorca (pmi): Apr 28 - May 1
INSERT INTO days (id, city_id, date, label, variant) VALUES
  ('pmi-day-apr28', 'pmi', '2026-04-28', NULL, 'both'),
  ('pmi-day-apr29', 'pmi', '2026-04-29', NULL, 'both'),
  ('pmi-day-apr30', 'pmi', '2026-04-30', NULL, 'both'),
  ('pmi-day-may01', 'pmi', '2026-05-01', NULL, 'both');

-- París (par): May 2-5
INSERT INTO days (id, city_id, date, label, variant) VALUES
  ('par-day-may02', 'par', '2026-05-02', NULL, 'both'),
  ('par-day-may03', 'par', '2026-05-03', NULL, 'both'),
  ('par-day-may04', 'par', '2026-05-04', NULL, 'both'),
  ('par-day-may05', 'par', '2026-05-05', NULL, 'both');

-- Roma (rom): May 6-8
INSERT INTO days (id, city_id, date, label, variant) VALUES
  ('rom-day-may06', 'rom', '2026-05-06', NULL, 'both'),
  ('rom-day-may07', 'rom', '2026-05-07', NULL, 'both'),
  ('rom-day-may08', 'rom', '2026-05-08', NULL, 'both');

-- ─────────────────────────────────────────────────────
-- 2. ACTIVITIES
-- ─────────────────────────────────────────────────────

-- Sagrada Família (bcn-day-apr27)
INSERT INTO activities (id, day_id, time_slot, description, confirmed, variant, tipo, tag) VALUES
  (
    'bcn-act-apr27-sagrada',
    'bcn-day-apr27',
    'afternoon',
    'Sagrada Família — acceso básico + Torre del Nacimiento. Ticket comprado.',
    1,
    'both',
    'visit',
    'Sagrada Família'
  );

-- ─────────────────────────────────────────────────────
-- 3. TRANSPORT LEGS
-- ─────────────────────────────────────────────────────

-- Confirmed
INSERT INTO transport_legs (id, from_city, to_city, date, mode, label, duration, cost_hint, confirmed) VALUES
  ('leg-mad-bcn', 'mad', 'bcn', '2026-04-24', 'train', 'AVE Madrid → Barcelona Sants', NULL, NULL, 1);

-- Unconfirmed
INSERT INTO transport_legs (id, from_city, to_city, date, mode, label, duration, cost_hint, confirmed) VALUES
  ('leg-bcn-pmi', 'bcn', 'pmi', '2026-04-28', 'ferry', 'Ferry Barcelona → Palma de Mallorca', '~7h', NULL, 0),
  ('leg-pmi-par', 'pmi', 'par', '2026-05-02', 'flight', 'Vuelo Palma → París', NULL, NULL, 0),
  ('leg-par-rom', 'par', 'rom', '2026-05-06', 'flight', 'Vuelo París → Roma', NULL, NULL, 0);
