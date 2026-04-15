-- 0040_lon_par_hospedaje_precios.sql
-- Precios finales de hospedaje Londres y París.
--
-- Londres Airbnb: EUR 294.50 total (2 pax) · tasa €1 = USD 1.087 → USD 320.12
-- París Airbnb/hospedaje: USD 213.00 total (2 pax, ya en USD)

UPDATE events
  SET usd       = 320.12,
      confirmed = 1
  WHERE id = 'ev-stay-auto-lon';

UPDATE events
  SET usd       = 213.00,
      confirmed = 1
  WHERE id = 'ev-stay-auto-par';
