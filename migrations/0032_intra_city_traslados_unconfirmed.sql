-- 0032_intra_city_traslados_unconfirmed.sql
-- Agrega traslados intra-city no confirmados para Londres, París y Roma.
-- Cubre conexiones metro/tube entre hitos ya cargados (airport→hotel, hito→hito).
-- Todos con confirmed=0 — pendientes de compra o validar horario exacto.
--
-- Cobertura:
--   LONDRES (5 tramos Tube/DLR):
--     May 2: Victoria → King''s Cross (post Gatwick Express)
--     May 4: King''s Cross → Soho (MinaLima) · Soho → Sky Garden ·
--             Sky Garden → ABBA Arena · ABBA Arena → King''s Cross
--   PARÍS (2 tramos Métro):
--     May 5: Gare du Nord → alojamiento
--     May 6: alojamiento → Louvre
--   ROMA (1 tramo ATAC):
--     May 6: Termini → alojamiento

-- ─────────────────────────────────────────────────────────────────────
-- LONDRES — London Underground / DLR
-- ─────────────────────────────────────────────────────────────────────

-- 1. May 2 · Victoria → King''s Cross
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant, notes,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-lon-victoria-kings-cross',
  'traslado', 'metro',
  'lon-tube-victoria-kx-20260502',
  'Tube · Victoria → King''s Cross',
  'London Victoria Station → King''s Cross St. Pancras · Victoria line ~10 min',
  '2026-05-02',
  '2026-05-02T13:20:00+01:00',
  '2026-05-02T13:40:00+01:00',
  'lon', 'lon',
  NULL,
  'pi-map',
  0, 'both',
  'Conexión desde Gatwick Express hasta el alojamiento en King''s Cross. Tube Victoria line ~10 min.',
  51.4952, -0.1441,
  'London Victoria Station',
  51.5321, -0.1235,
  'King''s Cross St. Pancras'
);

INSERT INTO events_traslado (event_id, company, vehicle_code, fare, seat, duration_min, lat_out, lon_out)
VALUES (
  'ev-leg-lon-victoria-kings-cross',
  'Transport for London', 'London Underground / DLR', '£3.10 (peak Z1)',
  NULL, 20,
  51.4952, -0.1441
);

-- ─────────────────────────────────────────────────────────────────────

-- 2. May 4 · King''s Cross → Soho (House of MinaLima)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant, notes,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-lon-kx-minalima',
  'traslado', 'metro',
  'lon-tube-kx-minalima-20260504',
  'Tube · King''s Cross → Soho (MinaLima)',
  'King''s Cross St. Pancras → House of MinaLima (157 Wardour St, Soho) · Piccadilly → Tottenham Court Rd',
  '2026-05-04',
  '2026-05-04T11:00:00+01:00',
  '2026-05-04T11:25:00+01:00',
  'lon', 'lon',
  NULL,
  'pi-map',
  0, 'both',
  'Desde alojamiento hasta House of MinaLima. Tube + caminata ~25 min.',
  51.5321, -0.1235,
  'King''s Cross St. Pancras',
  51.5145, -0.1325,
  'House of MinaLima · 157 Wardour St, Soho'
);

INSERT INTO events_traslado (event_id, company, vehicle_code, fare, seat, duration_min, lat_out, lon_out)
VALUES (
  'ev-leg-lon-kx-minalima',
  'Transport for London', 'London Underground / DLR', '£3.00 (off-peak Z1)',
  NULL, 25,
  51.5321, -0.1235
);

-- ─────────────────────────────────────────────────────────────────────

-- 3. May 4 · Soho → Sky Garden (Fenchurch)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant, notes,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-lon-minalima-skygarden',
  'traslado', 'metro',
  'lon-tube-minalima-skygarden-20260504',
  'Tube · Soho → Sky Garden',
  'House of MinaLima (Soho) → Sky Garden / 20 Fenchurch · Central line → Bank ~15 min',
  '2026-05-04',
  '2026-05-04T15:40:00+01:00',
  '2026-05-04T16:00:00+01:00',
  'lon', 'lon',
  NULL,
  'pi-map',
  0, 'both',
  'Post-almuerzo hacia Sky Garden. Tube ~15 min.',
  51.5145, -0.1325,
  'Tottenham Court Rd (Soho)',
  51.5114, -0.0836,
  'Sky Garden · 20 Fenchurch Street'
);

INSERT INTO events_traslado (event_id, company, vehicle_code, fare, seat, duration_min, lat_out, lon_out)
VALUES (
  'ev-leg-lon-minalima-skygarden',
  'Transport for London', 'London Underground / DLR', '£3.00 (off-peak Z1)',
  NULL, 20,
  51.5145, -0.1325
);

-- ─────────────────────────────────────────────────────────────────────

-- 4. May 4 · Sky Garden → ABBA Arena (Pudding Mill Lane)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant, notes,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-lon-skygarden-abba',
  'traslado', 'metro',
  'lon-tube-skygarden-abba-20260504',
  'Tube · Sky Garden → ABBA Arena',
  'Sky Garden (Bank) → ABBA Arena Pudding Mill Lane · Central line Stratford + DLR ~25-30 min',
  '2026-05-04',
  '2026-05-04T17:45:00+01:00',
  '2026-05-04T18:15:00+01:00',
  'lon', 'lon',
  NULL,
  'pi-map',
  0, 'both',
  'Desde Sky Garden hacia ABBA Voyage. Central line a Stratford + DLR/walk ~25-30 min.',
  51.5114, -0.0836,
  'Sky Garden · 20 Fenchurch Street',
  51.5386, -0.0145,
  'ABBA Arena · Pudding Mill Lane'
);

INSERT INTO events_traslado (event_id, company, vehicle_code, fare, seat, duration_min, lat_out, lon_out)
VALUES (
  'ev-leg-lon-skygarden-abba',
  'Transport for London', 'London Underground / DLR', '£3.60 (off-peak Z1-2)',
  NULL, 30,
  51.5114, -0.0836
);

-- ─────────────────────────────────────────────────────────────────────

-- 5. May 4 · ABBA Arena → King''s Cross (regreso)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant, notes,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-lon-abba-kx',
  'traslado', 'metro',
  'lon-tube-abba-kx-20260504',
  'Tube · ABBA Arena → King''s Cross',
  'ABBA Arena Pudding Mill Lane → King''s Cross St. Pancras · DLR + Tube ~35 min',
  '2026-05-04',
  '2026-05-04T20:30:00+01:00',
  '2026-05-04T21:05:00+01:00',
  'lon', 'lon',
  NULL,
  'pi-map',
  0, 'both',
  'Regreso al alojamiento post ABBA Voyage.',
  51.5386, -0.0145,
  'ABBA Arena · Pudding Mill Lane',
  51.5321, -0.1235,
  'King''s Cross St. Pancras'
);

INSERT INTO events_traslado (event_id, company, vehicle_code, fare, seat, duration_min, lat_out, lon_out)
VALUES (
  'ev-leg-lon-abba-kx',
  'Transport for London', 'London Underground / DLR', '£3.60 (off-peak Z1-2)',
  NULL, 35,
  51.5386, -0.0145
);

-- ─────────────────────────────────────────────────────────────────────
-- PARÍS — Paris Métro
-- ─────────────────────────────────────────────────────────────────────

-- 6. May 5 · Gare du Nord → alojamiento París
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant, notes,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-par-gdn-hotel',
  'traslado', 'metro',
  'par-metro-gdn-hotel-20260505',
  'Métro · Gare du Nord → alojamiento',
  'Gare du Nord → alojamiento París · Métro ticket t+',
  '2026-05-05',
  '2026-05-05T11:30:00+02:00',
  '2026-05-05T11:50:00+02:00',
  'par', 'par',
  NULL,
  'pi-map',
  0, 'both',
  'Llegada Eurostar a Gare du Nord 11:20, transbordo al alojamiento. Métro ticket t+.',
  48.8809, 2.3553,
  'Gare du Nord',
  NULL, NULL,
  'Alojamiento París (TBD)'
);

INSERT INTO events_traslado (event_id, company, vehicle_code, fare, seat, duration_min, lat_out, lon_out)
VALUES (
  'ev-leg-par-gdn-hotel',
  'RATP', 'Paris Métro', 'EUR 2.55 (ticket t+)',
  NULL, 20,
  48.8809, 2.3553
);

-- ─────────────────────────────────────────────────────────────────────

-- 7. May 6 · alojamiento París → Musée du Louvre
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant, notes,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-par-hotel-louvre',
  'traslado', 'metro',
  'par-metro-hotel-louvre-20260506',
  'Métro · alojamiento → Louvre',
  'Alojamiento París → Musée du Louvre · Métro línea 1 Palais Royal–Musée du Louvre',
  '2026-05-06',
  '2026-05-06T09:00:00+02:00',
  '2026-05-06T09:25:00+02:00',
  'par', 'par',
  NULL,
  'pi-map',
  0, 'both',
  'Hacia entrada con horario 09:30. Métro ticket t+.',
  NULL, NULL,
  'Alojamiento París (TBD)',
  48.8606, 2.3376,
  'Musée du Louvre · Palais Royal–Musée du Louvre (M1)'
);

INSERT INTO events_traslado (event_id, company, vehicle_code, fare, seat, duration_min, lat_out, lon_out)
VALUES (
  'ev-leg-par-hotel-louvre',
  'RATP', 'Paris Métro', 'EUR 2.55 (ticket t+)',
  NULL, 25,
  NULL, NULL
);

-- ─────────────────────────────────────────────────────────────────────
-- ROMA — ATAC Roma
-- ─────────────────────────────────────────────────────────────────────

-- 8. May 6 · Termini → alojamiento Roma
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant, notes,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-rom-termini-hotel',
  'traslado', 'metro',
  'rom-atac-termini-hotel-20260506',
  'Metro/Bus · Termini → alojamiento Roma',
  'Roma Termini → alojamiento Roma · ATAC BIT 100 min',
  '2026-05-06',
  '2026-05-06T20:05:00+02:00',
  '2026-05-06T20:25:00+02:00',
  'rom', 'rom',
  NULL,
  'pi-map',
  0, 'both',
  'Tras Leonardo Express (llegada Termini 20:02), BIT 100 min hacia alojamiento. Tarifa vigente Apr 2026 (sube a €2.00 desde Jul 1).',
  41.9010, 12.5018,
  'Roma Termini',
  NULL, NULL,
  'Alojamiento Roma (TBD)'
);

INSERT INTO events_traslado (event_id, company, vehicle_code, fare, seat, duration_min, lat_out, lon_out)
VALUES (
  'ev-leg-rom-termini-hotel',
  'ATAC Roma', 'ATAC Roma', 'EUR 1.50 (BIT 100 min)',
  NULL, 20,
  41.9010, 12.5018
);
