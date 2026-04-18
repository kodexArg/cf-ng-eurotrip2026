-- 0089_barcelona_blank_slate.sql
-- Barcelona Apr 24-28: reemplaza plan propuesto por uno nuevo budget-friendly.
--
-- Cambios:
--   1. Fix coords Airbnb BCN (Nou de la Rambla 152, Poble Sec CP 08004).
--      Actual DB (41.3874, 2.1686) cae en Rambla central · correcto: 41.3720, 2.1600.
--   2. DELETE todos los eventos BCN confirmed=0 entre Apr 24-28 (plan anterior).
--   3. INSERT nuevo plan (25 eventos):
--        Vie 24: llegada + Born/Gòtic gratis
--        Sáb 25: Articket 4/6 (Picasso + CCCB + MNAC + Miró) + Font Màgica (confirmed=1)
--        Dom 26: Park Güell (ya confirmado) + Gràcia + Bunkers sunset
--        Lun 27: Ciutadella + Barceloneta + Sagrada (ya confirmado) + Sant Pau exterior
--        Mar 28: Aerobús A1 Pl. Espanya → T1 (confirmed=1)
--   Verificación 2026: Articket €38 pp, T-Casual €13, Aerobús €7.45, Font Màgica
--   Thu-Sat 20-21h activa abril, Bunkers gratis 09-19:30, MNAC cierra 18h invierno.

-- ─────────────────────────────────────────────────────────────────────
-- PART 1: Fix coordenadas Airbnb (Nou de la Rambla 152, Poble Sec)
-- ─────────────────────────────────────────────────────────────────────
UPDATE events
SET origin_lat = 41.3720, origin_lon = 2.1600
WHERE id = 'ev-stay-bk-bcn-airbnb';

-- ─────────────────────────────────────────────────────────────────────
-- PART 2: DELETE plan anterior (solo confirmed=0)
-- ─────────────────────────────────────────────────────────────────────
DELETE FROM events
WHERE city_in = 'bcn'
  AND confirmed = 0
  AND date BETWEEN '2026-04-24' AND '2026-04-28';

-- ─────────────────────────────────────────────────────────────────────
-- PART 3: INSERT nuevo plan — Día 1 Vie 24 abr (llegada + Born/Gòtic)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, origin_lat, origin_lon) VALUES
('ev-bcn-apr24-lunch-blai', 'hito', 'food', 'bcn-lunch-blai-20260424',
 'Carrer Blai · pinchos bienvenida',
 'Calle peatonal de pinchos Poble Sec. Blai 9 / La Tasqueta de Blai. Pinchos €1-2 c/u, vegetariano y pescado abundantes. 3 min walking desde Airbnb.',
 '2026-04-24', '2026-04-24T13:00:00+02:00', '2026-04-24T14:30:00+02:00', 'bcn', 22.00, 'comida', 0, 'both', 41.3727, 2.1650),
('ev-bcn-apr24-boqueria', 'hito', 'visit', 'bcn-boqueria-20260424',
 'Mercat La Boqueria',
 'Mercat St Josep Mon-Sat 08-20h, entrada gratis. Jugos €2, jamón, pescado fresco. 30 min tour rápido.',
 '2026-04-24', '2026-04-24T16:45:00+02:00', '2026-04-24T17:20:00+02:00', 'bcn', 0.00, 'compras', 0, 'both', 41.3819, 2.1719),
('ev-bcn-apr24-placa-reial', 'hito', 'visit', 'bcn-placa-reial-20260424',
 'Plaça Reial · farolas Gaudí 1879',
 'Palmeras y farolas de Gaudí (1879, primera obra pública). Primera pista modernista antes del gran tour.',
 '2026-04-24', '2026-04-24T17:25:00+02:00', '2026-04-24T17:45:00+02:00', 'bcn', 0.00, 'monumento', 0, 'both', 41.3802, 2.1751),
('ev-bcn-apr24-santa-maria-del-mar', 'hito', 'visit', 'bcn-smm-20260424',
 'Santa María del Mar (Born)',
 'Basílica gótica catalana s.XIV, interior gratis 17-20:30. La catedral del pueblo, pura piedra y luz.',
 '2026-04-24', '2026-04-24T18:00:00+02:00', '2026-04-24T18:45:00+02:00', 'bcn', 0.00, 'iglesia', 0, 'both', 41.3836, 2.1820),
('ev-bcn-apr24-born-tapeo', 'hito', 'bar', 'bcn-born-vermut-20260424',
 'Vermut Bar del Pla (Born)',
 'Bar del Pla (Montcada 2). Bravas + vermut casero ~€18 pareja. Ambiente local no turistero.',
 '2026-04-24', '2026-04-24T19:15:00+02:00', '2026-04-24T20:30:00+02:00', 'bcn', 20.00, 'corazon', 0, 'both', 41.3846, 2.1820),
('ev-bcn-apr24-cena-calders', 'hito', 'food', 'bcn-cena-calders-20260424',
 'Cena Bar Calders (Sant Antoni)',
 'Bar Calders (Parlament 25, 12 min walking desde Airbnb). Vermut + tapas catalanas, ~€30 pareja.',
 '2026-04-24', '2026-04-24T21:30:00+02:00', '2026-04-24T22:45:00+02:00', 'bcn', 32.00, 'comida', 0, 'both', 41.3778, 2.1608);

-- ─────────────────────────────────────────────────────────────────────
-- PART 4: INSERT Día 2 Sáb 25 abr (Articket 4/6 · confirmed=1)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, origin_lat, origin_lon) VALUES
('ev-bcn-apr25-picasso', 'hito', 'visit', 'bcn-picasso-20260425',
 'Museu Picasso · Articket 1/6',
 'Montcada 15-23, Born. Articket BCN (€38 pp, cubre 6 museos). Colección años formativos del maestro en BCN. ~90 min.',
 '2026-04-25', '2026-04-25T10:00:00+02:00', '2026-04-25T11:30:00+02:00', 'bcn', 41.30, 'museo', 1, 'both', 41.3851, 2.1810),
('ev-bcn-apr25-cccb', 'hito', 'visit', 'bcn-cccb-20260425',
 'CCCB · Articket 2/6',
 'Centre de Cultura Contemporània (Montalegre 5, Raval). Exhibiciones temporales siempre potentes. ~90 min.',
 '2026-04-25', '2026-04-25T12:15:00+02:00', '2026-04-25T13:45:00+02:00', 'bcn', 0.00, 'museo', 1, 'both', 41.3832, 2.1678),
('ev-bcn-apr25-lunch-elisabets', 'hito', 'food', 'bcn-lunch-elisabets-20260425',
 'Lunch Elisabets (Raval)',
 'Elisabets 2-4, Raval. Menú del día ~€14 pp (2 platos + bebida + postre). Clásico local, pescado/vegetariano OK.',
 '2026-04-25', '2026-04-25T14:00:00+02:00', '2026-04-25T15:00:00+02:00', 'bcn', 30.00, 'comida', 0, 'both', 41.3829, 2.1680),
('ev-bcn-apr25-mnac', 'hito', 'visit', 'bcn-mnac-20260425',
 'MNAC · Articket 3/6 (cierra 18h)',
 'Museu Nacional d''Art de Catalunya, Palau Nacional Montjuïc. ROMÁNICO catalán único en el mundo + gótico + modernismo. Terrazas con vistas. Horario invierno Mar-Sab 10-18h, entrar 15:30 para 2.5h.',
 '2026-04-25', '2026-04-25T15:30:00+02:00', '2026-04-25T18:00:00+02:00', 'bcn', 41.30, 'museo', 1, 'both', 41.3687, 2.1536),
('ev-bcn-apr25-miro', 'hito', 'visit', 'bcn-miro-20260425',
 'Fundació Joan Miró · Articket 4/6',
 'Parc de Montjuïc. Obra del maestro catalán + esculturas terraza. Cierra 20h. ~75 min.',
 '2026-04-25', '2026-04-25T18:15:00+02:00', '2026-04-25T19:30:00+02:00', 'bcn', 0.00, 'museo', 1, 'both', 41.3686, 2.1601),
('ev-bcn-apr25-font-magica', 'hito', 'show', 'bcn-font-magica-20260425',
 'Font Màgica Montjuïc (gratis)',
 'Show gratis agua+luz+música, escalinatas Palau Nacional. Activa abril 2026, horario Thu-Sat 20:00-21:00.',
 '2026-04-25', '2026-04-25T20:00:00+02:00', '2026-04-25T21:00:00+02:00', 'bcn', 0.00, 'show', 0, 'both', 41.3711, 2.1520),
('ev-bcn-apr25-cena-napoli', 'hito', 'food', 'bcn-cena-napoli-20260425',
 'Pizza Bella Napoli (Poble Sec)',
 'Margarit 14, Poble Sec. Pizza napolitana auténtica, ~€28 pareja.',
 '2026-04-25', '2026-04-25T21:30:00+02:00', '2026-04-25T22:45:00+02:00', 'bcn', 28.00, 'comida', 0, 'both', 41.3741, 2.1625);

-- ─────────────────────────────────────────────────────────────────────
-- PART 5: INSERT Día 3 Dom 26 abr (post Park Güell + Gràcia + Bunkers)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, origin_lat, origin_lon) VALUES
('ev-bcn-apr26-casa-vicens-ext', 'hito', 'visit', 'bcn-casa-vicens-ext-20260426',
 'Casa Vicens exterior (Gaudí 1883)',
 'Carolines 24, Gràcia. Primera casa de Gaudí (1883, neomudéjar). Se ve fachada desde reja, entrada €40 pareja OPT (saltamos por budget).',
 '2026-04-26', '2026-04-26T13:00:00+02:00', '2026-04-26T13:15:00+02:00', 'bcn', 0.00, 'monumento', 0, 'both', 41.4041, 2.1519),
('ev-bcn-apr26-lunch-pubilla', 'hito', 'food', 'bcn-lunch-pubilla-20260426',
 'Lunch La Pubilla (Gràcia)',
 'Plaça Llibertat 23, Gràcia. Menú del día €15 pp, cocina catalana de mercado. ~€35 pareja.',
 '2026-04-26', '2026-04-26T13:30:00+02:00', '2026-04-26T14:45:00+02:00', 'bcn', 35.00, 'comida', 0, 'both', 41.4024, 2.1555),
('ev-bcn-apr26-vermut-gracia', 'hito', 'bar', 'bcn-vermut-gracia-20260426',
 'Vermut Plaça Revolució (Gràcia)',
 'Plaça de la Revolució de Setembre 1868. Vermut en terraza barrio, ~€10 pareja.',
 '2026-04-26', '2026-04-26T16:00:00+02:00', '2026-04-26T17:00:00+02:00', 'bcn', 10.00, 'corazon', 0, 'both', 41.4036, 2.1574),
('ev-bcn-apr26-bunkers', 'hito', 'landscape', 'bcn-bunkers-20260426',
 'Bunkers del Carmel · sunset 20:45',
 'Turó de la Rovira (MUHBA). Ruinas baterías antiaéreas guerra civil, mirador 360°. GRATIS 09-19:30. Sunset abril ~20:45. Subir bus V17/119 desde Gràcia.',
 '2026-04-26', '2026-04-26T18:15:00+02:00', '2026-04-26T21:15:00+02:00', 'bcn', 0.00, 'parque', 0, 'both', 41.4185, 2.1577),
('ev-bcn-apr26-cena-ligera', 'hito', 'food', 'bcn-cena-ligera-20260426',
 'Cena ligera Poble Sec',
 'Takeaway/pizza/burger barrio post-Bunkers (supermercado o McDonald''s Paral·lel aceptable). ~€15 pareja.',
 '2026-04-26', '2026-04-26T22:15:00+02:00', '2026-04-26T23:00:00+02:00', 'bcn', 15.00, 'comida', 0, 'both', 41.3735, 2.1620);

-- ─────────────────────────────────────────────────────────────────────
-- PART 6: INSERT Día 4 Lun 27 abr (Ciutadella + Barceloneta + post-Sagrada)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, origin_lat, origin_lon) VALUES
('ev-bcn-apr27-arc-triomf', 'hito', 'visit', 'bcn-arc-triomf-20260427',
 'Arc de Triomf (neomudéjar 1888)',
 'Passeig Lluís Companys. Arco Exposición Universal 1888. Gratis ver, foto obligada.',
 '2026-04-27', '2026-04-27T10:30:00+02:00', '2026-04-27T10:45:00+02:00', 'bcn', 0.00, 'monumento', 0, 'both', 41.3910, 2.1805),
('ev-bcn-apr27-ciutadella', 'hito', 'leisure', 'bcn-ciutadella-20260427',
 'Parc de la Ciutadella',
 'Gratis. Cascada Monumental (Gaudí joven colaboró 1881 con Fontserè) + Hivernacle/Umbracle (invernaderos modernistas) + Castell dels Tres Dragons exterior (Domènech i Montaner) + Parlament Catalunya exterior. Opcional barcas €8 pareja.',
 '2026-04-27', '2026-04-27T10:45:00+02:00', '2026-04-27T12:30:00+02:00', 'bcn', 0.00, 'parque', 0, 'both', 41.3880, 2.1870),
('ev-bcn-apr27-barceloneta', 'hito', 'leisure', 'bcn-barceloneta-20260427',
 'Paseo Barceloneta + W Hotel Vela',
 'Walking Born → paseo marítimo Barceloneta. Playa + foto W Hotel vela al fondo.',
 '2026-04-27', '2026-04-27T13:00:00+02:00', '2026-04-27T13:45:00+02:00', 'bcn', 0.00, 'parque', 0, 'both', 41.3795, 2.1897),
('ev-bcn-apr27-lunch-cova', 'hito', 'food', 'bcn-lunch-cova-20260427',
 'Lunch La Cova Fumada (Barceloneta)',
 'Baluard 56, Barceloneta. Bar obrero clásico, las bombas originales (patatas rellenas carne + salsa brava). ~€35 pareja.',
 '2026-04-27', '2026-04-27T14:00:00+02:00', '2026-04-27T15:30:00+02:00', 'bcn', 35.00, 'comida', 0, 'both', 41.3792, 2.1892),
('ev-bcn-apr27-sant-pau', 'hito', 'visit', 'bcn-sant-pau-20260427',
 'Hospital Sant Pau exterior (UNESCO)',
 'Domènech i Montaner, modernismo UNESCO. Walking Avinguda Gaudí desde Sagrada (1 km peatonal). Exterior gratis, interior €17pp saltamos.',
 '2026-04-27', '2026-04-27T19:30:00+02:00', '2026-04-27T20:30:00+02:00', 'bcn', 0.00, 'monumento', 0, 'both', 41.4132, 2.1781),
('ev-bcn-apr27-cena-ligera', 'hito', 'food', 'bcn-cena-ligera-20260427',
 'Cena ligera Poble Sec',
 'Post-Sagrada/Sant Pau. Supermercado/takeaway barrio. ~€15 pareja.',
 '2026-04-27', '2026-04-27T21:30:00+02:00', '2026-04-27T22:30:00+02:00', 'bcn', 15.00, 'comida', 0, 'both', 41.3735, 2.1620);

-- ─────────────────────────────────────────────────────────────────────
-- PART 7: INSERT Día 5 Mar 28 abr (salida aerobús, confirmed=1)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, origin_lat, origin_lon, destination_lat, destination_lon) VALUES
('ev-bcn-apr28-aerobus-t1', 'traslado', 'bus', 'bcn-aerobus-t1-20260428',
 'Aerobús A1 Pl. Espanya → T1 El Prat',
 'Primer servicio ~05:30, cada 5-10 min, 35 min viaje. €7.45 pp × 2 = €14.90 pareja. Más barato y directo que L9 Sud (€20 pareja).',
 '2026-04-28', '2026-04-28T05:30:00+02:00', '2026-04-28T06:05:00+02:00', 'bcn', 14.90, 'colectivo', 1, 'both', 41.3754, 2.1494, 41.2965, 2.0862);
