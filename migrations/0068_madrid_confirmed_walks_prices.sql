-- 0068_madrid_confirmed_walks_prices.sql
-- Madrid Apr 20-23 — plan CONFIRMADO + walkings adicionales + precios verificados 2026.
--
-- Cambios:
--   1. DELETE 7 events huérfanos del seed legacy (Retiro/SanMiguel/Rooftop/Debod/Palacio/Letras
--      de Apr 21-22 que quedaron sin uso tras reworks 0064-0067).
--   2. FIX overlap Apr 20: caminata llegada termina al entrar al Retiro (08:30),
--      Retiro mañana empieza 08:30, nuevo walking Retiro → Lavapiés (10:30-11:00).
--   3. ADD 5 walkings + 1 metro Apr 23 (Reina Sofía + Thyssen + El Junco jam jazz).
--   4. ADD walking Toledo Mirador del Valle → Estación RENFE (cuesta abajo 20 min, ahorra €5 taxi).
--   5. UPDATE precios verificados 2026:
--      - EMT 203 T4→Atocha: €5.00 pp (no €5.10) → USD 10.87
--      - Thyssen: €14 pp (no €15) → USD 30.44
--   6. MARK confirmed=1 para TODO evento Apr 20-23 aún en confirmed=0 (paraguas).
--
-- Todos los eventos nuevos: variant='both', city='mad' (Toledo es day-trip bajo mad).

-- ─────────────────────────────────────────────────────────────────────
-- 1. DELETE huérfanos legacy seed
-- ─────────────────────────────────────────────────────────────────────

DELETE FROM events WHERE id IN (
  'ev-mad-apr21-retiro',
  'ev-mad-apr21-sanmiguel',
  'ev-mad-apr21-aniversario-cena',
  'ev-mad-apr21-rooftop',
  'ev-mad-apr22-debod',
  'ev-mad-apr22-palacio',
  'ev-mad-apr22-letras'
);

-- ─────────────────────────────────────────────────────────────────────
-- 2. FIX overlap Apr 20 Retiro + caminata
-- ─────────────────────────────────────────────────────────────────────

-- Caminata termina al entrar al Retiro (no en Lavapiés)
UPDATE events
SET timestamp_out = '2026-04-20T08:30:00+02:00',
    description   = 'Primera caminata del viaje europeo: Atocha → Paseo del Prado → Puerta de Alcalá → Retiro (entrada). ~50 min. Respirar aire post-vuelo.',
    destination_lat  = 40.4197,
    destination_lon  = -3.6885,
    destination_label = 'Parque del Retiro (Puerta de Alcalá)'
WHERE id = 'ev-leg-mad-apr20-caminata';

UPDATE events_traslado SET duration_min = 50 WHERE event_id = 'ev-leg-mad-apr20-caminata';

-- Retiro mañana empieza al llegar
UPDATE events
SET timestamp_in  = '2026-04-20T08:30:00+02:00',
    timestamp_out = '2026-04-20T10:30:00+02:00'
WHERE id = 'ev-mad-apr20-retiro-manana';

-- NUEVO: caminata Retiro → Lavapiés
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr20-walk-retiro-lavapies',
  'traslado', 'walking',
  'mad-walk-retiro-lavapies-20260420',
  'A pie · Retiro → Lavapiés',
  'Caminata por Barrio Letras. 2.0 km, ~30 min.',
  '2026-04-20',
  '2026-04-20T10:30:00+02:00',
  '2026-04-20T11:00:00+02:00',
  'mad', 'mad',
  0, 'pi pi-map-marker', 1, 'both',
  40.4197, -3.6885, 'Retiro (Puerta de Alcalá)',
  40.4089, -3.7025, 'Airbnb Lavapiés'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr20-walk-retiro-lavapies', NULL, '0', 'walking', 30);

-- ─────────────────────────────────────────────────────────────────────
-- 3. AGREGAR walkings Apr 23
-- ─────────────────────────────────────────────────────────────────────

-- Walking Lavapiés → Reina Sofía
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr23-walk-lavapies-reinasofia',
  'traslado', 'walking',
  'mad-walk-lavapies-reinasofia-20260423',
  'A pie · Lavapiés → Reina Sofía',
  'Caminata corta 8 min, 600 m.',
  '2026-04-23',
  '2026-04-23T09:50:00+02:00',
  '2026-04-23T09:58:00+02:00',
  'mad', 'mad',
  0, 'pi pi-map-marker', 1, 'both',
  40.4089, -3.7025, 'Airbnb Lavapiés',
  40.4086, -3.6941, 'Museo Reina Sofía'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr23-walk-lavapies-reinasofia', NULL, '0', 'walking', 8);

-- Walking Reina Sofía → Lavapiés almuerzo
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr23-walk-reinasofia-lavapies',
  'traslado', 'walking',
  'mad-walk-reinasofia-lavapies-20260423',
  'A pie · Reina Sofía → Lavapiés (almuerzo)',
  'Vuelta al barrio para almuerzo, 10 min.',
  '2026-04-23',
  '2026-04-23T13:05:00+02:00',
  '2026-04-23T13:25:00+02:00',
  'mad', 'mad',
  0, 'pi pi-map-marker', 1, 'both',
  40.4086, -3.6941, 'Museo Reina Sofía',
  40.4089, -3.7025, 'Lavapiés (almuerzo)'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr23-walk-reinasofia-lavapies', NULL, '0', 'walking', 10);

-- Walking Lavapiés → Thyssen
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr23-walk-lavapies-thyssen',
  'traslado', 'walking',
  'mad-walk-lavapies-thyssen-20260423',
  'A pie · Lavapiés → Thyssen',
  'Por Paseo del Prado. 900 m, 14 min.',
  '2026-04-23',
  '2026-04-23T14:45:00+02:00',
  '2026-04-23T15:00:00+02:00',
  'mad', 'mad',
  0, 'pi pi-map-marker', 1, 'both',
  40.4089, -3.7025, 'Lavapiés (almuerzo)',
  40.4160, -3.6946, 'Museo Thyssen-Bornemisza'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr23-walk-lavapies-thyssen', NULL, '0', 'walking', 14);

-- Metro L3 Lavapiés → Alonso Martínez (El Junco)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr23-metro-junco',
  'traslado', 'metro',
  'mad-metro-lavapies-junco-20260423',
  'Metro · Lavapiés → Alonso Martínez',
  'Línea 3 directa. ~10 min. Para llegar a El Junco (Plaza Santa Bárbara).',
  '2026-04-23',
  '2026-04-23T21:45:00+02:00',
  '2026-04-23T21:55:00+02:00',
  'mad', 'mad',
  3.26, 'pi pi-train', 1, 'both',
  40.4089, -3.7025, 'Metro Lavapiés',
  40.4262, -3.6963, 'Metro Alonso Martínez'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr23-metro-junco', 'Metro de Madrid', 'EUR 1.50 pp (€3.00 total)', 'L3', 10);

-- Walking Alonso Martínez → El Junco
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr23-walk-junco',
  'traslado', 'walking',
  'mad-walk-alonsomartinez-junco-20260423',
  'A pie · Alonso Martínez → El Junco',
  '300 m, 4 min.',
  '2026-04-23',
  '2026-04-23T21:55:00+02:00',
  '2026-04-23T21:59:00+02:00',
  'mad', 'mad',
  0, 'pi pi-map-marker', 1, 'both',
  40.4262, -3.6963, 'Metro Alonso Martínez',
  40.4287, -3.6968, 'El Junco (Plaza Santa Bárbara 10)'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr23-walk-junco', NULL, '0', 'walking', 4);

-- ─────────────────────────────────────────────────────────────────────
-- 4. AGREGAR walking Toledo: Mirador del Valle → Estación
-- ─────────────────────────────────────────────────────────────────────

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-tol-apr22-walk-mirador-estacion',
  'traslado', 'walking',
  'tol-walk-mirador-estacion-20260422',
  'A pie · Mirador del Valle → Estación Toledo',
  'Caminata cuesta abajo 1.2 km, ~20 min. Cruce Puente de Alcántara con vistas. Ahorra €5 taxi de vuelta.',
  '2026-04-22',
  '2026-04-22T16:15:00+02:00',
  '2026-04-22T16:35:00+02:00',
  'mad', 'mad',
  0, 'pi pi-map-marker', 1, 'both',
  39.8508, -4.0216, 'Mirador del Valle',
  39.8632, -4.0168, 'Estación RENFE Toledo'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-tol-apr22-walk-mirador-estacion', NULL, '0', 'walking', 20);

-- ─────────────────────────────────────────────────────────────────────
-- 5. PRICE UPDATES
-- ─────────────────────────────────────────────────────────────────────

-- EMT 203: €5.00 pp (no €5.10)
UPDATE events SET usd = 10.87 WHERE id = 'ev-leg-mad-t4-sol-arrival';
UPDATE events_traslado SET fare = 'EUR 5.00 pp (€10.00 total)' WHERE event_id = 'ev-leg-mad-t4-sol-arrival';

-- Thyssen: €14 pp (no €15)
UPDATE events SET usd = 30.44 WHERE id = 'ev-mad-apr23-thyssen';

-- ─────────────────────────────────────────────────────────────────────
-- 6. MARK confirmed=1 para TODO Apr 20-23 aún pending
-- ─────────────────────────────────────────────────────────────────────

UPDATE events
SET confirmed = 1
WHERE date BETWEEN '2026-04-20' AND '2026-04-23'
  AND confirmed = 0;
