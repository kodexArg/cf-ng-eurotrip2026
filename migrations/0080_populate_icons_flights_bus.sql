-- migrations/0080_populate_icons_flights_bus.sql
-- Pobla la columna events.icon para vuelos y bus EMT 203.
--
-- Todos los eventos con subtype='flight' reciben icon='ms-flight_takeoff'.
-- Esto incluye: ev-leg-scl-mad, ev-leg-bcn-pmi, ev-leg-pmi-lon,
--               ev-leg-par-rom, ev-leg-fco-mad, ev-leg-mad-eze.
-- El bus EMT 203 (ev-leg-mad-t4-sol-arrival) recibe icon='ms-directions_bus'.
--
-- Condición (icon IS NULL OR icon='') evita pisar íconos ya explícitos.

UPDATE events
SET icon = 'ms-flight_takeoff'
WHERE subtype = 'flight'
  AND (icon IS NULL OR icon = '');

UPDATE events
SET icon = 'ms-directions_bus'
WHERE id = 'ev-leg-mad-t4-sol-arrival'
  AND (icon IS NULL OR icon = '');
