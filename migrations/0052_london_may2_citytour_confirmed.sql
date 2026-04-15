-- 0052_london_may2_citytour_confirmed.sql
-- Confirmar city tour a pie por el centro de Londres, May 2 2026.
--
-- Cambios:
--   1. ev-lon-may02-citytour  confirmed 0→1, usd NULL→38.09, description actualizada
--   2. ev-lon-may02-walk      DELETE (supersedido por el city tour)
--
-- Costo: tour autoguiado completamente gratuito.
--        usd=38.09 corresponde a almuerzo estimado en Covent Garden ~£15/persona (£1 ≈ $1.27).

-- ─────────────────────────────────────────────────────────────────────
-- 1. Confirmar city tour Westminster → Covent Garden
-- ─────────────────────────────────────────────────────────────────────
UPDATE events SET
  confirmed = 1,
  usd = 38.09,
  description = 'Westminster · Big Ben · Abadía · Trafalgar Square · Covent Garden. ~4h a pie autoguiado. Tour completamente gratuito. Almuerzo estimado en Covent Garden ~£15/persona.'
WHERE id = 'ev-lon-may02-citytour';

-- ─────────────────────────────────────────────────────────────────────
-- 2. Eliminar evento walk supersedido
-- ─────────────────────────────────────────────────────────────────────
DELETE FROM events WHERE id = 'ev-lon-may02-walk';
