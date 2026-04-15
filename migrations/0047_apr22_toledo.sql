-- 0047_apr22_toledo.sql
-- Reemplaza el día libre Apr 22 (Madrid sightseeing) por excursión a Toledo.
--
-- Cambios:
--   1. DELETE actividades Apr 22 de la tabla activities (seed legacy):
--      mad-apr22-prado, mad-apr22-palacio, mad-apr22-debod, mad-apr22-letras
--
--   2. INSERT 7 eventos nuevos en tabla events:
--      - Metro AirBnB Sol → Atocha (ida)
--      - RENFE Avant Madrid Atocha → Toledo
--      - Hito: Llegada a Toledo
--      - Hito: Alcázar de Toledo
--      - Hito: Catedral de Toledo
--      - RENFE Avant Toledo → Madrid Atocha (vuelta)
--      - Metro Atocha → AirBnB Sol (vuelta)
--
-- Precio tren: RENFE Avant ~€18/persona ida y vuelta (€36 total 2 pax).
-- Fare modelado en traslado de ida (cubre RT para 2), vuelta en €0.

-- ─────────────────────────────────────────────────────────────────────
-- 1. DELETE actividades Apr 22 (tabla activities — seed legacy)
-- ─────────────────────────────────────────────────────────────────────
DELETE FROM activities
WHERE id IN (
  'mad-apr22-prado',
  'mad-apr22-palacio',
  'mad-apr22-debod',
  'mad-apr22-letras'
);

-- ─────────────────────────────────────────────────────────────────────
-- 2. Traslado: AirBnB Sol → Atocha (Metro L1, ~25 min)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-tol-apr22-metro-ida',
  'traslado', 'metro',
  'mad-metro-sol-atocha-20260422',
  'Metro · Airbnb Sol → Madrid Atocha',
  'Línea 1 Sol → Atocha Renfe para tomar el RENFE Avant a Toledo.',
  '2026-04-22',
  '2026-04-22T08:30:00+02:00',
  '2026-04-22T08:55:00+02:00',
  'mad', 'mad',
  'pi pi-train',
  0, 'both',
  40.4168, -3.7038,
  'Airbnb Sol (C. del Ave María 42)',
  40.4065, -3.6890,
  'Madrid Puerta de Atocha'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-tol-apr22-metro-ida', 'Metro de Madrid', 'EUR 1.50 pp (zona A)', 'L1', 25);

-- ─────────────────────────────────────────────────────────────────────
-- 3. Traslado: Madrid Atocha → Toledo (RENFE Avant, 34 min)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-tol-apr22-avant-ida',
  'traslado', 'train',
  'mad-tol-avant-ida-20260422',
  'RENFE Avant · Madrid Atocha → Toledo',
  'Tren de alta velocidad AVANT. 34 minutos. Precio ida y vuelta incluido en este traslado (€18 pp × 2 pax).',
  '2026-04-22',
  '2026-04-22T09:00:00+02:00',
  '2026-04-22T09:34:00+02:00',
  'mad', 'mad',
  'pi pi-send',
  0, 'both',
  40.4065, -3.6890,
  'Madrid Puerta de Atocha',
  39.8617, -4.0264,
  'Toledo (Estación AVE)'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-tol-apr22-avant-ida', 'RENFE', 'EUR 18.00 pp RT (€36 total 2 pax)', 'AVANT', 34);

-- ─────────────────────────────────────────────────────────────────────
-- 4. Hito: Llegada a Toledo
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-tol-apr22-llegada',
  'hito', 'tour',
  'tol-llegada-20260422',
  'Llegada a Toledo',
  'Ciudad Patrimonio de la Humanidad. 15 min a pie desde la estación al centro histórico.',
  '2026-04-22',
  '2026-04-22T09:45:00+02:00',
  '2026-04-22T10:00:00+02:00',
  'mad',
  'pi-map', 0, 'both',
  39.8628, -4.0273
);

-- ─────────────────────────────────────────────────────────────────────
-- 5. Hito: Alcázar de Toledo
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-tol-apr22-alcazar',
  'hito', 'museo',
  'tol-alcazar-20260422',
  'Alcázar de Toledo',
  'Fortaleza medieval reconvertida en Museo del Ejército. Vistas panorámicas de la ciudad. €5/persona.',
  '2026-04-22',
  '2026-04-22T10:00:00+02:00',
  '2026-04-22T11:30:00+02:00',
  'mad',
  10.87, 'pi-building', 0, 'both',
  39.8579, -4.0217
);

-- ─────────────────────────────────────────────────────────────────────
-- 6. Hito: Catedral de Toledo
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-tol-apr22-catedral',
  'hito', 'museo',
  'tol-catedral-20260422',
  'Catedral de Toledo',
  'Catedral Primada de España, gótico del siglo XIII. El Transparente de Narciso Tomé, obras de El Greco. €12/persona.',
  '2026-04-22',
  '2026-04-22T12:00:00+02:00',
  '2026-04-22T13:30:00+02:00',
  'mad',
  26.09, 'pi-building', 0, 'both',
  39.8572, -4.0237
);

-- ─────────────────────────────────────────────────────────────────────
-- 7. Traslado: Toledo → Madrid Atocha (RENFE Avant, vuelta)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-tol-apr22-avant-vuelta',
  'traslado', 'train',
  'tol-mad-avant-vuelta-20260422',
  'RENFE Avant · Toledo → Madrid Atocha',
  'Tren de vuelta a Madrid. 34 minutos. Billete ya incluido en el trayecto de ida (RT).',
  '2026-04-22',
  '2026-04-22T17:00:00+02:00',
  '2026-04-22T17:34:00+02:00',
  'mad', 'mad',
  'pi pi-send',
  0, 'both',
  39.8617, -4.0264,
  'Toledo (Estación AVE)',
  40.4065, -3.6890,
  'Madrid Puerta de Atocha'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-tol-apr22-avant-vuelta', 'RENFE', 'EUR 0.00 (RT incluido en ida)', 'AVANT', 34);

-- ─────────────────────────────────────────────────────────────────────
-- 8. Traslado: Atocha → AirBnB Sol (Metro L1, ~25 min)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-tol-apr22-metro-vuelta',
  'traslado', 'metro',
  'mad-metro-atocha-sol-20260422',
  'Metro · Madrid Atocha → Airbnb Sol',
  'Línea 1 Atocha Renfe → Sol de vuelta al alojamiento.',
  '2026-04-22',
  '2026-04-22T17:45:00+02:00',
  '2026-04-22T18:10:00+02:00',
  'mad', 'mad',
  'pi pi-train',
  0, 'both',
  40.4065, -3.6890,
  'Madrid Puerta de Atocha',
  40.4168, -3.7038,
  'Airbnb Sol (C. del Ave María 42)'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-tol-apr22-metro-vuelta', 'Metro de Madrid', 'EUR 1.50 pp (zona A)', 'L1', 25);
