-- 0048_apr20_madrid_llegada.sql
-- Actividades Apr 20 en Madrid tras la llegada desde Lisboa.
--
-- Contexto: el metro T4→Sol (ev-leg-mad-t4-sol-arrival) ya existe,
-- llegada al Airbnb Sol ~09:20. Este migration agrega las actividades del día.
--
-- Eventos insertados:
--   1. ev-mad-apr20-citytour   Hop-on/hop-off bus turístico   11:00–13:00
--   2. ev-mad-apr20-prado      Museo del Prado (entrada libre) 18:00–20:00

-- ─────────────────────────────────────────────────────────────────────
-- 1. Hito · Madrid City Tour (hop-on/hop-off)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr20-citytour',
  'hito', 'tour',
  'mad-citytour-hoponhopoff-20260420',
  'Madrid City Tour 🚌',
  'Tour hop-on/hop-off en bus turístico — ruta histórica: Plaza Mayor, Gran Vía, Retiro, Cibeles, Debod. Aborda en Puerta del Sol (10 min caminando del Airbnb). €33/persona.',
  '2026-04-20',
  '2026-04-20T11:00:00+02:00',
  '2026-04-20T13:00:00+02:00',
  'mad',
  71.64, 'pi-map', 0, 'both',
  40.4169, -3.7035
);

-- ─────────────────────────────────────────────────────────────────────
-- 2. Hito · Museo del Prado (entrada gratuita 18:00–20:00)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr20-prado',
  'hito', 'museo',
  'mad-prado-20260420',
  'Museo del Prado',
  'Entrada gratuita 18:00–20:00. Velázquez, Goya, El Bosco. Reservar online con anticipación incluso siendo gratuita.',
  '2026-04-20',
  '2026-04-20T18:00:00+02:00',
  '2026-04-20T20:00:00+02:00',
  'mad',
  0.00, 'pi-image', 0, 'both',
  40.4138, -3.6922
);
