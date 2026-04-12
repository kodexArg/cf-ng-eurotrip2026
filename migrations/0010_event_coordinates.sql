-- 0010_event_coordinates.sql
-- Add geographic coordinates to events table + rename legacy map tables.
-- Semantics:
--   origin_*       = departure point (traslado) | stay/landmark location (estadia/hito)
--   destination_*  = arrival point (traslado)   | optional closing point (hito) | NULL (estadia)
-- NOTE: city_in = destination city; city_out = origin city (inverted semantics per unified model).

-- ───────────────────────────────────────────────
-- 1. Add coordinate columns to events
-- ───────────────────────────────────────────────
ALTER TABLE events ADD COLUMN origin_lat      REAL;
ALTER TABLE events ADD COLUMN origin_lon      REAL;
ALTER TABLE events ADD COLUMN destination_lat REAL;
ALTER TABLE events ADD COLUMN destination_lon REAL;

-- ───────────────────────────────────────────────
-- 2. Rename legacy map tables (preserve for rollback / other consumers)
-- ───────────────────────────────────────────────
ALTER TABLE map_pois   RENAME TO _legacy_map_pois;
ALTER TABLE map_routes RENAME TO _legacy_map_routes;

-- ───────────────────────────────────────────────
-- 3. Populate traslado coordinates
--    origin_* = city_out (departure), destination_* = city_in (arrival)
--    Coordinates from cities table or known airport/hub coordinates.
-- ───────────────────────────────────────────────

-- ev-leg-scl-mad: Santiago (SCL) → Madrid (MAD)
-- scl: -33.4489, -70.6693 (SCL airport)  mad: 40.4168, -3.7038
UPDATE events
SET origin_lat = -33.4489, origin_lon = -70.6693,
    destination_lat = 40.4168, destination_lon = -3.7038
WHERE id = 'ev-leg-scl-mad';

-- ev-leg-mad-bcn: Madrid → Barcelona (train)
UPDATE events
SET origin_lat = 40.4168, origin_lon = -3.7038,
    destination_lat = 41.3874, destination_lon = 2.1686
WHERE id = 'ev-leg-mad-bcn';

-- ev-leg-bcn-pmi: Barcelona → Palma de Mallorca (flight)
-- bcn: 41.3874, 2.1686 (BCN airport nearby)  pmi: 39.5696, 2.6502
UPDATE events
SET origin_lat = 41.3874, origin_lon = 2.1686,
    destination_lat = 39.5696, destination_lon = 2.6502
WHERE id = 'ev-leg-bcn-pmi';

-- ev-leg-pmi-lon: Palma → Londres (flight)
-- lon: 51.5074, -0.1278 (city center; actual airport STN/LGW but city is close enough)
UPDATE events
SET origin_lat = 39.5696, origin_lon = 2.6502,
    destination_lat = 51.5074, destination_lon = -0.1278
WHERE id = 'ev-leg-pmi-lon';

-- ev-leg-lon-rom: Londres → Roma (flight)
-- lon: 51.5074, -0.1278  rom: 41.9028, 12.4964
UPDATE events
SET origin_lat = 51.5074, origin_lon = -0.1278,
    destination_lat = 41.9028, destination_lon = 12.4964
WHERE id = 'ev-leg-lon-rom';

-- ev-leg-fco-mad: Roma (FCO) → Madrid (flight)
-- city_out=rom, city_in=mad
UPDATE events
SET origin_lat = 41.9028, origin_lon = 12.4964,
    destination_lat = 40.4168, destination_lon = -3.7038
WHERE id = 'ev-leg-fco-mad';

-- ev-leg-mad-eze: Madrid → Buenos Aires (EZE) (flight)
-- eze: -34.8222, -58.5358 (EZE airport)
UPDATE events
SET origin_lat = 40.4168, origin_lon = -3.7038,
    destination_lat = -34.8222, destination_lon = -58.5358
WHERE id = 'ev-leg-mad-eze';

-- ───────────────────────────────────────────────
-- 4. Populate estadia coordinates
--    origin_* = city center of city_in (the stay city)
--    destination_* = NULL (single-point event)
-- ───────────────────────────────────────────────

-- Madrid estadias
UPDATE events
SET origin_lat = 40.4168, origin_lon = -3.7038
WHERE type = 'estadia' AND city_in = 'mad';

-- Barcelona estadias
UPDATE events
SET origin_lat = 41.3874, origin_lon = 2.1686
WHERE type = 'estadia' AND city_in = 'bcn';

-- Palma de Mallorca estadias
UPDATE events
SET origin_lat = 39.5696, origin_lon = 2.6502
WHERE type = 'estadia' AND city_in = 'pmi';

-- Londres estadias
UPDATE events
SET origin_lat = 51.5074, origin_lon = -0.1278
WHERE type = 'estadia' AND city_in = 'lon';

-- Roma estadias
UPDATE events
SET origin_lat = 41.9028, origin_lon = 12.4964
WHERE type = 'estadia' AND city_in = 'rom';

-- ───────────────────────────────────────────────
-- 5. Populate hito coordinates
--    Fallback: city center of city_in
--    destination_* = NULL (no distinct closing point)
-- ───────────────────────────────────────────────

-- Madrid hitos
UPDATE events
SET origin_lat = 40.4168, origin_lon = -3.7038
WHERE type = 'hito' AND city_in = 'mad';

-- Barcelona hitos
UPDATE events
SET origin_lat = 41.3874, origin_lon = 2.1686
WHERE type = 'hito' AND city_in = 'bcn';

-- Palma de Mallorca hitos
UPDATE events
SET origin_lat = 39.5696, origin_lon = 2.6502
WHERE type = 'hito' AND city_in = 'pmi';

-- Londres hitos
UPDATE events
SET origin_lat = 51.5074, origin_lon = -0.1278
WHERE type = 'hito' AND city_in = 'lon';

-- Roma hitos
UPDATE events
SET origin_lat = 41.9028, origin_lon = 12.4964
WHERE type = 'hito' AND city_in = 'rom';
