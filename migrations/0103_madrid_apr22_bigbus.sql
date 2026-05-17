-- 0103_madrid_apr22_bigbus.sql
-- El 22 arranca con Big Bus (nos quedaba del 21), luego Prado

INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, done, variant, origin_lat, origin_lon) VALUES
('ev-mad-apr22-citybus-manana', 'hito', 'tour', 'mad-citybus-manana-20260422',
 'Big Bus · segunda vuelta (nos quedaba del 21)',
 'El día arrancó con el Big Bus — nos quedaba del día anterior y lo aprovechamos. Segunda vuelta por Madrid, bajando en las paradas que no habíamos visto antes. El bus nos dejó cerca del Prado y de ahí continuamos el día.',
 '2026-04-22', '2026-04-22T09:00:00+02:00', '2026-04-22T10:00:00+02:00', 'mad', 0.00, 'colectivo', 1, 1, 'both', 40.4168, -3.7038);

UPDATE events SET timestamp_in = '2026-04-22T10:30:00+02:00' WHERE id = 'ev-mad-apr22-prado';
