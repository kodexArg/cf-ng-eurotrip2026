-- 0042_transportes_perfeccionados.sql
-- Perfecciona traslados PENDIENTES (confirmed=0) con coordenadas precisas,
-- precios reales investigados y marca como confirmed los de bajo costo intra-city.
--
-- Tasas aplicadas: £1 = USD 1.27 · €1 = USD 1.087
-- REGLA: NO se tocan eventos confirmed=1 existentes.
--
-- Bloques:
--   A. Bus TIB A11 · PMI → Peguera         (ev-leg-pmi-peguera)        ⚡ confirmed=1
--   B. Stansted Express · STN → Liverpool St (ev-leg-stn-lon)            ⚡ confirmed=1
--   C. London Tube (5 tramos)               (ev-leg-lon-victoria-kings-cross,
--                                            ev-leg-lon-kx-minalima,
--                                            ev-leg-lon-minalima-skygarden,
--                                            ev-leg-lon-skygarden-abba,
--                                            ev-leg-lon-abba-kx)         ⚡ todos confirmed=1
--   D. París Métro (2 tramos)               (ev-leg-par-gdn-hotel,
--                                            ev-leg-par-hotel-louvre)    ⚡ todos confirmed=1
--   E. Roma · Leonardo Express + ATAC       (ev-leg-leo-express,
--                                            ev-leg-rom-termini-hotel)   ⚡ todos confirmed=1

-- ============================================================
-- A. Bus TIB A11 · Aeropuerto PMI → Peguera
-- ============================================================
-- Precio real con tarjeta contactless: €4.05 pp × 2 pax = €8.10 → USD 8.81
-- Fuente: TIB (Transport Illes Balears) tarifa A11 Apr 2026
-- Agrega origin_label y destination_label (columnas añadidas en 0020, faltaban en INSERT 0024)

UPDATE events
  SET usd               = 8.81,
      confirmed         = 1,
      origin_label      = 'Aeropuerto de Palma',
      destination_label = 'Peguera, Calvià',
      origin_lat        = 39.5517,
      origin_lon        = 2.7388,
      destination_lat   = 39.53776,
      destination_lon   = 2.44812
  WHERE id = 'ev-leg-pmi-peguera';

-- ============================================================
-- B. Stansted Express · STN → London Liverpool Street
-- ============================================================
-- Precio advance booking: £20.70 pp × 2 pax = £41.40 → USD 52.58
-- Fuente: stanstedexpress.com · tarifa Advance single
-- Coords ya precisas desde 0020 (STN 51.8860,0.2389 / Liverpool St 51.5180,-0.0817)
-- Agrega origin_label y destination_label (faltaban — 0020 ya las actualizó en esta fila)

UPDATE events
  SET usd               = 52.58,
      confirmed         = 1,
      origin_label      = 'London Stansted Airport',
      destination_label = 'London Liverpool Street',
      origin_lat        = 51.8860,
      origin_lon        = 0.2389,
      destination_lat   = 51.5180,
      destination_lon   = -0.0817
  WHERE id = 'ev-leg-stn-lon';

-- ============================================================
-- C. London Underground / Tube — 5 tramos
-- ============================================================

-- C1. May 2 · Victoria → King's Cross
-- £3.10 pp peak Z1 × 2 pax = £6.20 → USD 7.87
-- Fuente: TfL fares 2026 · zona peak Z1

UPDATE events
  SET usd               = 7.87,
      confirmed         = 1,
      origin_lat        = 51.4952,
      origin_lon        = -0.1441,
      origin_label      = 'London Victoria Station',
      destination_lat   = 51.5321,
      destination_lon   = -0.1235,
      destination_label = 'King''s Cross St. Pancras'
  WHERE id = 'ev-leg-lon-victoria-kings-cross';

-- C2. May 4 · King's Cross → Tottenham Court Rd (MinaLima / Soho)
-- £3.00 pp × 2 pax = £6.00 → USD 7.62
-- Fuente: TfL fares 2026 · Z1

UPDATE events
  SET usd               = 7.62,
      confirmed         = 1,
      origin_lat        = 51.5321,
      origin_lon        = -0.1235,
      origin_label      = 'King''s Cross St. Pancras',
      destination_lat   = 51.5165,
      destination_lon   = -0.1310,
      destination_label = 'Tottenham Court Road'
  WHERE id = 'ev-leg-lon-kx-minalima';

-- C3. May 4 · Tottenham Court Rd (Soho/MinaLima) → Monument (Sky Garden)
-- £3.00 pp × 2 pax = £6.00 → USD 7.62
-- Fuente: TfL fares 2026 · Z1

UPDATE events
  SET usd               = 7.62,
      confirmed         = 1,
      origin_lat        = 51.5165,
      origin_lon        = -0.1310,
      origin_label      = 'Tottenham Court Road (Soho)',
      destination_lat   = 51.5101,
      destination_lon   = -0.0855,
      destination_label = 'Monument (Sky Garden)'
  WHERE id = 'ev-leg-lon-minalima-skygarden';

-- C4. May 4 · Monument (Sky Garden) → Pudding Mill Lane (ABBA Arena)
-- £3.60 pp × 2 pax = £7.20 → USD 9.14
-- Fuente: TfL fares 2026 · Z1-2

UPDATE events
  SET usd               = 9.14,
      confirmed         = 1,
      origin_lat        = 51.5101,
      origin_lon        = -0.0855,
      origin_label      = 'Monument (Sky Garden)',
      destination_lat   = 51.5343,
      destination_lon   = -0.0136,
      destination_label = 'Pudding Mill Lane (ABBA Arena)'
  WHERE id = 'ev-leg-lon-skygarden-abba';

-- C5. May 4 · Pudding Mill Lane (ABBA Arena) → King's Cross (regreso)
-- £3.60 pp × 2 pax = £7.20 → USD 9.14
-- Fuente: TfL fares 2026 · Z1-2

UPDATE events
  SET usd               = 9.14,
      confirmed         = 1,
      origin_lat        = 51.5343,
      origin_lon        = -0.0136,
      origin_label      = 'Pudding Mill Lane (ABBA Arena)',
      destination_lat   = 51.5321,
      destination_lon   = -0.1235,
      destination_label = 'King''s Cross St. Pancras'
  WHERE id = 'ev-leg-lon-abba-kx';

-- ============================================================
-- D. París Métro — 2 tramos
-- ============================================================

-- D1. May 5 · Gare du Nord → Le Marais (Saint-Paul)
-- €2.55 pp × 2 pax = €5.10 → USD 5.54
-- Fuente: RATP tarifa ticket t+ 2026
-- destination_lat/lon era NULL en 0032 — se completa aquí con Saint-Paul (Le Marais)

UPDATE events
  SET usd               = 5.54,
      confirmed         = 1,
      origin_lat        = 48.8809,
      origin_lon        = 2.3553,
      origin_label      = 'Gare du Nord',
      destination_lat   = 48.8552,
      destination_lon   = 2.3614,
      destination_label = 'Le Marais (Saint-Paul)'
  WHERE id = 'ev-leg-par-gdn-hotel';

-- D2. May 6 · Le Marais (Saint-Paul) → Louvre (Pyramides)
-- €2.55 pp × 2 pax = €5.10 → USD 5.54
-- Fuente: RATP tarifa ticket t+ 2026
-- origin_lat/lon era NULL en 0032 — se completa aquí con Saint-Paul

UPDATE events
  SET usd               = 5.54,
      confirmed         = 1,
      origin_lat        = 48.8552,
      origin_lon        = 2.3614,
      origin_label      = 'Le Marais (Saint-Paul)',
      destination_lat   = 48.8638,
      destination_lon   = 2.3362,
      destination_label = 'Louvre (Pyramides)'
  WHERE id = 'ev-leg-par-hotel-louvre';

-- ============================================================
-- E. Roma — Leonardo Express + ATAC
-- ============================================================

-- E1. Leonardo Express · FCO → Roma Termini
-- Precio real: €17.90 pp × 2 pax = €35.80 → USD 38.91
-- (era €14 pp en 0027 — actualización de tarifa Trenitalia 2026)
-- Fuente: Trenitalia / Leonardo Express tarifa vigente
-- Coords ya correctas desde 0027. Marca confirmed=1.

UPDATE events
  SET usd       = 38.91,
      confirmed = 1
  WHERE id = 'ev-leg-leo-express';

-- E2. ATAC Roma · Termini → Cerca del Coliseo
-- €1.50 pp × 2 pax = €3.00 → USD 3.26
-- Fuente: ATAC Roma tarifa BIT 100 min (vigente hasta Jun 2026)
-- destination_lat/lon era NULL en 0032 — se completa con coords cerca del Coliseo

UPDATE events
  SET usd               = 3.26,
      confirmed         = 1,
      origin_lat        = 41.9010,
      origin_lon        = 12.5018,
      origin_label      = 'Roma Termini',
      destination_lat   = 41.8902,
      destination_lon   = 12.4922,
      destination_label = 'Cerca del Coliseo'
  WHERE id = 'ev-leg-rom-termini-hotel';
