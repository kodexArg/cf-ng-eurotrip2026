-- 0015_fr28_price.sql
-- Precio real confirmado de Ryanair FR28: €39 total (2 pax).
-- Conversión aproximada: €39 ≈ USD 42.

UPDATE events
  SET usd = 42
  WHERE id = 'ev-leg-pmi-lon';

UPDATE events_traslado
  SET fare = '€39'
  WHERE event_id = 'ev-leg-pmi-lon';
