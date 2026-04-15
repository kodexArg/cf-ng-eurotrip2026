-- 0043_leonardo_fare_string.sql
-- Sincroniza el campo `fare` (string visible) del Leonardo Express con el
-- precio real cargado en events.usd por la migration 0042.
-- Precio oficial actual: €17.90 pp con fees (Trenitalia, abril 2026).

UPDATE events_traslado
  SET fare = 'EUR 17.90 pp (oficial con fees)'
  WHERE event_id = 'ev-leg-leo-express';
