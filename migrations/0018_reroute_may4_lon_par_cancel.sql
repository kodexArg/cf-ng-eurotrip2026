-- 0018_reroute_may4_lon_par_cancel.sql
-- 1. Eurostar Londres → París: booking CANCELADO, queda como pendiente con
--    horario estimado May 4 por la mañana (~3h20m el tramo real).
-- 2. Londres en rojo, París en azul francia.

-- Eurostar pendiente, May 4
UPDATE events
  SET date         = '2026-05-04',
      timestamp_in = '2026-05-04T08:00:00',
      timestamp_out= '2026-05-04T11:20:00',
      confirmed    = 0,
      notes        = 'Pendiente · booking anterior cancelado · horario estimado · Standard ~€103 pp · reservar en eurostar.com · St Pancras International'
  WHERE id = 'ev-leg-lon-par';

UPDATE events_traslado
  SET fare         = '~€103 pp',
      duration_min = 200
  WHERE event_id = 'ev-leg-lon-par';

-- Colores
UPDATE cities SET color = '#ef4444' WHERE id = 'lon';  -- rojo Inglaterra
UPDATE cities SET color = '#0055a4' WHERE id = 'par';  -- azul Francia
