-- 0046_apr21_aniversario.sql
-- Noche de aniversario 30 en Madrid, Apr 21 2026.
--
-- Eventos insertados:
--   1. ev-mad-apr21-taxi-restaurante  Taxi Airbnb Sol → Bodega de los Secretos  20:00–20:15
--   2. ev-mad-apr21-aniversario       Cena aniversario en Bodega de los Secretos  20:30–23:30
--   3. ev-mad-apr21-taxi-vuelta       Taxi Bodega de los Secretos → Airbnb Sol  23:30–23:45
--
-- Nota: la tabla `days` fue renombrada a `_legacy_days` en migración 0008.
-- No se inserta en días; los eventos se registran directamente en `events`.
-- Todos confirmed=0 (pendiente reserva de restaurante y confirmación de tarifa).

-- ─────────────────────────────────────────────────────────────────────
-- 1. Taxi · Airbnb Sol → Bodega de los Secretos
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-mad-apr21-taxi-restaurante',
  'traslado', 'taxi',
  'mad-taxi-airbnb-bodega-20260421',
  'Taxi · Airbnb Sol → Bodega de los Secretos',
  'Traslado en taxi desde el Airbnb (Lavapiés/Sol) hasta Bodega de los Secretos (Barrio de las Letras). ~10 min.',
  '2026-04-21',
  '2026-04-21T20:00:00+02:00',
  '2026-04-21T20:15:00+02:00',
  'mad', 'mad',
  'pi pi-car',
  0, 'both',
  40.4168, -3.7038,
  'Airbnb Sol',
  40.4125, -3.6993,
  'Bodega de los Secretos'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-mad-apr21-taxi-restaurante', NULL, 'EUR ~7.00', 'taxi', 10);

-- ─────────────────────────────────────────────────────────────────────
-- 2. Hito · Aniversario 30 — Cena en Bodega de los Secretos
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr21-aniversario',
  'hito', 'restaurant',
  'mad-aniversario-bodega-secretos-20260421',
  'Aniversario 30 ❤️',
  'Cena romántica en Bodega de los Secretos — bóveda de ladrillo del siglo XVII, Barrio de las Letras. Menú Boutique €52/persona.',
  '2026-04-21',
  '2026-04-21T20:30:00+02:00',
  '2026-04-21T23:30:00+02:00',
  'mad',
  NULL,
  'pi pi-heart',
  0, 'both',
  40.4125, -3.6993
);

-- ─────────────────────────────────────────────────────────────────────
-- 3. Taxi · Bodega de los Secretos → Airbnb Sol
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-mad-apr21-taxi-vuelta',
  'traslado', 'taxi',
  'mad-taxi-bodega-airbnb-20260421',
  'Taxi · Bodega de los Secretos → Airbnb Sol',
  'Regreso en taxi desde Bodega de los Secretos hasta el Airbnb (Lavapiés/Sol). Tarifa nocturna ~€8. ~10 min.',
  '2026-04-21',
  '2026-04-21T23:30:00+02:00',
  '2026-04-21T23:45:00+02:00',
  'mad', 'mad',
  'pi pi-car',
  0, 'both',
  40.4125, -3.6993,
  'Bodega de los Secretos',
  40.4168, -3.7038,
  'Airbnb Sol'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-mad-apr21-taxi-vuelta', NULL, 'EUR ~8.00 (tarifa nocturna)', 'taxi', 10);
