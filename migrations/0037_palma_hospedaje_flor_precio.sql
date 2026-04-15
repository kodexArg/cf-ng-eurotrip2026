-- 0037_palma_hospedaje_flor_precio.sql
-- Carga precio confirmado del alojamiento en Peguera (Mallorca):
-- FLOR Apartamento estándar 2 personas · Airbnb 48003319 · 28 abr → 2 may 2026 (4 noches).
-- Costo total: USD 428.32 (2 personas). Estadia ya confirmada en migration 0024.

UPDATE events
  SET usd = 428.32
  WHERE id = 'ev-stay-auto-pmi';
