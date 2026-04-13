-- 0020_traslado_labels_and_precise_coords.sql
-- 1. Nuevas columnas `origin_label` / `destination_label` para mostrar
--    el nombre preciso de la estación/aeropuerto en la card de reservas.
-- 2. Reemplaza coords "centro de ciudad" por coords reales de estación/aeropuerto
--    en cada tramo traslado. Datos verificados (Wikipedia + OSM).

ALTER TABLE events ADD COLUMN origin_label TEXT;
ALTER TABLE events ADD COLUMN destination_label TEXT;

-- SCL → MAD (LATAM long-haul, no confirmado acá)
UPDATE events SET
  origin_label      = 'Aeropuerto Arturo Merino Benítez (SCL)',
  destination_label = 'Madrid-Barajas T4 (MAD)',
  origin_lat        = -33.3890,
  origin_lon        = -70.7847,
  destination_lat   = 40.4913,
  destination_lon   = -3.5937
  WHERE id = 'ev-leg-scl-mad';

-- MAD → BCN (AVE)
UPDATE events SET
  origin_label      = 'Madrid Puerta de Atocha (AVE)',
  destination_label = 'Barcelona Sants',
  origin_lat        = 40.4043,
  origin_lon        = -3.6883,
  destination_lat   = 41.3789,
  destination_lon   = 2.1400
  WHERE id = 'ev-leg-mad-bcn';

-- BCN → PMI (Vueling)
UPDATE events SET
  origin_label      = 'Barcelona-El Prat T1 (BCN)',
  destination_label = 'Palma Son Sant Joan (PMI)',
  origin_lat        = 41.2969,
  origin_lon        = 2.0783,
  destination_lat   = 39.5477,
  destination_lon   = 2.7304
  WHERE id = 'ev-leg-bcn-pmi';

-- PMI → STN (Ryanair FR28, confirmado)
UPDATE events SET
  origin_label      = 'Palma Son Sant Joan (PMI)',
  destination_label = 'London Stansted (STN)',
  origin_lat        = 39.5477,
  origin_lon        = 2.7304,
  destination_lat   = 51.8850,
  destination_lon   = 0.2350
  WHERE id = 'ev-leg-pmi-lon';

-- STN → Londres (Stansted Express)
UPDATE events SET
  origin_label      = 'London Stansted (STN)',
  destination_label = 'London Liverpool Street',
  origin_lat        = 51.8850,
  origin_lon        = 0.2350,
  destination_lat   = 51.5184,
  destination_lon   = -0.0811
  WHERE id = 'ev-leg-stn-lon';

-- LON → PAR (Eurostar, pendiente)
UPDATE events SET
  origin_label      = 'London St Pancras International',
  destination_label = 'Paris Gare du Nord',
  origin_lat        = 51.5324,
  origin_lon        = -0.1272,
  destination_lat   = 48.8809,
  destination_lon   = 2.3553,
  timestamp_in      = '2026-05-04T08:01:00',
  timestamp_out     = '2026-05-04T11:29:00'
  WHERE id = 'ev-leg-lon-par';

UPDATE events_traslado SET duration_min = 148 WHERE event_id = 'ev-leg-lon-par';

-- PAR → ROM (vuelo)
UPDATE events SET
  origin_label      = 'Paris Charles de Gaulle T2 (CDG)',
  destination_label = 'Roma Fiumicino T1 (FCO)',
  origin_lat        = 49.0035,
  origin_lon        = 2.5384,
  destination_lat   = 41.8001,
  destination_lon   = 12.2386
  WHERE id = 'ev-leg-par-rom';

-- FCO → MAD (Iberia IB0656)
UPDATE events SET
  origin_label      = 'Roma Fiumicino T1 (FCO)',
  destination_label = 'Madrid-Barajas T4 (MAD)',
  origin_lat        = 41.8001,
  origin_lon        = 12.2386,
  destination_lat   = 40.4913,
  destination_lon   = -3.5937
  WHERE id = 'ev-leg-fco-mad';

-- MAD → EZE (Iberia IB0105)
UPDATE events SET
  origin_label      = 'Madrid-Barajas T4 (MAD)',
  destination_label = 'Buenos Aires Ezeiza (EZE)',
  origin_lat        = 40.4913,
  origin_lon        = -3.5937,
  destination_lat   = -34.8222,
  destination_lon   = -58.5358
  WHERE id = 'ev-leg-mad-eze';
