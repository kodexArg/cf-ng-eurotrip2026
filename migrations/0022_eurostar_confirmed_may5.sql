-- 0022_eurostar_confirmed_may5.sql
-- Eurostar ev-leg-lon-par confirmado para May 5.
-- Horario real: London St Pancras 08:01 BST → Paris Gare du Nord 11:20 CEST (2h19m).
-- Cambia de May 4 (estimado) a May 5 (confirmado).

UPDATE events
  SET date         = '2026-05-05',
      timestamp_in = '2026-05-05T08:01:00',
      timestamp_out= '2026-05-05T11:20:00',
      confirmed    = 1,
      notes        = 'Confirmado · London St Pancras International → Paris Gare du Nord · vía HS1, Channel Tunnel (~21 min), LGV Nord · salida 08:01 BST · llegada 11:20 CEST'
  WHERE id = 'ev-leg-lon-par';

UPDATE events_traslado
  SET duration_min = 139
  WHERE event_id = 'ev-leg-lon-par';
