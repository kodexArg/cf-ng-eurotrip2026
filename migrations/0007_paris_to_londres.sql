-- 0007_paris_to_londres.sql
-- Cambio fundamental: París sale del itinerario. Entra Londres.
-- Palma 28 abr → 2 may (4 noches, -1)
-- Londres 2 may → 5 may (3 noches, NUEVO)
--   · Ryanair FR28  PMI → STN · 2026-05-02 06:00→07:35 · €15.99 BASIC
--   · Ryanair FR2455 STN → CIA · 2026-05-05 06:15→09:40 · £23.99 BASIC
-- Roma 5 may → 9 may (4 noches, sin cambios)

-- ─── 1. Borrar París por completo ───────────────────────────
DELETE FROM card_links WHERE card_id LIKE 'par-card-%';
DELETE FROM cards WHERE city_id = 'par';
DELETE FROM activities WHERE day_id LIKE 'par-day-%';
DELETE FROM days WHERE city_id = 'par';
DELETE FROM transport_legs WHERE id = 'leg-par-rom';
DELETE FROM map_routes WHERE sku IN ('pmi-par', 'par-rom');
DELETE FROM map_pois WHERE id = 'par';
DELETE FROM cities WHERE id = 'par';

-- ─── 2. Acortar Palma: 4 noches, sale 2 may ────────────────
DELETE FROM activities WHERE day_id = 'pmi-day-may02';
DELETE FROM days WHERE id = 'pmi-day-may02';
UPDATE cities SET departure = '2026-05-02', nights = 4 WHERE id = 'pmi';

-- ─── 3. Insertar Londres ───────────────────────────────────
INSERT INTO cities (id, name, slug, arrival, departure, nights, color, lat, lon) VALUES
  ('lon', 'Londres', 'londres', '2026-05-02', '2026-05-05', 3, '#5b7fb5', 51.5074, -0.1278);

INSERT INTO days (id, city_id, date, label, variant) VALUES
  ('lon-day-may02', 'lon', '2026-05-02', 'Llegada · Ryanair FR28 PMI→STN 06:00→07:35', 'both'),
  ('lon-day-may03', 'lon', '2026-05-03', NULL, 'both'),
  ('lon-day-may04', 'lon', '2026-05-04', NULL, 'both');

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant, tipo, tag, fare, company) VALUES
  ('lon-may02-am', 'lon-day-may02', 'morning', 'Vuelo Palma PMI → Londres Stansted · Ryanair FR28 · 06:00→07:35 · Stansted Express al centro (~50 min)', '€15.99 vuelo · £25 tren ida/vuelta', 0, 'both', 'transport', 'Llegada Londres', '€15.99', 'Ryanair'),
  ('lon-may02-pm', 'lon-day-may02', 'afternoon', 'Paseo suave por Covent Garden y Trafalgar Square · recuperación post-madrugón · cafés y bancos para descansar', '£0–£15 café', 0, 'both', 'leisure', 'Covent Garden', NULL, NULL),
  ('lon-may02-ev', 'lon-day-may02', 'evening', 'Cena en Soho o cerca del hotel · pub tradicional · sin planes exigentes', '£20–£35 p/p', 0, 'both', 'food', 'Soho', NULL, NULL),
  ('lon-may03-am', 'lon-day-may03', 'morning', 'Tower of London + Tower Bridge · reservar online · joyas de la corona · bancos suficientes para descansos', '£34 adulto · £28 senior', 0, 'both', 'visit', 'Tower of London', NULL, NULL),
  ('lon-may03-pm', 'lon-day-may03', 'afternoon', 'Westminster + Big Ben exterior + St James''s Park + Buckingham · calles planas', 'gratis', 0, 'both', 'visit', 'Westminster', NULL, NULL),
  ('lon-may03-ev', 'lon-day-may03', 'evening', 'Musical en West End · Les Mis, Lion King o Phantom · reservar online con descuento senior', '£30–£80 p/p', 0, 'both', 'leisure', 'West End', NULL, NULL),
  ('lon-may04-am', 'lon-day-may04', 'morning', 'British Museum · entrada gratuita · Piedra de Rosetta, mármoles del Partenón · ascensores y bancos', 'gratis · donación sugerida £5', 0, 'both', 'visit', 'British Museum', NULL, NULL),
  ('lon-may04-pm', 'lon-day-may04', 'afternoon', 'Paseo por South Bank · London Eye exterior · Borough Market · senderos planos junto al Támesis', 'gratis · £5–£15 snacks', 0, 'both', 'visit', 'South Bank', NULL, NULL),
  ('lon-may04-ev', 'lon-day-may04', 'evening', 'Cena temprana + traslado al hotel cerca de Stansted · dormir temprano (vuelo 06:15 del día siguiente)', '£20–£35 p/p', 0, 'both', 'food', 'Stansted', NULL, NULL);

-- ─── 4. Transport legs Londres ─────────────────────────────
INSERT INTO transport_legs (id, from_city, to_city, date, mode, label, duration, cost_hint, confirmed, fare, company, departure_time, arrival_time) VALUES
  ('leg-pmi-lon', 'pmi', 'lon', '2026-05-02', 'flight', 'FR28 Palma PMI → Londres Stansted', '~2h 35m', '€15.99 BASIC', 0, '€15.99', 'Ryanair', '06:00', '07:35'),
  ('leg-lon-rom', 'lon', 'rom', '2026-05-05', 'flight', 'FR2455 Londres Stansted → Roma Ciampino', '~2h 25m', '£23.99 BASIC', 0, '£23.99', 'Ryanair', '06:15', '09:40');

-- ─── 5. Actualizar Roma may05 (llegada desde Londres temprano) ─
UPDATE days SET label = 'Llegada · Ryanair FR2455 STN→CIA 06:15→09:40' WHERE id = 'rom-day-may05';
UPDATE activities SET
  description = 'Vuelo Londres STN → Roma CIA · Ryanair FR2455 · 06:15→09:40 · bus Terravision a Termini · check-in hotel',
  tag = 'Llegada Roma',
  company = 'Ryanair',
  fare = '£23.99'
WHERE id = 'rom-may05-am';

-- ─── 6. Mapa: POI y rutas ──────────────────────────────────
INSERT INTO map_pois (id, name, type, lat, lon, color, city_id) VALUES
  ('lon', 'Londres', 'city', 51.5074, -0.1278, '#5b7fb5', 'lon');

INSERT INTO map_routes (sku, from_poi, to_poi, mode, waypoints, created_at) VALUES
  ('pmi-lon', 'pmi', 'lon', 'flight', '[[39.5696,2.6502],[45.0,0.5],[51.5074,-0.1278]]', '2026-04-12 21:00:00'),
  ('lon-rom', 'lon', 'rom', 'flight', '[[51.5074,-0.1278],[46.5,5.5],[41.9028,12.4964]]', '2026-04-12 21:00:00');
