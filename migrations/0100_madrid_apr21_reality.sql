-- 0100_madrid_apr21_reality.sql
-- Bitácora real Lun 21 abr: Big Bus + Retiro + bar nocturno

-- Delete existing Apr 21 Madrid events
DELETE FROM events WHERE date = '2026-04-21' AND city_in = 'mad';

INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, done, variant, origin_lat, origin_lon) VALUES
('ev-mad-apr21-bigbus', 'hito', 'tour', 'mad-bigbus-20260421',
 'Big Bus Madrid · día completo',
 'El día del Big Bus. Subimos al bus turístico y recorrimos Madrid entera: la Gran Vía, la Puerta del Sol, el Paseo del Arte, Plaza de Cibeles, la Puerta de Alcalá, el Barrio de Salamanca, el Bernabéu... Madrid se nos reveló desde el segundo piso del bus, con el viento en la cara y la ciudad entera desplegada como un mapa vivo. Bajábamos, caminábamos, volvíamos a subir. Así conocimos Madrid de verdad.',
 '2026-04-21', '2026-04-21T09:30:00+02:00', '2026-04-21T14:00:00+02:00', 'mad', 0.00, 'colectivo', 1, 1, 'both', 40.4168, -3.7038),

('ev-mad-apr21-retiro-bici', 'hito', 'leisure', 'mad-retiro-bici-20260421',
 'Parque del Retiro en bicicleta',
 'Por la tarde fuimos al Parque del Retiro en bicicleta. Pedaleando por los senderos entre árboles, el lago con sus barquitas, el Palacio de Cristal brillando con la luz de la tarde. Todo en bici — los trayectos, las paradas, el ritmo lo marcaban las ruedas.',
 '2026-04-21', '2026-04-21T15:00:00+02:00', '2026-04-21T17:30:00+02:00', 'mad', 0.00, 'vela', 1, 1, 'both', 40.4153, -3.6845),

('ev-mad-apr21-almuerzo-retiro', 'hito', 'food', 'mad-almuerzo-retiro-20260421',
 'Almuerzo tardío · pescado con naranjas en el Retiro',
 'Almuerzo tardío en el Retiro. Un pescado con naranjas — simple, fresco, memorable. Comer al aire libre en el parque con el sol de la tarde es algo que Madrid te regala sin pedir nada a cambio.',
 '2026-04-21', '2026-04-21T17:30:00+02:00', '2026-04-21T18:30:00+02:00', 'mad', 0.00, 'comida', 1, 1, 'both', 40.4153, -3.6845),

('ev-mad-apr21-viento-colectivo', 'hito', 'visit', 'mad-viento-colectivo-20260421',
 'Viento · regreso en colectivo',
 'Nos agarró el viento ahí mismo en el Retiro y no hubo otra: tocó volver en colectivo al departamento. Las bicis se quedaron guardadas y nosotros nos acurrucamos en el bus, con el viento sacudiendo los árboles afuera. A veces Madrid te dice basta.',
 '2026-04-21', '2026-04-21T18:30:00+02:00', '2026-04-21T19:30:00+02:00', 'mad', 0.00, 'colectivo', 1, 1, 'both', 40.4153, -3.6845),

('ev-mad-apr21-bar-nocturno', 'hito', 'bar', 'mad-bar-nocturno-20260421',
 'Bar nocturno · noche del aniversario',
 'Esa noche del 21, nuestro aniversario, fuimos a un bar y pasamos la noche ahí. Sin prisas, sin plan, solo estar. Brindamos con lo que había, charlamos hasta tarde, dejamos que la noche madrileña nos abrazara. No hace falta mucho cuando tenés treinta años para celebrar.',
 '2026-04-21', '2026-04-21T21:00:00+02:00', '2026-04-22T01:00:00+02:00', 'mad', 0.00, 'corazon', 1, 1, 'both', 40.4097, -3.7013);
