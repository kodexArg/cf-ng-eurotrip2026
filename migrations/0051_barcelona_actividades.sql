-- 0051_barcelona_actividades.sql
-- Barcelona Apr 24-28: actualiza ciudad y añade actividades Apr 24-25.
--
-- Cambios:
--   1. UPDATE cities: departure='2026-04-28', nights=4 (vuelo BCN→PMI Apr 28)
--
--   2. INSERT 6 hitos en tabla events:
--      Apr 24:
--        - ev-bcn-apr24-gothic        Barrio Gótico a pie         14:00-17:00
--        - ev-bcn-apr24-born-bici     El Born + Arc de Triomf     17:30-19:30
--        - ev-bcn-apr24-raval         Noche en El Raval            21:00-01:00
--      Apr 25:
--        - ev-bcn-apr25-gaudi-bici    Sagrada Família + Park Güell 10:00-14:00
--        - ev-bcn-apr25-barceloneta   Barceloneta en bici          15:00-18:00
--        - ev-bcn-apr25-born-noche    Noche en El Born             21:00-00:00

-- ─────────────────────────────────────────────────────────────────────
-- PART 1: Actualizar ciudad Barcelona
-- ─────────────────────────────────────────────────────────────────────
UPDATE cities SET departure = '2026-04-28', nights = 4 WHERE id = 'bcn';

-- ─────────────────────────────────────────────────────────────────────
-- Apr 24 · Hito 1: Barrio Gótico a pie
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-bcn-apr24-gothic',
  'hito', 'leisure',
  'bcn-gothic-a-pie-20260424',
  'Barrio Gótico a pie',
  'Primer recorrido por el corazón medieval de Barcelona. Catedral, Plaça Sant Jaume, callejuelas del Call. Completamente gratuito.',
  '2026-04-24',
  '2026-04-24T14:00:00+02:00',
  '2026-04-24T17:00:00+02:00',
  'bcn',
  0.00, 'pi-map', 0, 'both',
  41.3831, 2.1761
);

-- ─────────────────────────────────────────────────────────────────────
-- Apr 24 · Hito 2: El Born + Arc de Triomf en bici
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-bcn-apr24-born-bici',
  'hito', 'leisure',
  'bcn-born-arc-bici-20260424',
  'El Born + Arc de Triomf en bici',
  'Barrio El Born (tiendas vintage, Mercat de Santa Caterina) → Arc de Triomf → Parc de la Ciutadella. Alquiler bici ~€12/día/persona.',
  '2026-04-24',
  '2026-04-24T17:30:00+02:00',
  '2026-04-24T19:30:00+02:00',
  'bcn',
  26.09, 'pi-heart', 0, 'both',
  41.3852, 2.1819
);

-- ─────────────────────────────────────────────────────────────────────
-- Apr 24 · Hito 3: Noche en El Raval
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-bcn-apr24-raval',
  'hito', 'bar',
  'bcn-raval-noche-20260424',
  'Noche en El Raval',
  'Carrer de Joaquín Costa — bares locales sin pretensiones, cervezas desde €2-3. La zona más económica de Barcelona para salir. Sin cover.',
  '2026-04-24',
  '2026-04-24T21:00:00+02:00',
  '2026-04-25T01:00:00+02:00',
  'bcn',
  32.61, 'pi-star', 0, 'both',
  41.3805, 2.1673
);

-- ─────────────────────────────────────────────────────────────────────
-- Apr 25 · Hito 4: Sagrada Família + Park Güell en bici
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-bcn-apr25-gaudi-bici',
  'hito', 'tour',
  'bcn-gaudi-bici-20260425',
  'Sagrada Família + Park Güell en bici',
  'Exterior Sagrada Família (gratis, imponente) → subida en bici a Park Güell zona pública (gratis) con vistas panorámicas de Barcelona. Interior Park Güell €10/persona (opcional).',
  '2026-04-25',
  '2026-04-25T10:00:00+02:00',
  '2026-04-25T14:00:00+02:00',
  'bcn',
  0.00, 'pi-map', 0, 'both',
  41.4036, 2.1744
);

-- ─────────────────────────────────────────────────────────────────────
-- Apr 25 · Hito 5: Barceloneta en bici
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-bcn-apr25-barceloneta',
  'hito', 'leisure',
  'bcn-barceloneta-bici-20260425',
  'Barceloneta en bici',
  'Ruta costera desde el Port Olímpic hasta Barceloneta — 8km de carril bici junto al mar. Playa, terrazas, ambiente playero. Completamente gratuito.',
  '2026-04-25',
  '2026-04-25T15:00:00+02:00',
  '2026-04-25T18:00:00+02:00',
  'bcn',
  0.00, 'pi-sun', 0, 'both',
  41.3790, 2.1900
);

-- ─────────────────────────────────────────────────────────────────────
-- Apr 25 · Hito 6: Noche en El Born
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-bcn-apr25-born-noche',
  'hito', 'bar',
  'bcn-born-noche-20260425',
  'Noche en El Born',
  'Bares en el barrio más cool de Barcelona — más tranquilo y con ambiente local que el centro. Cócteles artesanales €8-10. Sin cover en los bares de barrio.',
  '2026-04-25',
  '2026-04-25T21:00:00+02:00',
  '2026-04-26T00:00:00+02:00',
  'bcn',
  43.48, 'pi-star', 0, 'both',
  41.3852, 2.1819
);
