-- 0102_madrid_apr22_23_reality.sql
-- Bitácora real Mar 22 y Mié 23 abr

-- ============================================================
-- MAR 22 ABR — Prado + Guernica + Palacio Real + Museo del Jamón
-- ============================================================

-- Delete existing Apr 22 Madrid events (keep Toledo events, they move to 23)
DELETE FROM events WHERE date = '2026-04-22' AND city_in = 'mad' AND id NOT IN ('ev-tol-apr22-avant-ida', 'ev-tol-apr22-avant-vuelta');

-- Move Toledo events from 22 to 23
UPDATE events SET date = '2026-04-23' WHERE id IN ('ev-tol-apr22-avant-ida', 'ev-tol-apr22-avant-vuelta');
UPDATE events SET id = REPLACE(id, 'apr22', 'apr23') WHERE id LIKE 'ev-tol-apr22%';
UPDATE events SET slug = REPLACE(slug, '20260422', '20260423') WHERE slug LIKE '%20260422%' AND id LIKE 'ev-tol%';
UPDATE events SET timestamp_in = REPLACE(timestamp_in, '2026-04-22', '2026-04-23') WHERE id LIKE 'ev-tol%';
UPDATE events SET timestamp_out = REPLACE(timestamp_out, '2026-04-22', '2026-04-23') WHERE id LIKE 'ev-tol%';

-- Delete all other old Toledo Apr 22 events and old Madrid Apr 23 events
DELETE FROM events WHERE date = '2026-04-22' AND city_in = 'mad';
DELETE FROM events WHERE date = '2026-04-23' AND city_in = 'mad' AND id NOT LIKE 'ev-tol%';

-- Insert real Apr 22
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, done, variant, origin_lat, origin_lon) VALUES
('ev-mad-apr22-prado', 'hito', 'museo', 'mad-prado-20260422',
 'Museo del Prado · entradas pagadas',
 'Concretamos la visita al Prado, con entradas ya sacadas y confirmadas. Las salas de Velázquez, Goya, El Bosco... El Prado te absorbe, cada sala es un mundo. Horas recorriendo galerías, perdiéndose entre lienzos de siglos. Madrid tiene este museo y con eso basta.',
 '2026-04-22', '2026-04-22T10:00:00+02:00', '2026-04-22T13:00:00+02:00', 'mad', 0.00, 'museo', 1, 1, 'both', 40.4138, -3.6921),

('ev-mad-apr22-guernica', 'hito', 'museo', 'mad-guernica-20260422',
 'Guernica · Reina Sofía (gratis)',
 'Luego fuimos a ver el Guernica al Reina Sofía. Ya podíamos entrar gratis. El cuadro te paraliza — esa masa en blanco y negro que grita sin hacer ruido. Te quedás ahí parado, sin palabras, y el tiempo se detiene.',
 '2026-04-22', '2026-04-22T14:00:00+02:00', '2026-04-22T16:00:00+02:00', 'mad', 0.00, 'museo', 1, 1, 'both', 40.4086, -3.6943),

('ev-mad-apr22-palacio-real', 'hito', 'visit', 'mad-palacio-real-ext-20260422',
 'Palacio Real · alrededores',
 'Paseamos por el Palacio Real aunque no pudimos entrar. Los jardines, la Plaza de Oriente, las vistas desde la fachada. Caminamos por los alrededores sintiendo el peso de la historia en cada piedra.',
 '2026-04-22', '2026-04-22T16:30:00+02:00', '2026-04-22T18:00:00+02:00', 'mad', 0.00, 'monumento', 1, 1, 'both', 40.4180, -3.7145),

('ev-mad-apr22-museo-jamon', 'hito', 'food', 'mad-museo-jamon-20260422',
 'Museo del Jamón',
 'Visitamos un Museo del Jamón. Madrid en estado puro: jamón colgando del techo, vermut en la barra, la gente apiñada comiendo de pie. Un templo del ibérico.',
 '2026-04-22', '2026-04-22T18:30:00+02:00', '2026-04-22T20:00:00+02:00', 'mad', 0.00, 'comida', 1, 1, 'both', 40.4180, -3.7060);

-- ============================================================
-- MIÉ 23 ABR — Toledo en tren + bus turístico
-- ============================================================

-- Update Toledo train events with narrative descriptions
UPDATE events SET description = 'Nos fuimos en tren a Toledo. El Avant te deja en 34 minutos en una ciudad que parece detenida en el siglo XVI. La estación de Toledo, pequeña, y afuera las murallas esperando.', done = 1 WHERE id = 'ev-tol-apr23-avant-ida';
UPDATE events SET description = 'Vuelta en tren a Madrid. Toledo se nos quedó atrás pero el sabor de esa ciudad medieval no se va fácil.', done = 1 WHERE id = 'ev-tol-apr23-avant-vuelta';

-- Delete old Toledo detailed events (pulsera, catedral, etc.)
DELETE FROM events WHERE id IN (
  'ev-tol-apr22-llegada', 'ev-tol-apr22-bus-l5', 'ev-tol-apr22-pulsera',
  'ev-tol-apr22-catedral', 'ev-tol-apr22-santotome', 'ev-tol-apr22-sinagoga-blanca',
  'ev-tol-apr22-sanjuan-reyes', 'ev-tol-apr22-almuerzo-ludena',
  'ev-tol-apr22-sinagoga-transito', 'ev-tol-apr22-greco', 'ev-tol-apr22-cristo-luz',
  'ev-tol-apr22-mirador-valle', 'ev-tol-apr22-cafe-estacion',
  -- also delete old Madrid Apr 23 events that were planned
  'ev-mad-apr23-museos', 'ev-mad-apr23-almuerzo-lavapies', 'ev-mad-apr23-descanso-cena',
  'ev-mad-apr23-cena-despedida', 'ev-mad-apr23-jam-junco'
);

-- Insert real Toledo Apr 23
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, done, variant, origin_lat, origin_lon) VALUES
('ev-tol-apr23-bus-tour', 'hito', 'tour', 'tol-bus-tour-20260423',
 'Bus turístico dos pisos · Toledo completo',
 'En Toledo contratamos el servicio de tour que nos llevó en un bus de dos pisos a conocer toda la ciudad. Desde arriba se veía la ciudad entera: la Catedral, el río Tajo, los puentes romanos, las casas pegadas a la colina. El guía contaba historias de reyes y batallas mientras el bus serpenteaba por callejuelas medievales. Tres culturas conviviendo en una sola ciudad — cristiana, judía y musulmana. Patrimonio de la Humanidad y se nota.',
 '2026-04-23', '2026-04-23T10:00:00+02:00', '2026-04-23T15:00:00+02:00', 'mad', 0.00, 'colectivo', 1, 1, 'both', 39.8573, -4.0245);

-- Mark Airbnb stay as done for the remaining days
UPDATE events SET done = 1 WHERE id = 'ev-stay-bk-madrid-airbnb';
