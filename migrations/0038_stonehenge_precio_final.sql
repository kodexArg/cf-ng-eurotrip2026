-- 0038_stonehenge_precio_final.sql
-- Corrección de precio final del tour Windsor · Stonehenge · Oxford (May 3 2026).
-- Valor anterior registrado: USD 303.38 (Viator ref 1385295633 · 2 adultos).
-- Valor final correcto: USD 303.00 (2 adultos).

UPDATE events
  SET usd       = 303.00,
      confirmed = 1
  WHERE id = 'ev-lon-may03-stonehenge';
