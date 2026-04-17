-- 0077_traslado_soller_palma.sql
-- Gap de 33km entre Port de Sóller y Palma (May 1) sin traslado explícito.
-- El día 1 de mayo se alquila auto; este traslado cubre el regreso al centro de Palma.
--
-- Contexto del gap:
--   Actividades tarde Port de Sóller (kayak, etc.) terminan ~16:00
--   Paseo Marítimo de Palma arranca 17:00
--   Distancia: ~33km, ~40 min por Ma-11 via Alfabia
--
-- Timestamps elegidos:
--   timestamp_in  = 2026-05-01T16:00:00+02:00  (salida Port de Sóller)
--   timestamp_out = 2026-05-01T16:40:00+02:00  (llegada Palma, ~40 min)
--   Deja 20 min de buffer antes del Paseo Marítimo (17:00)

INSERT INTO events (
  id, type, subtype, slug, title,
  description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed,
  variant,
  origin_label, destination_label,
  origin_lat, origin_lon,
  destination_lat, destination_lon,
  mandatory
) VALUES (
  'ev-leg-pmi-may01-car-soller-palma',
  'traslado',
  'car',
  'car-pmi-20260501-soller-palma',
  'Auto · Port de Sóller → Palma',
  'Regreso en auto alquilado desde Port de Sóller al centro de Palma. Ma-11 vía Alfabia (~33km, ~40 min).',
  '2026-05-01',
  '2026-05-01T16:00:00+02:00',
  '2026-05-01T16:40:00+02:00',
  'pmi',
  'pmi',
  0,
  'pi-car',
  0,
  'both',
  'Port de Sóller',
  'Palma de Mallorca',
  39.7954, 2.6946,
  39.5696, 2.6502,
  0
);

INSERT INTO events_traslado (
  event_id,
  company,
  fare,
  vehicle_code,
  duration_min
) VALUES (
  'ev-leg-pmi-may01-car-soller-palma',
  'Car rental',
  '0',
  'car',
  40
);
