-- 20260529-bcn-pmi-flight-peguera-bus.sql
-- Dibuja en el mapa el vuelo de llegada a Mallorca y agrega los traslados
-- en bus Palma (PMI) <-> Peguera (Apart Hotel FLOR).
--
-- Contexto:
--   - El vuelo BCN->PMI YA EXISTE y es real/confirmado (ev-leg-bcn-pmi,
--     "Vueling BASIC", booking ref UMSDND, sale 10:00 / llega 10:55). Solo le
--     faltaban las coordenadas origen/destino, por eso no se dibujaba en el mapa.
--     Aqui SOLO se le agregan las coords (no se toca titulo/hora/booking).
--   - Faltaban los traslados en bus Palma (PMI) <-> Peguera, donde se alojaron
--     en el Apart Hotel FLOR (estadia ev-stay-auto-pmi). Se agregan con waypoints
--     por la Via de Cintura + Ma-1 (Palmanova / Santa Ponca, ~26 km).
--   - La vuelta reemplaza el Uber Peguera->PMI de las 03:00 (ev-pmi-may02-uber-airport)
--     por un bus con waypoints, manteniendo la conexion al vuelo FR28 (06:00).
--
-- Coords aeropuertos: BCN El Prat 41.2974,2.0833 · PMI Son Sant Joan 39.5517,2.7388
-- Peguera (centro / Apart FLOR): ~39.5358,2.4472
--
-- Idempotente: borra los buses/uber antes de insertarlos.

-- =====================================================================
-- 1. Vuelo existente Vueling BCN -> PMI: agregar coords para el mapa
-- =====================================================================
UPDATE events
SET origin_lat = 41.2974, origin_lon = 2.0833,
    destination_lat = 39.5517, destination_lon = 2.7388
WHERE id = 'ev-leg-bcn-pmi';

-- =====================================================================
-- Limpieza idempotente (buses nuevos + Uber a reemplazar)
-- =====================================================================
DELETE FROM events_traslado
  WHERE event_id IN ('ev-leg-pmi-peguera-bus', 'ev-leg-peguera-pmi-bus', 'ev-pmi-may02-uber-airport');
DELETE FROM events
  WHERE id IN ('ev-leg-pmi-peguera-bus', 'ev-leg-peguera-pmi-bus', 'ev-pmi-may02-uber-airport');

-- =====================================================================
-- 2. Bus Palma (PMI) -> Peguera (llegada, antes del check-in FLOR 12:30)
-- =====================================================================
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant,
  notes, origin_label, destination_label,
  origin_lat, origin_lon, destination_lat, destination_lon, waypoints
) VALUES (
  'ev-leg-pmi-peguera-bus', 'traslado', 'bus',
  'bus-pmi-peguera-20260428',
  'Bus · Palma (PMI) → Peguera',
  'Aeropuerto de Palma (PMI) → Peguera (Apart Hotel FLOR). Via de Cintura + Ma-1 por Palmanova y Santa Ponça (~26 km).',
  '2026-04-28',
  '2026-04-28T11:15:00+02:00',
  '2026-04-28T12:05:00+02:00',
  'pmi', 'pmi', NULL,
  'ms-directions_bus',
  0, 'both',
  'Traslado en bus desde el aeropuerto a Peguera (~50 min) tras aterrizar el Vueling.',
  'Palma de Mallorca (PMI)', 'Peguera',
  39.5517, 2.7388,
  39.5358, 2.4472,
  '[[39.5517,2.7388],[39.5610,2.6800],[39.5560,2.6200],[39.5450,2.5950],[39.5295,2.5340],[39.5135,2.4790],[39.5220,2.4560],[39.5358,2.4472]]'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, seat, duration_min)
VALUES ('ev-leg-pmi-peguera-bus', 'Bus', NULL, NULL, NULL, 50);

-- =====================================================================
-- 3. Vuelta: bus Peguera -> Palma (PMI) — reemplaza el Uber de las 03:00
-- =====================================================================
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant,
  notes, origin_label, destination_label,
  origin_lat, origin_lon, destination_lat, destination_lon, waypoints
) VALUES (
  'ev-leg-peguera-pmi-bus', 'traslado', 'bus',
  'bus-peguera-pmi-20260502',
  'Bus · Peguera → Palma (PMI)',
  'Peguera (Apart Hotel FLOR) → Aeropuerto de Palma (PMI) para el vuelo FR28 (06:00). Ma-1 + Via de Cintura (~26 km).',
  '2026-05-02',
  '2026-05-02T03:30:00+02:00',
  '2026-05-02T04:20:00+02:00',
  'pmi', 'pmi', NULL,
  'ms-directions_bus',
  0, 'both',
  'Vuelta en bus a PMI para el vuelo de salida (~50 min). Reemplaza el Uber previo.',
  'Peguera', 'Palma de Mallorca (PMI)',
  39.5358, 2.4472,
  39.5517, 2.7388,
  '[[39.5358,2.4472],[39.5220,2.4560],[39.5135,2.4790],[39.5295,2.5340],[39.5450,2.5950],[39.5560,2.6200],[39.5610,2.6800],[39.5517,2.7388]]'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, seat, duration_min)
VALUES ('ev-leg-peguera-pmi-bus', 'Bus', NULL, NULL, NULL, 50);
