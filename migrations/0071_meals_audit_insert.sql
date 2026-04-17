-- 0071_meals_audit_insert.sql
-- Audit y completado de comidas (almuerzo/merienda/cena) en todo el viaje Apr 20 - May 10.
-- Todos los eventos se insertan como confirmed=0 (estimados, no pagados).
-- Slots estándar: almuerzo 13:00-14:30 (~€30), merienda 17:30-18:30 (~€15), cena 20:00-22:00 (~€40).
-- No se tocan eventos confirmed=1 ni estadias.
--
-- Tabla de decisiones por día:
-- Fecha       | Ciudad | Inserta              | Razón / existente
-- 2026-04-20  | mad    | cena                 | ya almuerzo 13:00; MAPFRE 17-19; sin cena
-- 2026-04-21  | mad    | (nada)               | Café Central 20-23 cubre cena (jazz+cena); Matadero 17-19:30 bloquea merienda
-- 2026-04-22  | mad    | cena                 | ya almuerzo 13:00 Ludeña; Prado 18-20 → cena post-Prado
-- 2026-04-23  | mad    | (nada)               | ya lunch 13:30 + "Descanso+cena" 19-21:30
-- 2026-04-24  | bcn    | merienda             | gap 7h entre lunch 13:30 y cena 20:45; merienda 17:30-18:15 entre Tàpies y Gòtic
-- 2026-04-25  | bcn    | cena                 | ya lunch 13:45; Jamboree 22:15 → cena 20:30-21:30 zona Raval-Liceu (pre-Font Màgica)
-- 2026-04-26  | bcn    | (nada)               | ya lunch + "Descanso+cena" 19-21:30
-- 2026-04-27  | bcn    | cena                 | ya lunch 13:00; Sagrada/Bunkers/Harlem cerrados: cena 21:15-22:15 Muntaner pre-Harlem
-- 2026-04-28  | pmi    | almuerzo             | vuelo 09:05, llega Peguera 11:50; ya cena 20:00 La Lonja
-- 2026-04-29  | pmi    | cena                 | ya "food 15:00 Casco Antiguo" como lunch; falta cena
-- 2026-04-30  | pmi    | almuerzo, cena       | día Es Trenc/Colònia; sin comidas
-- 2026-05-01  | pmi    | almuerzo, cena       | "Sóller 10:00" es snack matinal; faltan ambos
-- 2026-05-02  | lon    | almuerzo, cena       | llegada + city tour; Denmark bars 18-22 no es food
-- 2026-05-03  | lon    | cena                 | excursión 08-19 incluye meals; solo cena de regreso
-- 2026-05-04  | lon    | almuerzo, cena       | MinaLima 11:30-13:30, Sky Garden 16, ABBA 18:45-20:15
-- 2026-05-05  | par    | almuerzo, cena       | llegada París, día paseable 13-21
-- 2026-05-06  | rom    | almuerzo, cena       | Louvre AM + vuelo Orly-Roma; cena 21:30 Colosseo post-arrival
-- 2026-05-07  | rom    | almuerzo, cena       | Vaticano/Prati/Trastevere
-- 2026-05-08  | rom    | almuerzo, cena       | Borghese/Villa/Roma
-- 2026-05-09  | rom    | almuerzo             | ya cena Madrid 20:00; lunch pre-vuelo Roma
-- 2026-05-10  | mad    | (nada)               | vuelo 08:45 madrugada, sin comidas

-- ============================================================
-- Madrid
-- ============================================================

-- Apr 20 lunes · cena Lavapiés (post-MAPFRE)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-mad-apr20-cena', 'hito', 'food', 'madrid-cena-20260420', 'Cena · Lavapiés',
 'Meal estimado €40 pareja. Sugerencia: Bar Melo''s (bocadillo calamares), Taberna Antonio Sánchez o El Tigre (Chueca) según ánimo.',
 '2026-04-20', '2026-04-20T20:30:00+02:00', '2026-04-20T22:00:00+02:00', 'mad', 43.48, 'ms-lunch_dining', 0, 'both', 40.4089, -3.7025);

-- Apr 22 miércoles · cena post-Prado
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-mad-apr22-cena', 'hito', 'food', 'madrid-cena-20260422', 'Cena · Huertas / Lavapiés',
 'Meal estimado €40 pareja post-Prado. Sugerencia: Casa González (vinos+tabla), La Venencia o Taberna La Dolores.',
 '2026-04-22', '2026-04-22T20:30:00+02:00', '2026-04-22T22:00:00+02:00', 'mad', 43.48, 'ms-lunch_dining', 0, 'both', 40.4089, -3.7025);

-- ============================================================
-- Barcelona
-- ============================================================

-- Apr 24 viernes · merienda entre Tàpies y Gòtic
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-bcn-apr24-merienda', 'hito', 'food', 'barcelona-merienda-20260424', 'Merienda · Eixample',
 'Meal estimado €15 pareja. Gap 7h entre lunch y cena. Sugerencia: café + bocadillo en Passeig de Gràcia o Rambla Catalunya.',
 '2026-04-24', '2026-04-24T17:30:00+02:00', '2026-04-24T18:15:00+02:00', 'bcn', 16.30, 'ms-lunch_dining', 0, 'both', 41.3916, 2.1650);

-- Apr 25 sábado · cena pre-Jamboree (zona Raval/Liceu)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-bcn-apr25-cena', 'hito', 'food', 'barcelona-cena-20260425', 'Cena · Raval / Liceu',
 'Meal estimado €40 pareja pre-Jamboree 22:15. Sugerencia: Bar Cañete, Can Culleretes (histórico) o Elisabets.',
 '2026-04-25', '2026-04-25T20:30:00+02:00', '2026-04-25T21:45:00+02:00', 'bcn', 43.48, 'ms-lunch_dining', 0, 'both', 41.3802, 2.1734);

-- Apr 27 lunes · cena pre-Harlem (Muntaner)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-bcn-apr27-cena', 'hito', 'food', 'barcelona-cena-20260427', 'Cena · Muntaner',
 'Meal estimado €40 pareja pre-Harlem Jazz 22:30. Sugerencia: Cerveseria Catalana (clásico tapas), La Flauta o Tapas 24.',
 '2026-04-27', '2026-04-27T21:15:00+02:00', '2026-04-27T22:15:00+02:00', 'bcn', 43.48, 'ms-lunch_dining', 0, 'both', 41.3884, 2.1530);

-- ============================================================
-- Mallorca (Peguera / Palma)
-- ============================================================

-- Apr 28 martes · almuerzo llegada Peguera
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-pmi-apr28-almuerzo', 'hito', 'food', 'mallorca-almuerzo-20260428', 'Almuerzo · Peguera',
 'Meal estimado €30 pareja post-arrival (bus llega 11:50). Sugerencia: chiringuito Playa Peguera o tapas en Bulevar.',
 '2026-04-28', '2026-04-28T13:00:00+02:00', '2026-04-28T14:30:00+02:00', 'pmi', 32.61, 'ms-lunch_dining', 0, 'both', 39.5378, 2.4481);

-- Apr 29 miércoles · cena Palma
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-pmi-apr29-cena', 'hito', 'food', 'mallorca-cena-20260429', 'Cena · Paseo del Borne',
 'Meal estimado €40 pareja tras jornada Valldemossa/Deià. Sugerencia: Can Joan de S''Aigo (ensaimadas), La Lonja tapas, o Casa Maruka.',
 '2026-04-29', '2026-04-29T20:30:00+02:00', '2026-04-29T22:00:00+02:00', 'pmi', 43.48, 'ms-lunch_dining', 0, 'both', 39.5706, 2.6498);

-- Apr 30 jueves · almuerzo Es Trenc + cena
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-pmi-apr30-almuerzo', 'hito', 'food', 'mallorca-almuerzo-20260430', 'Almuerzo · Es Trenc',
 'Meal estimado €30 pareja en playa. Sugerencia: Chiringuito Es Trenc (arroz/pescado) o llevar bocadillos.',
 '2026-04-30', '2026-04-30T13:00:00+02:00', '2026-04-30T14:00:00+02:00', 'pmi', 32.61, 'ms-lunch_dining', 0, 'both', 39.3485, 2.9853),
('ev-pmi-apr30-cena', 'hito', 'food', 'mallorca-cena-20260430', 'Cena · Peguera',
 'Meal estimado €40 pareja de regreso a base. Sugerencia: Restaurante La Gran Tortuga (vistas) o tapas Bulevar Peguera.',
 '2026-04-30', '2026-04-30T20:00:00+02:00', '2026-04-30T22:00:00+02:00', 'pmi', 43.48, 'ms-lunch_dining', 0, 'both', 39.5378, 2.4481);

-- May 1 viernes · almuerzo Sóller + cena Palma
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-pmi-may01-almuerzo', 'hito', 'food', 'mallorca-almuerzo-20260501', 'Almuerzo · Port de Sóller',
 'Meal estimado €30 pareja. Sugerencia: Randemar (vista puerto), Es Faro, o Ca''n Boqueta en pueblo.',
 '2026-05-01', '2026-05-01T13:30:00+02:00', '2026-05-01T14:45:00+02:00', 'pmi', 32.61, 'ms-lunch_dining', 0, 'both', 39.7982, 2.6925),
('ev-pmi-may01-cena', 'hito', 'food', 'mallorca-cena-20260501', 'Cena · Palma (La Calatrava)',
 'Meal estimado €40 pareja. Sugerencia: Celler Sa Premsa (histórico), Forn de Sant Joan o Quadrat.',
 '2026-05-01', '2026-05-01T20:30:00+02:00', '2026-05-01T22:00:00+02:00', 'pmi', 43.48, 'ms-lunch_dining', 0, 'both', 39.5706, 2.6498);

-- ============================================================
-- Londres
-- ============================================================

-- May 2 sábado · almuerzo + cena (pre-bars)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-lon-may02-almuerzo', 'hito', 'food', 'londres-almuerzo-20260502', 'Almuerzo · City Tour',
 'Meal estimado €30/£25 pareja durante city tour. Sugerencia: pub clásico (The Red Lion Westminster) o Borough Market snacks.',
 '2026-05-02', '2026-05-02T13:00:00+01:00', '2026-05-02T14:30:00+01:00', 'lon', 32.61, 'ms-lunch_dining', 0, 'both', 51.5074, -0.1278),
('ev-lon-may02-cena', 'hito', 'food', 'londres-cena-20260502', 'Cena · Soho',
 'Meal estimado €40/£35 pareja pre-bars Denmark Street. Sugerencia: Bao Soho, Pastaio, o fish & chips Poppies.',
 '2026-05-02', '2026-05-02T19:30:00+01:00', '2026-05-02T20:45:00+01:00', 'lon', 43.48, 'ms-lunch_dining', 0, 'both', 51.5136, -0.1365);

-- May 3 domingo · cena post-excursión
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-lon-may03-cena', 'hito', 'food', 'londres-cena-20260503', 'Cena · Soho / Covent Garden',
 'Meal estimado €40/£35 pareja de regreso excursión. Sugerencia: Dishoom Covent Garden, Flat Iron (steak), o pub con Sunday Roast.',
 '2026-05-03', '2026-05-03T20:00:00+01:00', '2026-05-03T22:00:00+01:00', 'lon', 43.48, 'ms-lunch_dining', 0, 'both', 51.5136, -0.1365);

-- May 4 lunes · almuerzo + cena post-ABBA
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-lon-may04-almuerzo', 'hito', 'food', 'londres-almuerzo-20260504', 'Almuerzo · Soho',
 'Meal estimado €30/£25 pareja post-MinaLima. Sugerencia: Kiln (Tailandés), Bone Daddies, o Princi (italiano).',
 '2026-05-04', '2026-05-04T14:00:00+01:00', '2026-05-04T15:30:00+01:00', 'lon', 32.61, 'ms-lunch_dining', 0, 'both', 51.5136, -0.1365),
('ev-lon-may04-cena', 'hito', 'food', 'londres-cena-20260504', 'Cena · post-ABBA',
 'Meal estimado €40/£35 pareja post-ABBA Voyage. Sugerencia: Brat Shoreditch, Smoking Goat, o pub cercano King''s Cross.',
 '2026-05-04', '2026-05-04T20:30:00+01:00', '2026-05-04T22:00:00+01:00', 'lon', 43.48, 'ms-lunch_dining', 0, 'both', 51.5308, -0.1238);

-- ============================================================
-- París
-- ============================================================

-- May 5 martes · almuerzo + cena llegada París
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-par-may05-almuerzo', 'hito', 'food', 'paris-almuerzo-20260505', 'Almuerzo · barrio alojamiento',
 'Meal estimado €30 pareja post-Eurostar. Sugerencia: bistró clásico cerca Gare du Nord / Canal Saint-Martin.',
 '2026-05-05', '2026-05-05T13:00:00+02:00', '2026-05-05T14:30:00+02:00', 'par', 32.61, 'ms-lunch_dining', 0, 'both', 48.8800, 2.3550),
('ev-par-may05-cena', 'hito', 'food', 'paris-cena-20260505', 'Cena · París',
 'Meal estimado €40 pareja. Sugerencia: Bouillon Pigalle (económico clásico), Le Comptoir du Relais, o brasserie Saint-Germain.',
 '2026-05-05', '2026-05-05T20:00:00+02:00', '2026-05-05T22:00:00+02:00', 'par', 43.48, 'ms-lunch_dining', 0, 'both', 48.8800, 2.3550);

-- May 6 miércoles · almuerzo París + cena Roma
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-par-may06-almuerzo', 'hito', 'food', 'paris-almuerzo-20260506', 'Almuerzo rápido · post-Louvre',
 'Meal estimado €25 pareja pre-metro Orly. Sugerencia: crepería o café cerca Pyramides/Palais Royal.',
 '2026-05-06', '2026-05-06T13:15:00+02:00', '2026-05-06T14:00:00+02:00', 'par', 27.17, 'ms-lunch_dining', 0, 'both', 48.8634, 2.3328),
('ev-rom-may06-cena', 'hito', 'food', 'roma-cena-20260506', 'Cena · Colosseo',
 'Meal estimado €40 pareja post-arrival Roma 21:00. Sugerencia: Luzzi (pizzeria romana cerca Colosseo), Li Rioni, o osteria Monti.',
 '2026-05-06', '2026-05-06T21:30:00+02:00', '2026-05-06T22:45:00+02:00', 'rom', 43.48, 'ms-lunch_dining', 0, 'both', 41.8902, 12.4922);

-- ============================================================
-- Roma
-- ============================================================

-- May 7 jueves · almuerzo + cena Trastevere
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-rom-may07-almuerzo', 'hito', 'food', 'roma-almuerzo-20260507', 'Almuerzo · Prati / Vaticano',
 'Meal estimado €30 pareja post-Vaticano. Sugerencia: Pizzarium Bonci (al taglio), Mo''s Gelateria, o trattoria Prati.',
 '2026-05-07', '2026-05-07T13:00:00+02:00', '2026-05-07T14:30:00+02:00', 'rom', 32.61, 'ms-lunch_dining', 0, 'both', 41.9078, 12.4560),
('ev-rom-may07-cena', 'hito', 'food', 'roma-cena-20260507', 'Cena · Trastevere',
 'Meal estimado €40 pareja. Sugerencia: Da Enzo al 29 (cacio e pepe icónico, reservar), Tonnarello, o Osteria der Belli.',
 '2026-05-07', '2026-05-07T20:30:00+02:00', '2026-05-07T22:00:00+02:00', 'rom', 43.48, 'ms-lunch_dining', 0, 'both', 41.8890, 12.4700);

-- May 8 viernes · almuerzo + cena Roma
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-rom-may08-almuerzo', 'hito', 'food', 'roma-almuerzo-20260508', 'Almuerzo · Villa Borghese',
 'Meal estimado €30 pareja post-Galleria Borghese. Sugerencia: Casina Valadier (vistas), o trattoria cerca Piazza del Popolo.',
 '2026-05-08', '2026-05-08T13:00:00+02:00', '2026-05-08T14:30:00+02:00', 'rom', 32.61, 'ms-lunch_dining', 0, 'both', 41.9139, 12.4920),
('ev-rom-may08-cena', 'hito', 'food', 'roma-cena-20260508', 'Cena · Centro histórico',
 'Meal estimado €40 pareja última noche Roma. Sugerencia: Armando al Pantheon (reservar), Salumeria Roscioli, o Cul de Sac (vino+tablas).',
 '2026-05-08', '2026-05-08T20:30:00+02:00', '2026-05-08T22:00:00+02:00', 'rom', 43.48, 'ms-lunch_dining', 0, 'both', 41.8986, 12.4769);

-- May 9 sábado · almuerzo Roma pre-vuelo (cena Madrid ya existe)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, lat, lon) VALUES
('ev-rom-may09-almuerzo', 'hito', 'food', 'roma-almuerzo-20260509', 'Almuerzo · Roma pre-vuelo',
 'Meal estimado €30 pareja antes de FCO. Sugerencia: trattoria cerca Termini o último almuerzo Monti.',
 '2026-05-09', '2026-05-09T13:00:00+02:00', '2026-05-09T14:15:00+02:00', 'rom', 32.61, 'ms-lunch_dining', 0, 'both', 41.8902, 12.4922);
