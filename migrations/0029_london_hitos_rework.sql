-- 0029_london_hitos_rework.sql
-- Rework completo de los hitos de Londres (May 2–4 2026) según instrucciones
-- del usuario. Se eliminan TODOS los hitos existentes no confirmados y se
-- insertan los nuevos. Stonehenge se preserva como id pero se re-crea tras
-- el DELETE para simplificar (mismo id, datos actualizados a 11h reales).
--
-- Plan del usuario:
--   May 2: City tour walking por el centro (Westminster/Trafalgar/Covent) +
--          Denmark Street / Soho bars al anochecer. Check-in King's Cross.
--   May 3: Stonehenge excursión de día completo (~11h). Y nada más.
--   May 4: Morning House of MinaLima (exhibición HP gratis, Wardour St) +
--          Sky Garden 16:00 CONFIRMADO (la "torre con jardín" = 20 Fenchurch
--          "Walkie-Talkie") + cena temprana para dormir temprano.
--   May 5: Eurostar 08:01 a París (ya registrado).
--
-- Nota sobre Harry Potter: el agente Haiku confirmó que "Cursed Child
-- Part Two" corre 19:00–22:00 en Palace Theatre, incompatible con el sueño
-- temprano pre-Eurostar. House of MinaLima (157 Wardour St, Soho) es la
-- mejor alternativa HP: exhibición gratis con props auténticos de las
-- películas Warner Bros, abierta 11:00–18:45.

-- ─────────────────────────────────────────────────────────────────────
-- 1. Borrar hitos existentes de Londres (todos no confirmados)
-- ─────────────────────────────────────────────────────────────────────
DELETE FROM events
  WHERE type = 'hito'
    AND city_in = 'lon';

-- ─────────────────────────────────────────────────────────────────────
-- 2. May 2: City tour walking
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, icon, confirmed, variant, notes,
  lat, lon
) VALUES (
  'ev-lon-may02-citytour', 'hito', 'tour', 'lon-citytour-20260502',
  'City tour a pie por el centro',
  'Westminster · Big Ben · Abadía · Trafalgar Square · Covent Garden',
  '2026-05-02',
  '2026-05-02T11:00:00', '2026-05-02T15:00:00',
  'lon', 'pi-map', 0, 'both',
  'Free walking tour o self-guided desde Westminster → Big Ben → Parliament Square → Trafalgar Square → Covent Garden. ~4h a pie. Arribo Londres 08:57 vía Stansted Express, drop bags en King''s Cross y arrancar al mediodía.',
  51.5007, -0.1246
);

-- ─────────────────────────────────────────────────────────────────────
-- 3. May 2: Denmark Street (rock) + Soho bars al anochecer
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, icon, confirmed, variant, notes,
  lat, lon
) VALUES (
  'ev-lon-may02-denmark', 'hito', 'bar', 'lon-denmark-soho-20260502',
  'Denmark Street · Soho bars',
  'Tin Pan Alley (calle del rock) + pubs y bares de Soho',
  '2026-05-02',
  '2026-05-02T18:00:00', '2026-05-02T22:00:00',
  'lon', 'pi-star', 0, 'both',
  'Denmark Street = "Tin Pan Alley", histórica calle del rock londinense (guitarrerías, Regent Sounds Studio donde grabaron los Stones). De ahí a Soho: The Dog and Duck, Bar Italia, pubs del West End. Cerrar antes de medianoche — día largo mañana.',
  51.5155, -0.1291
);

-- ─────────────────────────────────────────────────────────────────────
-- 4. May 3: Stonehenge full-day 11h
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, icon, confirmed, variant, notes,
  lat, lon
) VALUES (
  'ev-lon-may03-stonehenge', 'hito', 'excursion', 'stonehenge-20260503',
  'Stonehenge · excursión día completo',
  'Tour organizado de ~11h desde Londres a Stonehenge (Salisbury Plain)',
  '2026-05-03',
  '2026-05-03T08:00:00', '2026-05-03T19:00:00',
  'lon', 'pi-compass', 0, 'both',
  '~11 horas puerta a puerta. Opciones de tour desde Londres: Evan Evans / Golden Tours / Premium Tours (pick-up central ~07:30–08:00, regreso ~18:30–19:00). £60–£95 pp con entrada incluida. Algunos tours suman Bath o Windsor en combo — el usuario quiere SOLO Stonehenge ("y nada más"). Reservar anticipado.',
  51.1789, -1.8262
);

-- ─────────────────────────────────────────────────────────────────────
-- 5. May 4: House of MinaLima (experiencia Harry Potter, gratis)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, icon, confirmed, variant, notes,
  lat, lon
) VALUES (
  'ev-lon-may04-minalima', 'hito', 'museo', 'lon-minalima-20260504',
  'House of MinaLima · experiencia Harry Potter',
  'Exhibición gráfica oficial de las películas Harry Potter · 4 pisos · props auténticos Warner Bros',
  '2026-05-04',
  '2026-05-04T11:30:00', '2026-05-04T13:30:00',
  'lon', 'pi-book', 0, 'both',
  'GRATIS. 157 Wardour St, Soho. Abierto 11:00–18:45 todos los días. Diseño gráfico oficial de las 8 películas (El Profeta, Mapa del Merodeador, boletos Hogwarts Express, etc.) y props reales. Alternativa descartada: "Cursed Child Part Two" en Palace Theatre 19:00–22:00 incompatible con sueño temprano pre-Eurostar 08:01 May 5.',
  51.5145, -0.1325
);

-- ─────────────────────────────────────────────────────────────────────
-- 6. May 4: Sky Garden 16:00 CONFIRMADO
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, icon, confirmed, variant, notes,
  lat, lon
) VALUES (
  'ev-lon-may04-skygarden', 'hito', 'mirador', 'lon-skygarden-20260504',
  'Sky Garden · 20 Fenchurch (Walkie-Talkie)',
  'Jardín público y mirador 360° en el piso 35 del edificio "Walkie-Talkie" · entrada gratis con reserva',
  '2026-05-04',
  '2026-05-04T16:00:00', '2026-05-04T17:30:00',
  'lon', 'pi-building', 1, 'both',
  'CONFIRMADO 16:00 May 4. Reserva gratuita en skygarden.london (time-slot obligatorio). Security check estilo aeropuerto en entrada. Piso 35 de 20 Fenchurch Street. Vistas 360° de Londres: Tower Bridge, Shard, St Paul''s, Támesis. Después bajada a cena temprana en la City y vuelta a King''s Cross — dormir temprano para Eurostar 08:01 May 5.',
  51.5114, -0.0836
);

-- ─────────────────────────────────────────────────────────────────────
-- 7. Estadía Londres: anotar zona King's Cross
-- ─────────────────────────────────────────────────────────────────────
UPDATE events
  SET notes = 'Hospedaje zona King''s Cross (por confirmar hotel). Conveniente por: (a) Stansted Express llega a Liverpool St pero se conecta fácil en Tube, (b) St Pancras International = Eurostar sale de ahí May 5 08:01 → caminando al hotel. 3 noches: May 2 → 5.'
  WHERE id = 'ev-stay-auto-lon';
