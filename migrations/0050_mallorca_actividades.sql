-- 0050_mallorca_actividades.sql
-- Actividades Mallorca (PMI) Apr 28 – May 1, 2026.
--
-- Eventos insertados:
--   1. ev-pmi-apr28-playa          Playa de Peguera                Apr 28 16:00–19:00
--   2. ev-pmi-apr29-valldemossa    Valldemossa                     Apr 29 10:30–12:30
--   3. ev-pmi-apr29-saforadada     Mirador de Sa Foradada          Apr 29 13:00–14:30
--   4. ev-pmi-apr29-deia           Deià                            Apr 29 15:30–17:00
--   5. ev-pmi-apr30-estrenc        Playa Es Trenc                  Apr 30 10:00–14:00
--   6. ev-pmi-apr30-coloniastjordi Colònia de Sant Jordi           Apr 30 14:30–17:00
--   7. ev-pmi-may01-catedral       Catedral de Palma (La Seu)      May 1  10:00–11:00
--   8. ev-pmi-may01-calatrava      Barrio de La Calatrava          May 1  11:00–13:00
--   9. ev-pmi-may01-paseo          Paseo Marítimo de Palma         May 1  17:00–19:30
--
-- Todos confirmed=0. Costo zero salvo parking Es Trenc y comida Colònia.
-- No se inserta en días; eventos registrados directamente en `events`.

-- ─────────────────────────────────────────────────────────────────────
-- 1. Hito · Playa de Peguera  (Apr 28)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-pmi-apr28-playa',
  'hito', 'leisure',
  'pmi-playa-peguera-20260428',
  'Playa de Peguera',
  'Primera tarde en Mallorca. Playa de arena a 5 min caminando del apartamento. Entrada libre, aguas tranquilas del mediterráneo.',
  '2026-04-28',
  '2026-04-28T16:00:00+02:00',
  '2026-04-28T19:00:00+02:00',
  'pmi',
  0.00,
  'pi pi-sun',
  0, 'both',
  39.5377, 2.4470
);

-- ─────────────────────────────────────────────────────────────────────
-- 2. Hito · Valldemossa  (Apr 29)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-pmi-apr29-valldemossa',
  'hito', 'leisure',
  'pmi-valldemossa-20260429',
  'Valldemossa',
  'Pueblo medieval en la Serra de Tramuntana, Patrimonio UNESCO. Calles de piedra, plantas y flores. Paseo libre gratuito. Celda de Chopin €12/persona (opcional).',
  '2026-04-29',
  '2026-04-29T10:30:00+02:00',
  '2026-04-29T12:30:00+02:00',
  'pmi',
  0.00,
  'pi pi-map-marker',
  0, 'both',
  39.7125, 2.6228
);

-- ─────────────────────────────────────────────────────────────────────
-- 3. Hito · Mirador de Sa Foradada  (Apr 29)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-pmi-apr29-saforadada',
  'hito', 'leisure',
  'pmi-saforadada-20260429',
  'Mirador de Sa Foradada',
  'Acantilado rocoso con agujero natural sobre el mar. Vistas espectaculares de la Serra de Tramuntana. Gratuito. Parking en Son Marroig (~2km a pie al mirador).',
  '2026-04-29',
  '2026-04-29T13:00:00+02:00',
  '2026-04-29T14:30:00+02:00',
  'pmi',
  0.00,
  'pi pi-eye',
  0, 'both',
  39.7394, 2.5672
);

-- ─────────────────────────────────────────────────────────────────────
-- 4. Hito · Deià  (Apr 29)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-pmi-apr29-deia',
  'hito', 'leisure',
  'pmi-deia-20260429',
  'Deià',
  'Pintoresco pueblo de artistas en la sierra. Casas de piedra entre olivos y montañas. Paseo libre gratuito. Robert Graves vivió aquí.',
  '2026-04-29',
  '2026-04-29T15:30:00+02:00',
  '2026-04-29T17:00:00+02:00',
  'pmi',
  0.00,
  'pi pi-home',
  0, 'both',
  39.7486, 2.6481
);

-- ─────────────────────────────────────────────────────────────────────
-- 5. Hito · Playa Es Trenc  (Apr 30)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-pmi-apr30-estrenc',
  'hito', 'leisure',
  'pmi-estrenc-20260430',
  'Playa Es Trenc',
  'La mejor playa natural de Mallorca — arena blanca, aguas turquesas, sin urbanización. 45 min en auto desde Peguera. Entrada libre. Llevar picnic. Parking ~€6.',
  '2026-04-30',
  '2026-04-30T10:00:00+02:00',
  '2026-04-30T14:00:00+02:00',
  'pmi',
  6.53,
  'pi pi-sun',
  0, 'both',
  39.3474, 3.0197
);

-- ─────────────────────────────────────────────────────────────────────
-- 6. Hito · Colònia de Sant Jordi  (Apr 30)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-pmi-apr30-coloniastjordi',
  'hito', 'leisure',
  'pmi-coloniastjordi-20260430',
  'Colònia de Sant Jordi',
  'Pueblo pesquero tranquilo junto a Es Trenc. Paseo por el puerto, tapas en la plaza. €15-20/persona comida.',
  '2026-04-30',
  '2026-04-30T14:30:00+02:00',
  '2026-04-30T17:00:00+02:00',
  'pmi',
  43.48,
  'pi pi-star',
  0, 'both',
  39.3293, 3.0112
);

-- ─────────────────────────────────────────────────────────────────────
-- 7. Hito · Catedral de Palma (La Seu)  (May 1)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-pmi-may01-catedral',
  'hito', 'leisure',
  'pmi-catedral-20260501',
  'Catedral de Palma (La Seu)',
  'Catedral gótica medieval con vistas al mar. Exterior gratuito — la fachada e interior de la entrada de las rosas visible sin pagar. Interior €10/persona (opcional).',
  '2026-05-01',
  '2026-05-01T10:00:00+02:00',
  '2026-05-01T11:00:00+02:00',
  'pmi',
  0.00,
  'pi pi-map-marker',
  0, 'both',
  39.5677, 2.6485
);

-- ─────────────────────────────────────────────────────────────────────
-- 8. Hito · Barrio de La Calatrava  (May 1)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-pmi-may01-calatrava',
  'hito', 'leisure',
  'pmi-calatrava-20260501',
  'Barrio de La Calatrava',
  'Barrio antiguo de Palma junto a la catedral. Callejuelas, palacios árabes, la Almudaina. Paseo libre y gratuito. Ambiente auténtico.',
  '2026-05-01',
  '2026-05-01T11:00:00+02:00',
  '2026-05-01T13:00:00+02:00',
  'pmi',
  0.00,
  'pi pi-map',
  0, 'both',
  39.5686, 2.6492
);

-- ─────────────────────────────────────────────────────────────────────
-- 9. Hito · Paseo Marítimo de Palma  (May 1)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-pmi-may01-paseo',
  'hito', 'leisure',
  'pmi-paseo-maritimo-20260501',
  'Paseo Marítimo de Palma',
  'Última tarde en Mallorca — paseo a pie o en bici por el malecón con vistas al Mediterráneo. Gratuito.',
  '2026-05-01',
  '2026-05-01T17:00:00+02:00',
  '2026-05-01T19:30:00+02:00',
  'pmi',
  0.00,
  'pi pi-heart',
  0, 'both',
  39.5600, 2.6400
);
