-- 0116: Día 4 (2026-05-04, Londres) — reconstrucción real de la mañana/mediodía.
-- Antes del British Museum: caminata + almuerzo en Leadenhall Market, luego Sky Garden.
-- El British Museum se corre de 10:00 a 15:00 (el museo fue DESPUÉS del almuerzo y Sky Garden).
-- Todo confirmado y done (eventos ya vividos). Idempotente: borra por id antes de insertar.

DELETE FROM events WHERE id IN ('ev-lon-may04-leadenhall-market', 'ev-lon-may04-sky-garden');

UPDATE events
SET timestamp_in = '2026-05-04T15:00:00+01:00'
WHERE id = 'ev-lon-may04-british-museum';

INSERT INTO events
  (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out,
   city_in, city_out, usd, icon, confirmed, variant, card_id, notes,
   lat, lon, mandatory, done)
VALUES
  ('ev-lon-may04-leadenhall-market', 'hito', 'comida', 'lon-may04-leadenhall-market',
   'Caminata + almuerzo en Leadenhall Market',
   'Mercado victoriano cubierto en la City of London (1881): hierro forjado pintado en burdeos, verde y crema, techo ornamentado y patio de comidas. Caminata hasta el mercado y almuerzo ahí.',
   '2026-05-04', '2026-05-04T11:00:00+01:00', '2026-05-04T13:00:00+01:00',
   'lon', NULL, 0, 'comida', 1, 'both', NULL, NULL,
   51.512779, -0.083662, 0, 1),

  ('ev-lon-may04-sky-garden', 'hito', 'mirador', 'lon-may04-sky-garden',
   'Sky Garden',
   'Mirador público en lo alto de 20 Fenchurch Street ("Walkie-Talkie"), con jardín interior y vistas 360° de Londres. A pasos de Leadenhall Market.',
   '2026-05-04', '2026-05-04T13:00:00+01:00', '2026-05-04T14:30:00+01:00',
   'lon', NULL, 0, 'mirador', 1, 'both', NULL, NULL,
   51.511441, -0.083604, 0, 1);
