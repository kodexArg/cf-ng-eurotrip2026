-- 0010_event_coordinates_remote.sql
-- Remote-only variant: map_pois/map_routes already renamed on remote.
-- Adds coordinate columns + populates data.

-- ───────────────────────────────────────────────
-- 1. Add coordinate columns to events
--    (origin_lat already added manually above; add remaining 3)
-- ───────────────────────────────────────────────
ALTER TABLE events ADD COLUMN origin_lon      REAL;
ALTER TABLE events ADD COLUMN destination_lat REAL;
ALTER TABLE events ADD COLUMN destination_lon REAL;

-- ───────────────────────────────────────────────
-- 2. Populate traslado coordinates
-- ───────────────────────────────────────────────

UPDATE events
SET origin_lat = -33.4489, origin_lon = -70.6693,
    destination_lat = 40.4168, destination_lon = -3.7038
WHERE id = 'ev-leg-scl-mad';

UPDATE events
SET origin_lat = 40.4168, origin_lon = -3.7038,
    destination_lat = 41.3874, destination_lon = 2.1686
WHERE id = 'ev-leg-mad-bcn';

UPDATE events
SET origin_lat = 41.3874, origin_lon = 2.1686,
    destination_lat = 39.5696, destination_lon = 2.6502
WHERE id = 'ev-leg-bcn-pmi';

UPDATE events
SET origin_lat = 39.5696, origin_lon = 2.6502,
    destination_lat = 51.5074, destination_lon = -0.1278
WHERE id = 'ev-leg-pmi-lon';

UPDATE events
SET origin_lat = 51.5074, origin_lon = -0.1278,
    destination_lat = 41.9028, destination_lon = 12.4964
WHERE id = 'ev-leg-lon-rom';

UPDATE events
SET origin_lat = 41.9028, origin_lon = 12.4964,
    destination_lat = 40.4168, destination_lon = -3.7038
WHERE id = 'ev-leg-fco-mad';

UPDATE events
SET origin_lat = 40.4168, origin_lon = -3.7038,
    destination_lat = -34.8222, destination_lon = -58.5358
WHERE id = 'ev-leg-mad-eze';

-- ───────────────────────────────────────────────
-- 3. Populate estadia coordinates
-- ───────────────────────────────────────────────
UPDATE events SET origin_lat = 40.4168, origin_lon = -3.7038 WHERE type = 'estadia' AND city_in = 'mad';
UPDATE events SET origin_lat = 41.3874, origin_lon = 2.1686  WHERE type = 'estadia' AND city_in = 'bcn';
UPDATE events SET origin_lat = 39.5696, origin_lon = 2.6502  WHERE type = 'estadia' AND city_in = 'pmi';
UPDATE events SET origin_lat = 51.5074, origin_lon = -0.1278 WHERE type = 'estadia' AND city_in = 'lon';
UPDATE events SET origin_lat = 41.9028, origin_lon = 12.4964 WHERE type = 'estadia' AND city_in = 'rom';

-- ───────────────────────────────────────────────
-- 4. Populate hito coordinates (city-center fallback)
-- ───────────────────────────────────────────────
UPDATE events SET origin_lat = 40.4168, origin_lon = -3.7038 WHERE type = 'hito' AND city_in = 'mad';
UPDATE events SET origin_lat = 41.3874, origin_lon = 2.1686  WHERE type = 'hito' AND city_in = 'bcn';
UPDATE events SET origin_lat = 39.5696, origin_lon = 2.6502  WHERE type = 'hito' AND city_in = 'pmi';
UPDATE events SET origin_lat = 51.5074, origin_lon = -0.1278 WHERE type = 'hito' AND city_in = 'lon';
UPDATE events SET origin_lat = 41.9028, origin_lon = 12.4964 WHERE type = 'hito' AND city_in = 'rom';
