-- 0030_london_abba_voyage.sql
-- Agrega ABBA Voyage (experiencia sensorial inmersiva) al May 4 2026
-- después del Sky Garden. Se mantiene House of MinaLima en la mañana —
-- MinaLima cubre el pedido "experiencia Harry Potter" y ABBA Voyage cubre
-- "experiencia sensorial".
--
-- Timeline May 4:
--   11:30–13:30  MinaLima (HP, Soho)
--   13:30–15:30  almuerzo + tube a la City
--   16:00–17:30  Sky Garden (CONFIRMADO, 20 Fenchurch)
--   17:30–18:30  tube Bank → Stratford/Pudding Mill Lane (~25 min) + snack rápido
--   18:45–20:15  ABBA Voyage (ABBA Arena, ~90 min)
--   20:30–21:30  tube de vuelta a King's Cross, dormir
--
-- ABBA Arena está en Pudding Mill Lane (Queen Elizabeth Olympic Park),
-- coords 51.5386, -0.0145. Shows múltiples por día; el slot ~18:45 suele
-- existir y deja dormir temprano para el Eurostar 08:01 del May 5.
-- Reservar en abbavoyage.com (£50–£120 pp según sección).

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, icon, confirmed, variant, notes,
  lat, lon
) VALUES (
  'ev-lon-may04-abba', 'hito', 'show', 'lon-abba-voyage-20260504',
  'ABBA Voyage · experiencia sensorial inmersiva',
  'Concierto holográfico de ABBA (ABBAtars) en la ABBA Arena · ~90 min',
  '2026-05-04',
  '2026-05-04T18:45:00', '2026-05-04T20:15:00',
  'lon', 'pi-star-fill', 0, 'both',
  '£50–£120 pp según sección. ABBA Arena en Pudding Mill Lane (Queen Elizabeth Olympic Park), DLR Pudding Mill Lane o tube Stratford. ~90 min show. Reservar en abbavoyage.com — elegir slot temprano (~18:45) para llegar a King''s Cross antes de las 22:00 y dormir temprano para el Eurostar 08:01 del May 5. Post-Sky Garden 17:30 → tube Bank → DLR → arena ~18:30 → show 18:45.',
  51.5386, -0.0145
);
