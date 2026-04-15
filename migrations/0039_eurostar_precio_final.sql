-- 0039_eurostar_precio_final.sql
-- Precio final del Eurostar Londres → París (May 5 2026).
-- Valor pagado: EUR 302.00 total (2 pax).
-- Conversión: EUR 302 × 1.087 USD/EUR = USD 328.27.

UPDATE events
  SET usd       = 328.27,
      confirmed = 1
  WHERE id = 'ev-leg-lon-par';
