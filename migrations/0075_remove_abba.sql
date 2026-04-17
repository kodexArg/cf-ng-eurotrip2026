-- 0075_remove_abba.sql
-- Usuario decidió NO ir a ABBA Voyage (May 4 Londres).
-- Eliminar los 3 eventos relacionados + renombrar la cena "post-ABBA" a genérica.
--
-- Eventos eliminados:
--   1. ev-lon-may04-abba              · Hito ABBA Voyage show
--   2. ev-leg-lon-skygarden-abba      · Traslado tube Sky Garden → ABBA Arena
--   3. ev-leg-lon-abba-kx             · Traslado tube ABBA Arena → King's Cross
--
-- Evento modificado:
--   4. ev-lon-may04-cena · retitle de "Cena · post-ABBA" → "Cena · Londres" + descripción genérica

DELETE FROM events_traslado WHERE event_id IN ('ev-leg-lon-skygarden-abba', 'ev-leg-lon-abba-kx');

DELETE FROM events WHERE id IN (
  'ev-lon-may04-abba',
  'ev-leg-lon-skygarden-abba',
  'ev-leg-lon-abba-kx'
);

UPDATE events
SET title = 'Cena · Londres',
    description = 'Cena en Londres (barrio a decidir, sugerencias: Soho, Covent Garden, Borough Market). ~€45 pareja.'
WHERE id = 'ev-lon-may04-cena';
