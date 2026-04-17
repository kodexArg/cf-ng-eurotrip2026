-- 0064_madrid_apr21_aniversario_opciones.sql
-- Día del aniversario 30 en Madrid (martes 21 abr 2026).
--
-- Contexto:
--   - ev-mad-apr21-aniversario (Bodega de los Secretos) YA EXISTE — es la Opción B.
--     No se toca: cena romántica en Barrio de las Letras (migration 0046).
--   - Se agregan actividades del día + 5 opciones de noche (A, C, D, E, F).
--     El usuario elegirá después cuál reservar. Todas confirmed=0.
--
-- Actividades del día:
--   - Retiro · barca en el lago (10:00–11:30)
--   - Antón Martín · almuerzo (13:00–14:00)
--   - Matadero Madrid · expo PULGAR de Mónica Mays, GRATIS (15:00–17:00)
--
-- Opciones de noche (separadas como hitos distintos):
--   A. Café Central · Patxi Pascual Quinteto — jazz vivo + cena, match 100%.
--   (B. Bodega de los Secretos — YA EXISTE, no se toca.)
--   C. Recoletos Jazz · jam New Orleans — la más económica con jazz vivo.
--   D. Rooftop Círculo BBAA (sunset) + Café Central — sunset + jazz.
--   E. Hammam Al Ándalus + cena tapas — lujo sensorial puntual, sin música.
--   F. Hammam tarde + Café Central show tardío — premium sensorial+jazz.

-- ─────────────────────────────────────────────────────────────────────
-- 1. Hito · Retiro · barca en el lago
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr21-retiro-barca',
  'hito', 'leisure',
  'mad-retiro-barca-20260421',
  'Parque del Retiro · barca en el lago',
  'Alquiler barca 45 min €6 (lunes-viernes). Estanque con Monumento Alfonso XII. ~€12 pareja.',
  '2026-04-21',
  '2026-04-21T10:00:00+02:00',
  '2026-04-21T11:30:00+02:00',
  'mad',
  13.05, 'pi pi-heart', 0, 'both',
  40.4172, -3.6825
);

-- ─────────────────────────────────────────────────────────────────────
-- 2. Hito · Mercado Antón Martín · almuerzo
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr21-antonmartin-lunch',
  'hito', 'food',
  'mad-antonmartin-lunch-20260421',
  'Mercado Antón Martín · almuerzo',
  'Mercado tradicional en Lavapiés. Tapas, jamón, cerveza. ~€25 pareja.',
  '2026-04-21',
  '2026-04-21T13:00:00+02:00',
  '2026-04-21T14:00:00+02:00',
  'mad',
  27.18, 'pi pi-shop', 0, 'both',
  40.4110, -3.6990
);

-- ─────────────────────────────────────────────────────────────────────
-- 3. Hito · Matadero Madrid · expo PULGAR (Mónica Mays), GRATIS
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr21-matadero',
  'hito', 'arte',
  'mad-matadero-pulgar-20260421',
  'Matadero Madrid · exposición PULGAR',
  'Mónica Mays — site-specific, escultura/archivo/memoria. GRATIS. Vigente 26 feb–24 may.',
  '2026-04-21',
  '2026-04-21T15:00:00+02:00',
  '2026-04-21T17:00:00+02:00',
  'mad',
  0.00, 'pi pi-image', 0, 'both',
  40.3926, -3.6987
);

-- ─────────────────────────────────────────────────────────────────────
-- 4. Opción A · Café Central · Patxi Pascual Quinteto
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr21-opt-a-cafecentral',
  'hito', 'music',
  'mad-opt-a-cafecentral-20260421',
  'Opción A · Café Central · Patxi Pascual Quinteto',
  'Jazz en vivo con cena (sax+voz María Zerpa). Café Central en nueva sede Ateneo. ~€96 pareja (entrada €18 pp + cena tapas €22 pp + bebida €8 pp). Match perfil 100%.',
  '2026-04-21',
  '2026-04-21T20:00:00+02:00',
  '2026-04-21T23:00:00+02:00',
  'mad',
  104.40, 'pi pi-volume-up', 0, 'both',
  40.4147, -3.6988
);

-- ─────────────────────────────────────────────────────────────────────
-- 5. Opción C · Recoletos Jazz · jam New Orleans
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr21-opt-c-recoletos',
  'hito', 'music',
  'mad-opt-c-recoletos-20260421',
  'Opción C · Recoletos Jazz · jam New Orleans',
  'Jam session martes (informal). Cena en venue. ~€66-86 pareja. La más económica con jazz vivo.',
  '2026-04-21',
  '2026-04-21T20:30:00+02:00',
  '2026-04-21T23:00:00+02:00',
  'mad',
  82.61, 'pi pi-volume-up', 0, 'both',
  40.4270, -3.6924
);

-- ─────────────────────────────────────────────────────────────────────
-- 6. Opción D · Rooftop Círculo BBAA (sunset) + Café Central
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr21-opt-d-rooftop-cafecentral',
  'hito', 'music',
  'mad-opt-d-rooftop-cafecentral-20260421',
  'Opción D · Rooftop Círculo BBAA (sunset) + Café Central',
  'Rooftop 360° Madrid al atardecer €5 pp + caminata 10 min a Café Central show Opción A. ~€106 pareja.',
  '2026-04-21',
  '2026-04-21T19:30:00+02:00',
  '2026-04-21T23:30:00+02:00',
  'mad',
  115.26, 'pi pi-sun', 0, 'both',
  40.4193, -3.6963
);

-- ─────────────────────────────────────────────────────────────────────
-- 7. Opción E · Hammam Al Ándalus + cena tapas
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr21-opt-e-hammam',
  'hito', 'spa',
  'mad-opt-e-hammam-20260421',
  'Opción E · Hammam Al Ándalus + cena tapas',
  'Baño árabe 90 min pareja (€45 pp × 2 = €90) + cena simple Antón Martín. ~€152 pareja. Lujo sensorial puntual, sin música.',
  '2026-04-21',
  '2026-04-21T19:00:00+02:00',
  '2026-04-21T22:30:00+02:00',
  'mad',
  165.24, 'pi pi-heart', 0, 'both',
  40.4115, -3.7063
);

-- ─────────────────────────────────────────────────────────────────────
-- 8. Opción F · Hammam tarde + Café Central show tardío
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr21-opt-f-hammam-jazz',
  'hito', 'spa',
  'mad-opt-f-hammam-jazz-20260421',
  'Opción F · Hammam tarde + Café Central show tardío',
  'Hammam 17:00 + tapas mediodía + Café Central 22:00 solo show. ~€172 pareja. Premium sensorial+jazz.',
  '2026-04-21',
  '2026-04-21T17:00:00+02:00',
  '2026-04-22T00:30:00+02:00',
  'mad',
  187.00, 'pi pi-star', 0, 'both',
  40.4115, -3.7063
);
