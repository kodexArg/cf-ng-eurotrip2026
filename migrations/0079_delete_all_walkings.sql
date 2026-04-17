-- migrations/0079_delete_all_walkings.sql
-- Elimina todos los eventos con subtype='walking' de events y events_traslado.

DELETE FROM events_traslado WHERE event_id IN (
  SELECT id FROM events WHERE subtype = 'walking'
);

DELETE FROM events WHERE subtype = 'walking';
