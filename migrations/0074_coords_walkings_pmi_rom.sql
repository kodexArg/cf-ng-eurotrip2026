-- migrations/0074_coords_walkings_pmi_rom.sql
-- =============================================================================
-- Wave 4: coords reales PMI/LON/PAR/ROM/MAD + walkings entre hitos
-- =============================================================================
-- SCOPE: only confirmed=0 events between 2026-04-28 and 2026-05-10.
-- NEVER touches confirmed=1 rows (guarded with AND confirmed=0 on every UPDATE).
-- NEVER touches type='estadia' except NULL-coord fix for Paris Airbnb.
--
-- AUDIT (pre-migration, hitos confirmed=0 on window):
--   75 total hitos confirmed=0.
--   39 of those had generic city-center coords (Palma 39.5696,2.6502 /
--   Rome 41.9028,12.4964 / Madrid 40.4168,-3.7038) or NULL.
--   Confirmed hitos in window: 3 (Stonehenge, Sky Garden, Louvre) — NOT touched.
--
-- SECTION 1 · coord updates (39 hitos + 1 Paris estadia)
--
-- | id                              | title                             | new lat,lon       |
-- |---------------------------------|-----------------------------------|-------------------|
-- | ev-pmi-apr28-pm                 | Casco Antiguo · La Seu            | 39.5667,2.6497    |
-- | ev-pmi-apr28-ev                 | La Lonja                          | 39.5659,2.6464    |
-- | ev-pmi-apr28-rec-celler         | La Lonja · celler                 | 39.5659,2.6464    |
-- | ev-pmi-apr28-rec-tapas          | La Lonja · tapas                  | 39.5659,2.6464    |
-- | ev-pmi-apr29-am                 | Catedral La Seu                   | 39.5667,2.6497    |
-- | ev-pmi-apr29-rec-mercado        | Mercat Santa Catalina             | 39.5725,2.6390    |
-- | ev-pmi-apr29-pm                 | Santa Catalina                    | 39.5725,2.6390    |
-- | ev-pmi-apr29-rec-cafe-catedral  | Cafe Catedral                     | 39.5667,2.6497    |
-- | ev-pmi-apr29-ev                 | Paseo del Borne                   | 39.5722,2.6506    |
-- | ev-pmi-apr29-rec-rooftop        | Paseo del Borne · rooftop         | 39.5722,2.6506    |
-- | ev-pmi-apr30-am                 | Valldemossa                       | 39.7117,2.6225    |
-- | ev-pmi-apr30-rec-capas          | Valldemossa · Serra Tramuntana    | 39.7117,2.6225    |
-- | ev-pmi-apr30-pm                 | Valldemossa                       | 39.7117,2.6225    |
-- | ev-pmi-apr30-rec-deia           | Deià                              | 39.7481,2.6481    |
-- | ev-pmi-apr30-rec-soller-mirador | Serra Tramuntana (Soller)         | 39.7833,2.6833    |
-- | ev-pmi-apr30-ev                 | Palma · Borne                     | 39.5722,2.6506    |
-- | ev-pmi-may01-am                 | Sóller                            | 39.7652,2.7150    |
-- | ev-pmi-may01-rec-naranjas       | Sóller · naranjas                 | 39.7652,2.7150    |
-- | ev-pmi-may01-pm                 | Port de Sóller                    | 39.7982,2.6925    |
-- | ev-pmi-may01-rec-kayak          | Port de Sóller · kayak            | 39.7982,2.6925    |
-- | ev-pmi-may01-rec-uv-snack       | Port de Sóller · snack            | 39.7982,2.6925    |
-- | ev-pmi-may01-ev                 | Palma · Borne                     | 39.5722,2.6506    |
-- | ev-rom-may06-am                 | Colosseo                          | 41.8902,12.4922   |
-- | ev-rom-may06-pm                 | Rione Monti                       | 41.8956,12.4908   |
-- | ev-rom-may06-ev                 | Roma · Colosseo noche             | 41.8902,12.4922   |
-- | ev-rom-may07-am                 | Musei Vaticani                    | 41.9064,12.4534   |
-- | ev-rom-may07-pm                 | San Pietro · Prati                | 41.9022,12.4539   |
-- | ev-rom-may07-ev                 | Trastevere                        | 41.8892,12.4697   |
-- | ev-rom-may08-am                 | Galleria Borghese                 | 41.9142,12.4925   |
-- | ev-rom-may08-pm                 | Villa Borghese                    | 41.9139,12.4920   |
-- | ev-rom-may08-ev                 | Roma · Centro (Pantheon)          | 41.8986,12.4769   |
-- | ev-rom-may09-am                 | Roma · Colosseo                   | 41.8902,12.4922   |
-- | ev-rom-may09-pm                 | FCO · Fiumicino                   | 41.8003,12.2389   |
-- | ev-mad-may09-noche-regreso-t4   | MAD Barajas T4                    | 40.4939,-3.5666   |
-- | ev-mad-may09-noche-llegada      | MAD Barajas T4                    | 40.4939,-3.5666   |
-- | ev-mad-may09-noche-cena         | Cena Madrid · Plaza Mayor         | 40.4152,-3.7074   |
-- | ev-mad-may09-noche-plaza-mayor  | Plaza Mayor                       | 40.4152,-3.7074   |
-- | ev-mad-may09-noche-la-latina    | La Latina                         | 40.4112,-3.7106   |
-- | ev-mad-may09-noche-gran-via     | Gran Vía                          | 40.4200,-3.7058   |
-- | ev-stay-auto-par (ESTADIA)      | Alojamiento París · Le Marais     | 48.8552,2.3614    |
--
-- SECTION 2 · walkings insertados (subtype='walking', icon='pi pi-map-marker')
--
-- | id                             | date       | origin → destination                          | km   | min |
-- |--------------------------------|------------|-----------------------------------------------|------|-----|
-- | ev-leg-pmi-may01-walk-1        | 2026-05-01 | Paseo Marítimo → Cena · La Calatrava          | 1.45 | 17  |
-- | ev-leg-lon-may02-walk-1        | 2026-05-02 | Almuerzo City Tour → Denmark Street Soho      | 0.91 | 11  |
-- | ev-leg-rom-may07-walk-1        | 2026-05-07 | Almuerzo Prati → San Pietro                   | 0.65 | 8   |
--
-- Walking candidates were evaluated conservatively:
-- - Most hitos confirmed=0 lack timestamp_out (single-instant events).
-- - Many same-hour rows are recommendation alternatives (3 events @ 20:00),
--   walking between them would be incorrect.
-- - Many sequential pairs exceed 1.8 km (car/transit distance, not walkable).
-- - Only pairs with both timestamps, distance 0.4-1.8 km, and sequential flow
--   were inserted.
-- =============================================================================

-- -------------------------------------------------------------------------
-- SECTION 1 · coord updates (all guarded with confirmed=0)
-- -------------------------------------------------------------------------

-- PMI Apr 28
UPDATE events SET lat=39.5667, lon=2.6497 WHERE id='ev-pmi-apr28-pm' AND confirmed=0;
UPDATE events SET lat=39.5659, lon=2.6464 WHERE id='ev-pmi-apr28-ev' AND confirmed=0;
UPDATE events SET lat=39.5659, lon=2.6464 WHERE id='ev-pmi-apr28-rec-celler' AND confirmed=0;
UPDATE events SET lat=39.5659, lon=2.6464 WHERE id='ev-pmi-apr28-rec-tapas' AND confirmed=0;

-- PMI Apr 29
UPDATE events SET lat=39.5667, lon=2.6497 WHERE id='ev-pmi-apr29-am' AND confirmed=0;
UPDATE events SET lat=39.5725, lon=2.6390 WHERE id='ev-pmi-apr29-rec-mercado' AND confirmed=0;
UPDATE events SET lat=39.5725, lon=2.6390 WHERE id='ev-pmi-apr29-pm' AND confirmed=0;
UPDATE events SET lat=39.5667, lon=2.6497 WHERE id='ev-pmi-apr29-rec-cafe-catedral' AND confirmed=0;
UPDATE events SET lat=39.5722, lon=2.6506 WHERE id='ev-pmi-apr29-ev' AND confirmed=0;
UPDATE events SET lat=39.5722, lon=2.6506 WHERE id='ev-pmi-apr29-rec-rooftop' AND confirmed=0;

-- PMI Apr 30
UPDATE events SET lat=39.7117, lon=2.6225 WHERE id='ev-pmi-apr30-am' AND confirmed=0;
UPDATE events SET lat=39.7117, lon=2.6225 WHERE id='ev-pmi-apr30-rec-capas' AND confirmed=0;
UPDATE events SET lat=39.7117, lon=2.6225 WHERE id='ev-pmi-apr30-pm' AND confirmed=0;
UPDATE events SET lat=39.7481, lon=2.6481 WHERE id='ev-pmi-apr30-rec-deia' AND confirmed=0;
UPDATE events SET lat=39.7833, lon=2.6833 WHERE id='ev-pmi-apr30-rec-soller-mirador' AND confirmed=0;
UPDATE events SET lat=39.5722, lon=2.6506 WHERE id='ev-pmi-apr30-ev' AND confirmed=0;

-- PMI May 01
UPDATE events SET lat=39.7652, lon=2.7150 WHERE id='ev-pmi-may01-am' AND confirmed=0;
UPDATE events SET lat=39.7652, lon=2.7150 WHERE id='ev-pmi-may01-rec-naranjas' AND confirmed=0;
UPDATE events SET lat=39.7982, lon=2.6925 WHERE id='ev-pmi-may01-pm' AND confirmed=0;
UPDATE events SET lat=39.7982, lon=2.6925 WHERE id='ev-pmi-may01-rec-kayak' AND confirmed=0;
UPDATE events SET lat=39.7982, lon=2.6925 WHERE id='ev-pmi-may01-rec-uv-snack' AND confirmed=0;
UPDATE events SET lat=39.5722, lon=2.6506 WHERE id='ev-pmi-may01-ev' AND confirmed=0;

-- ROM May 06
UPDATE events SET lat=41.8902, lon=12.4922 WHERE id='ev-rom-may06-am' AND confirmed=0;
UPDATE events SET lat=41.8956, lon=12.4908 WHERE id='ev-rom-may06-pm' AND confirmed=0;
UPDATE events SET lat=41.8902, lon=12.4922 WHERE id='ev-rom-may06-ev' AND confirmed=0;

-- ROM May 07
UPDATE events SET lat=41.9064, lon=12.4534 WHERE id='ev-rom-may07-am' AND confirmed=0;
UPDATE events SET lat=41.9022, lon=12.4539 WHERE id='ev-rom-may07-pm' AND confirmed=0;
UPDATE events SET lat=41.8892, lon=12.4697 WHERE id='ev-rom-may07-ev' AND confirmed=0;

-- ROM May 08
UPDATE events SET lat=41.9142, lon=12.4925 WHERE id='ev-rom-may08-am' AND confirmed=0;
UPDATE events SET lat=41.9139, lon=12.4920 WHERE id='ev-rom-may08-pm' AND confirmed=0;
UPDATE events SET lat=41.8986, lon=12.4769 WHERE id='ev-rom-may08-ev' AND confirmed=0;

-- ROM May 09
UPDATE events SET lat=41.8902, lon=12.4922 WHERE id='ev-rom-may09-am' AND confirmed=0;
UPDATE events SET lat=41.8003, lon=12.2389 WHERE id='ev-rom-may09-pm' AND confirmed=0;

-- MAD May 09 (escala nocturna)
UPDATE events SET lat=40.4939, lon=-3.5666 WHERE id='ev-mad-may09-noche-regreso-t4' AND confirmed=0;
UPDATE events SET lat=40.4939, lon=-3.5666 WHERE id='ev-mad-may09-noche-llegada' AND confirmed=0;
UPDATE events SET lat=40.4152, lon=-3.7074 WHERE id='ev-mad-may09-noche-cena' AND confirmed=0;
UPDATE events SET lat=40.4152, lon=-3.7074 WHERE id='ev-mad-may09-noche-plaza-mayor' AND confirmed=0;
UPDATE events SET lat=40.4112, lon=-3.7106 WHERE id='ev-mad-may09-noche-la-latina' AND confirmed=0;
UPDATE events SET lat=40.4200, lon=-3.7058 WHERE id='ev-mad-may09-noche-gran-via' AND confirmed=0;

-- Paris Airbnb estadia coord fix (was NULL). Le Marais / Saint-Paul,
-- matching the ev-leg-par-gdn-hotel destination.
UPDATE events SET lat=48.8552, lon=2.3614
WHERE id='ev-stay-auto-par' AND type='estadia' AND lat IS NULL;

-- -------------------------------------------------------------------------
-- SECTION 2 · walkings inserted (confirmed=0, subtype='walking')
-- -------------------------------------------------------------------------

-- PMI May 01 · Paseo Marítimo (19:30) → Cena La Calatrava (20:30)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon,
  confirmed, variant, mandatory,
  origin_lat, origin_lon, destination_lat, destination_lon,
  origin_label, destination_label
) VALUES (
  'ev-leg-pmi-may01-walk-1', 'traslado', 'walking',
  'walk-pmi-20260501-paseo-calatrava',
  'A pie · Paseo Marítimo → La Calatrava',
  'Caminata ~1.45 km desde el Paseo Marítimo de Palma hasta la zona de La Calatrava para la cena.',
  '2026-05-01',
  '2026-05-01T19:30:00+02:00', '2026-05-01T19:47:00+02:00',
  'pmi', 'pmi', 0, 'pi pi-map-marker',
  0, 'both', 0,
  39.5600, 2.6400, 39.5706, 2.6498,
  'Paseo Marítimo de Palma', 'La Calatrava · Palma'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-pmi-may01-walk-1', NULL, '0', 'walking', 17);

-- LON May 02 · Almuerzo City Tour (17:00) → Denmark Street Soho (18:00)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon,
  confirmed, variant, mandatory,
  origin_lat, origin_lon, destination_lat, destination_lon,
  origin_label, destination_label
) VALUES (
  'ev-leg-lon-may02-walk-1', 'traslado', 'walking',
  'walk-lon-20260502-trafalgar-soho',
  'A pie · Trafalgar → Denmark Street (Soho)',
  'Caminata ~0.9 km desde Trafalgar/Westminster hacia Denmark Street · Soho.',
  '2026-05-02',
  '2026-05-02T17:00:00+01:00', '2026-05-02T17:11:00+01:00',
  'lon', 'lon', 0, 'pi pi-map-marker',
  0, 'both', 0,
  51.5074, -0.1278, 51.5155, -0.1291,
  'Trafalgar Square', 'Denmark Street · Soho'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-lon-may02-walk-1', NULL, '0', 'walking', 11);

-- ROM May 07 · Almuerzo Prati (14:30) → San Pietro (15:00)
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon,
  confirmed, variant, mandatory,
  origin_lat, origin_lon, destination_lat, destination_lon,
  origin_label, destination_label
) VALUES (
  'ev-leg-rom-may07-walk-1', 'traslado', 'walking',
  'walk-rom-20260507-prati-sanpietro',
  'A pie · Prati → San Pietro',
  'Caminata ~0.65 km desde el almuerzo en Prati hasta la Plaza de San Pietro.',
  '2026-05-07',
  '2026-05-07T14:30:00+02:00', '2026-05-07T14:38:00+02:00',
  'rom', 'rom', 0, 'pi pi-map-marker',
  0, 'both', 0,
  41.9078, 12.4560, 41.9022, 12.4539,
  'Prati (Vaticano)', 'Piazza San Pietro'
);
INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-rom-may07-walk-1', NULL, '0', 'walking', 8);
