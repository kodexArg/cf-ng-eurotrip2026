-- 0020_madrid_barcelona_waypoints.sql
-- Waypoints para AVE Madrid → Barcelona (LAV Madrid-Zaragoza-Barcelona).
-- Mecánica (ya instalada por 0019): columna `events.waypoints` (JSON array de [lat,lon]).
-- El renderer del mapa usa [origen, ...waypoints, destino] como polilínea.
-- Orden en el array = orden geográfico a lo largo de la ruta (origen → destino).
--
-- LAV Madrid-Barcelona — trazado real de la alta velocidad con paradas/landmarks:
--   · Madrid Puerta de Atocha (origen)
--   · Guadalajara-Yebes
--   · Calatayud
--   · Zaragoza-Delicias
--   · Lleida-Pirineus
--   · Camp de Tarragona
--   · Barcelona Sants (destino)

UPDATE events
  SET waypoints = '[[40.5523,-3.2083],[41.3485,-1.6448],[41.6590,-0.9109],[41.6200,0.6320],[41.2080,1.2420]]'
  WHERE id = 'ev-leg-mad-bcn';
