-- 0099_madrid_apr20_fix.sql
-- Corregir orden y detalles del 20 abr según relato real

-- Reordenar: primero atardecer Templo de Debod, luego caminata nocturna
-- La vuelta fue en bus (no bici), Carrefour y cena en casa fue a la tarde

-- Delete existing Apr 20 events to rewrite
DELETE FROM events WHERE date = '2026-04-20' AND city_in = 'mad' AND id NOT IN ('ev-leg-scl-mad', 'ev-stay-bk-madrid-airbnb');

INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, done, variant, origin_lat, origin_lon) VALUES
('ev-mad-apr20-cafe-aeropuerto', 'hito', 'food', 'mad-cafe-aeropuerto-20260420',
 'Café en el aeropuerto · primera hora',
 'Aterrizaje en Barajas a primera hora. Un café en el aeropuerto mientras esperamos que amanezca del todo. Madrid se siente lejana todavía, con ese cansancio de haber cruzado el océano.',
 '2026-04-20', '2026-04-20T06:00:00+02:00', '2026-04-20T07:30:00+02:00', 'mad', 0.00, 'comida', 1, 1, 'both', 40.4983, -3.5676),

('ev-mad-apr20-oxigen-capsulas', 'hito', 'leisure', 'mad-oxigen-capsulas-20260420',
 'Oxígeno Cápsulas de descanso',
 'El cuerpo pedía reposo urgente. Encontramos Oxígeno y sus cápsulas de descanso — €39 bien invertidos. De 10:00 a 15:00, cinco horas de sueño reparador en cápsulas. Como recargar pilas en una estación espacial. Al salir, Madrid ya se sentía más cercana.',
 '2026-04-20', '2026-04-20T10:00:00+02:00', '2026-04-20T15:00:00+02:00', 'mad', 42.50, 'corazon', 1, 1, 'both', 40.4168, -3.7038),

('ev-mad-apr20-checkin-airbnb', 'hito', 'visit', 'mad-checkin-airbnb-20260420',
 'Check-in Airbnb Lavapiés · nuestro rincón madrileño',
 'Check-in a las 16:00 en el Airbnb de C. del Ave María 42, Lavapiés. El sillón verde, el televisor con brazo elástico, los vecinos gays de planta baja que le dan vida al edificio. La ducha que se mojaba toda y la cocina bastante equipada. Un lugar muy cómodo y muy bien ubicado — en el corazón de Lavapiés, todo a mano. Ya nos sentíamos en casa.',
 '2026-04-20', '2026-04-20T16:00:00+02:00', '2026-04-20T16:30:00+02:00', 'mad', 0.00, 'casa', 1, 1, 'both', 40.4097, -3.7013),

('ev-mad-apr20-carrefour24', 'hito', 'compras', 'mad-carrefour24-20260420',
 'Carrefour 24h · provisiones para la semana',
 'La vuelta fue en bus hasta el Carrefour 24 horas. Nos equipamos para los días que vienen — desayuno, snacks, lo básico. Comimos en casa, algo simple, recuperando energías.',
 '2026-04-20', '2026-04-20T16:30:00+02:00', '2026-04-20T18:00:00+02:00', 'mad', 0.00, 'compras', 1, 1, 'both', 40.4080, -3.6980),

('ev-mad-apr20-debod', 'hito', 'visit', 'mad-debod-20260420',
 'Atardecer en el Templo de Debod',
 'El Templo de Debod, un regalo de Egipto en medio de Madrid. Llegamos para el atardecer y el cielo se pintó de naranja y rosa sobre el parque. Un momento de paz absoluta, con la silueta del palacio real allá a lo lejos. Madrid nos estaba dando la bienvenida a su manera.',
 '2026-04-20', '2026-04-20T18:30:00+02:00', '2026-04-20T20:00:00+02:00', 'mad', 0.00, 'monumento', 1, 1, 'both', 40.4239, -3.7178),

('ev-mad-apr20-paseo-palacio-real', 'hito', 'visit', 'mad-paseo-palacio-real-20260420',
 'Caminata nocturna · Palacio Real y Madrid de noche',
 'Esa noche caminamos y caminamos y caminamos por toda Madrid. Los alrededores del Palacio Real iluminados, las calles del centro con vida propia. Madrid de noche tiene otro ritmo. Descubrimos rincones sin mapa, nos dejamos llevar por las luces y el bullicio.',
 '2026-04-20', '2026-04-20T20:00:00+02:00', '2026-04-20T22:30:00+02:00', 'mad', 0.00, 'monumento', 1, 1, 'both', 40.4180, -3.7145),

('ev-mad-apr20-metro', 'hito', 'leisure', 'mad-metro-20260420',
 'Metro · organizando Madrid',
 'Compramos el metro y organizamos los días siguientes. Con el abono en mano, Madrid se sentía nuestra.',
 '2026-04-20', '2026-04-20T22:30:00+02:00', '2026-04-20T23:30:00+02:00', 'mad', 0.00, 'subte', 1, 1, 'both', 40.4100, -3.7050);

-- Mark Airbnb stay as done
UPDATE events SET done = 1 WHERE id = 'ev-stay-bk-madrid-airbnb';
