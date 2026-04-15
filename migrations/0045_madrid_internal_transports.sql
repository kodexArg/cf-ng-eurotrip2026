-- 0045_madrid_internal_transports.sql
-- Agrega los traslados internos de Madrid que faltaban (4 nuevos eventos):
--
--   1. ev-leg-mad-t4-sol-arrival     Apr 20 ~08:30  T4 → Airbnb Sol         Metro L8+L10+L1
--   2. ev-leg-mad-sol-atocha         Apr 24 ~08:15  Airbnb Sol → Atocha     Metro L1
--   3. ev-leg-mad-t4-cibeles-night   May 9 ~23:30   T4 → Cibeles            Aeropuerto Express bus 24h
--   4. ev-leg-mad-cibeles-t4-dawn    May 10 ~05:30  Cibeles → T4            Aeropuerto Express bus 24h
--
-- Coordenadas tomadas de Wikidata / OpenStreetMap. Waypoints siguen las estaciones de
-- transbordo reales del Metro de Madrid o el recorrido del bus Aeropuerto Express.
-- Precios a confirmar en migration siguiente (post-investigación).

-- ─────────────────────────────────────────────────────────────────────
-- 1. Apr 20 · T4 → Airbnb Sol · Metro L8 + L10 + L1
-- ─────────────────────────────────────────────────────────────────────
-- Ruta: T4 (L8) → Nuevos Ministerios (cambio L10) → Tribunal (cambio L1) → Sol
-- ~50 min puerta a puerta con tarifa Aeropuerto (€3 supplement)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label,
  waypoints
) VALUES (
  'ev-leg-mad-t4-sol-arrival',
  'traslado', 'metro',
  'mad-t4-sol-arrival-20260420',
  'Metro · MAD T4 → Sol (Airbnb)',
  'Llegada del vuelo SCL→MAD. Línea 8 hasta Nuevos Ministerios, transbordo a L10 hasta Tribunal, transbordo a L1 hasta Sol.',
  '2026-04-20',
  '2026-04-20T08:30:00+02:00',
  '2026-04-20T09:20:00+02:00',
  'mad', 'mad',
  'pi pi-train',
  0, 'both',
  40.4936, -3.5668,
  'Aeropuerto Madrid-Barajas T4',
  40.4168, -3.7038,
  'Airbnb Centro Madrid (Sol)',
  '[[40.4458,-3.6905],[40.4287,-3.7028]]'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-t4-sol-arrival', 'Metro de Madrid', 'EUR 4.50 pp (€1.50 + suplemento aeropuerto €3)', 'L8+L10+L1', 50);

-- ─────────────────────────────────────────────────────────────────────
-- 2. Apr 24 · Airbnb Sol → Atocha (al tren AVE Madrid→Barcelona)
-- ─────────────────────────────────────────────────────────────────────
-- Ruta directa Metro L1 Sol → Atocha Renfe (~10 min)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-sol-atocha',
  'traslado', 'metro',
  'mad-sol-atocha-20260424',
  'Metro · Sol → Atocha Renfe',
  'Línea 1 directa Sol → Atocha Renfe para tomar el AVE a Barcelona Sants (08:57).',
  '2026-04-24',
  '2026-04-24T08:15:00+02:00',
  '2026-04-24T08:30:00+02:00',
  'mad', 'mad',
  'pi pi-train',
  0, 'both',
  40.4168, -3.7038,
  'Airbnb Centro Madrid (Sol)',
  40.4068, -3.6912,
  'Madrid Puerta de Atocha'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-sol-atocha', 'Metro de Madrid', 'EUR 1.50 pp (zona A)', 'L1', 15);

-- ─────────────────────────────────────────────────────────────────────
-- 3. May 9 · T4 → Cibeles · Aeropuerto Express bus (24h)
-- ─────────────────────────────────────────────────────────────────────
-- Vuelo FCO→MAD aterriza ~23:00. Metro cierra 01:30, pero con migraciones
-- y equipaje conviene el bus directo 24h (línea Exprés Aeropuerto, ~40 min).
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-t4-cibeles-night',
  'traslado', 'bus',
  'mad-t4-cibeles-night-20260509',
  'Bus Exprés · MAD T4 → Cibeles',
  'Línea Exprés Aeropuerto (24h) tras llegada FCO→MAD. Parada en Plaza de Cibeles, a pasos del centro.',
  '2026-05-09',
  '2026-05-09T23:30:00+02:00',
  '2026-05-10T00:10:00+02:00',
  'mad', 'mad',
  'pi pi-car',
  0, 'both',
  40.4936, -3.5668,
  'Aeropuerto Madrid-Barajas T4',
  40.4203, -3.6936,
  'Plaza de Cibeles'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-t4-cibeles-night', 'EMT Madrid', 'EUR 5.00 pp (24h)', 'Exprés Aeropuerto 24h', 40);

-- ─────────────────────────────────────────────────────────────────────
-- 4. May 10 · Cibeles → T4 · Aeropuerto Express bus (24h)
-- ─────────────────────────────────────────────────────────────────────
-- Antes del vuelo MAD→EZE (08:45). Salir de centro ~05:30 deja margen
-- para check-in y migraciones internacionales.
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-cibeles-t4-dawn',
  'traslado', 'bus',
  'mad-cibeles-t4-dawn-20260510',
  'Bus Exprés · Cibeles → MAD T4',
  'Línea Exprés Aeropuerto (24h) hacia el aeropuerto. Llegada con margen para check-in vuelo internacional MAD→EZE 08:45.',
  '2026-05-10',
  '2026-05-10T05:30:00+02:00',
  '2026-05-10T06:10:00+02:00',
  'mad', 'mad',
  'pi pi-car',
  0, 'both',
  40.4203, -3.6936,
  'Plaza de Cibeles',
  40.4936, -3.5668,
  'Aeropuerto Madrid-Barajas T4'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-cibeles-t4-dawn', 'EMT Madrid', 'EUR 5.00 pp (24h)', 'Exprés Aeropuerto 24h', 40);

-- ─────────────────────────────────────────────────────────────────────
-- Precios + confirmación (post price-finder, fuente CRTM/EMT abril 2026)
-- ─────────────────────────────────────────────────────────────────────
-- Tasa €1 = USD$1.087.
UPDATE events SET usd = 9.78,  confirmed = 1 WHERE id = 'ev-leg-mad-t4-sol-arrival';     -- 2 pax × (€1.50+€3) = €9.00
UPDATE events SET usd = 3.26,  confirmed = 1 WHERE id = 'ev-leg-mad-sol-atocha';         -- 2 pax × €1.50 = €3.00
UPDATE events SET usd = 10.88, confirmed = 1 WHERE id = 'ev-leg-mad-t4-cibeles-night';   -- 2 pax × €5.00 = €10.00
UPDATE events SET usd = 10.88, confirmed = 1 WHERE id = 'ev-leg-mad-cibeles-t4-dawn';    -- 2 pax × €5.00 = €10.00
