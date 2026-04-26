-- 0095_barcelona_apr25_gotic_nocturno.sql
-- Sáb 25 abr: Barrio Gótico + paseo nocturno (confirmado)

INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, origin_lat, origin_lon) VALUES
('ev-bcn-apr25-gotic-nocturno', 'hito', 'visit', 'bcn-gotic-nocturno-20260425',
 'Barrio Gótico + paseo nocturno',
 'Paseo nocturno por el Barrio Gótico. Calles medievales, Plaza del Rei, Catedral iluminada, Plaça Sant Jaume. Ambiente mágico de noche.',
 '2026-04-25', '2026-04-25T22:00:00+02:00', '2026-04-25T23:30:00+02:00', 'bcn', 0.00, 'monumento', 1, 'both', 41.3827, 2.1763);
