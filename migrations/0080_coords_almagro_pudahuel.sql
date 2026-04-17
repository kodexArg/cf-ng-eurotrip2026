-- migrations/0080_coords_almagro_pudahuel.sql
-- Coords Hotel Diego de Almagro Pudahuel Aeropuerto (Av. Américo Vespucio 1299, Pudahuel)
-- Source: Nominatim / OSM

UPDATE events
SET lat = -33.4286355, lon = -70.7819181
WHERE id = '3de5f213-152b-41de-b891-09ce0969b8b4';
