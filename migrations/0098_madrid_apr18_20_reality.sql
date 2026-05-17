-- 0098_madrid_apr18_20_reality.sql
-- Bitácora real del viaje: Santiago pre-vuelo + llegada Madrid + día 20 abr
-- Formato diario de viaje con descripciones narrativas

-- ============================================================
-- SÁB 18 ABR — Santiago, pre-vuelo
-- ============================================================

-- Delete existing Santiago events (if any)
DELETE FROM events WHERE city_in = 'scl';

INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, done, variant, origin_lat, origin_lon) VALUES
('ev-scl-apr18-checkin', 'estadia', 'hotel', 'scl-hotel-pudahuel-20260418',
 'Hotel Diego de Almagro Pudahuel Aeropuerto',
 'Llegada al hotel junto al aeropuerto. Agradable sorpresa: pileta climatizada y servicio de primera. Una excelente noche de descanso antes del vuelo largo. Booking ref 6773267616.',
 '2026-04-18', '2026-04-18T18:00:00-04:00', '2026-04-19T04:30:00-04:00', 'scl', 0.00, 'cama', 1, 1, 'both', -33.3930, -70.7860),

('ev-scl-apr18-outlet', 'hito', 'compras', 'scl-style-outlet-20260418',
 'Style Outlet Pudahuel · visita de pasada',
 'Visita breve al Style Outlet Pudahuel (Av. Claudio Arrau #6910, metro Barrancas). Un paseo antes de encerrarse en el hotel. Uber ida y vuelta desde el hotel.',
 '2026-04-18', '2026-04-18T19:00:00-04:00', '2026-04-18T20:30:00-04:00', 'scl', 0.00, 'compras', 1, 1, 'both', -33.4250, -70.7510),

('ev-scl-apr18-uber-outlet', 'traslado', 'taxi', 'scl-uber-outlet-20260418',
 'Uber · Hotel → Style Outlet → Hotel',
 'Uber ida y vuelta entre el hotel Diego de Almagro Pudahuel y el Style Outlet.',
 '2026-04-18', '2026-04-18T18:45:00-04:00', '2026-04-18T20:45:00-04:00', 'scl', 0.00, 'colectivo', 1, 1, 'both', -33.3930, -70.7860);

-- ============================================================
-- DOM 19 ABR — Vuelo SCL → MAD (solo vuelo, nada que contar)
-- ============================================================
UPDATE events SET done = 1, description = 'Vuelo SCL → MAD. Iberia, salida 06:40 CLT. Larga travesía sobre el Atlántico. Sin incidentes.' WHERE id = 'ev-leg-scl-mad';

-- ============================================================
-- DOM 20 ABR — Llegada a Madrid, primer día
-- ============================================================

-- Delete all existing Apr 20 Madrid events (except flight and Airbnb stay)
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
 '2026-04-20', '2026-04-20T16:00:00+02:00', '2026-04-20T17:00:00+02:00', 'mad', 0.00, 'casa', 1, 1, 'both', 40.4097, -3.7013),

('ev-mad-apr20-carrefour24', 'hito', 'compras', 'mad-carrefour24-20260420',
 'Carrefour 24h · provisiones para la semana',
 'Salimos a dar una vuelta y a la vuelta pasamos por un Carrefour 24 horas. Nos equipamos para los días que vienen — desayuno, snacks, lo básico. Cuando viajás con carry-on solo, el supermercado es tu mejor amigo.',
 '2026-04-20', '2026-04-20T17:30:00+02:00', '2026-04-20T18:30:00+02:00', 'mad', 0.00, 'compras', 1, 1, 'both', 40.4080, -3.6980),

('ev-mad-apr20-paseo-palacio-real', 'hito', 'visit', 'mad-paseo-palacio-real-20260420',
 'Caminata nocturna · Palacio Real y Madrid de noche',
 'Esa noche caminamos y caminamos y caminamos por toda Madrid. Los alrededores del Palacio Real iluminados, las calles del centro con vida propia. Madrid de noche tiene otro ritmo. Descubrimos rincones sin mapa, nos dejamos llevar por las luces y el bullicio.',
 '2026-04-20', '2026-04-20T19:30:00+02:00', '2026-04-20T22:00:00+02:00', 'mad', 0.00, 'monumento', 1, 1, 'both', 40.4180, -3.7145),

('ev-mad-apr20-metro-bici', 'hito', 'leisure', 'mad-metro-bici-20260420',
 'Metro + Bicis azules · organizando Madrid',
 'Compramos el metro y organizamos los días siguientes. Alquilamos las bicis azules — esas que ves por toda Madrid y que te invitan a pedalear. Con ellas y con el abono de metro, Madrid se sentía nuestra.',
 '2026-04-20', '2026-04-20T22:00:00+02:00', '2026-04-20T23:30:00+02:00', 'mad', 0.00, 'vela', 1, 1, 'both', 40.4100, -3.7050);

-- Mark Airbnb stay as done
UPDATE events SET done = 1 WHERE id = 'ev-stay-bk-madrid-airbnb';
