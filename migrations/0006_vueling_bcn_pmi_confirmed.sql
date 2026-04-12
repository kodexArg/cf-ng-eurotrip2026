-- 0006_vueling_bcn_pmi_confirmed.sql
-- Confirm Vueling flight BCN → PMI on Apr 28, 2026.
-- Departure 09:05, arrival 10:00. Localizador UMSDND. Costo USD 95 (2 pax, sin bodega).

-- ─────────────────────────────────────────────────────
-- 1. transport_legs — confirm + times + carrier
-- ─────────────────────────────────────────────────────
UPDATE transport_legs
SET confirmed      = 1,
    company        = 'Vueling',
    departure_time = '09:05',
    arrival_time   = '10:00',
    duration       = '~55min',
    label          = 'Vueling BCN → PMI'
WHERE id = 'leg-bcn-pmi';

-- ─────────────────────────────────────────────────────
-- 2. activities — mark BCN departure morning as confirmed
-- ─────────────────────────────────────────────────────
UPDATE activities
SET confirmed   = 1,
    description = 'Vuelo Vueling BCN → PMI · 09:05 → 10:00 · traslado aeropuerto El Prat',
    tag         = 'Vueling'
WHERE id = 'bcn-apr28-am';

-- ─────────────────────────────────────────────────────
-- 3. bookings — add viaje entry with confirmation code + cost
-- ─────────────────────────────────────────────────────
INSERT INTO bookings (id, type, sort_date, time, description, origin, destination, mode, carrier, cost_usd, confirmed, notes)
VALUES (
  'bk-bcn-pmi',
  'viaje',
  '2026-04-28',
  '09:05',
  'Vueling BCN → PMI · Llegada 10:00 · 2 pasajes',
  'Barcelona',
  'Palma de Mallorca',
  'flight',
  'Vueling',
  95,
  1,
  'Localizador: UMSDND'
);
