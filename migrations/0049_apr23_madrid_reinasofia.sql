-- 0049_apr23_madrid_reinasofia.sql
-- Madrid Apr 23 2026 — actividades culturales y ocio.
--
-- Eventos insertados:
--   1. ev-mad-apr23-reinasofia   Museo Reina Sofía        10:00–13:00
--   2. ev-mad-apr23-retiro       Parque del Retiro        13:30–16:30
--   3. ev-mad-apr23-sanmiguel    Mercado de San Miguel    17:00–19:00
--
-- Nota: la tabla `days` fue renombrada a `_legacy_days` en migración 0008.
-- No se inserta en días; los eventos se registran directamente en `events`.
-- Todos confirmed=0.

-- ─────────────────────────────────────────────────────────────────────
-- 1. Hito · Museo Reina Sofía
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr23-reinasofia',
  'hito', 'visit',
  'mad-reinasofia-20260423',
  'Museo Reina Sofía',
  'Guernica de Picasso, Dalí, Miró. Arte español del siglo XX. €12/persona. Reservar entrada online. Última entrada 18:30.',
  '2026-04-23',
  '2026-04-23T10:00:00+02:00',
  '2026-04-23T13:00:00+02:00',
  'mad',
  26.09, 'pi-image', 0, 'both',
  40.4086, -3.6941
);

-- ─────────────────────────────────────────────────────────────────────
-- 2. Hito · Parque del Retiro
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr23-retiro',
  'hito', 'leisure',
  'mad-retiro-20260423',
  'Parque del Retiro',
  'Paseo por el parque más emblemático de Madrid. Entrada gratuita. Palacio de Cristal, lago, jardines. Opción barca en el lago €7/persona.',
  '2026-04-23',
  '2026-04-23T13:30:00+02:00',
  '2026-04-23T16:30:00+02:00',
  'mad',
  0.00, 'pi-heart', 0, 'both',
  40.4153, -3.6844
);

-- ─────────────────────────────────────────────────────────────────────
-- 3. Hito · Mercado de San Miguel
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr23-sanmiguel',
  'hito', 'food',
  'mad-sanmiguel-20260423',
  'Mercado de San Miguel',
  'Mercado gourmet de tapas junto a Plaza Mayor. Entrada libre. Tapas y vino de pie. ~€15-20/persona.',
  '2026-04-23',
  '2026-04-23T17:00:00+02:00',
  '2026-04-23T19:00:00+02:00',
  'mad',
  43.48, 'pi-star', 0, 'both',
  40.4152, -3.7090
);
