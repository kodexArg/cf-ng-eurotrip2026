-- 0011_london_paris_rome_via_lyon.sql
-- Reemplaza FR1935 Liverpool→Roma (May 4) por la ruta:
--   · Eurostar Londres St Pancras → París GdN (05:57 BST → 09:20 CEST, May 5)
--   · Día libre en París (~7h en ciudad)
--   · TGV INOUI 6923 Paris GdL 17:13 → Lyon Saint-Exupéry 19:07 CEST
--   · easyJet U2 4421 LYS 20:20 → Roma FCO 21:55 CEST (May 5)
-- Londres: 2 noches → 3 noches (sale May 5 madrugada).
-- Roma: llegada May 4 mediodía → May 5 noche (21:55).
-- Tiempos almacenados en hora local de cada ciudad (patrón existente).

-- ─────────────────────────────────────────────────────────────────────
-- 1. Eliminar Liverpool completo (evento, cards, city)
--    Orden respeta FK: card_links → cards → events → cities
-- ─────────────────────────────────────────────────────────────────────
DELETE FROM card_links WHERE card_id LIKE 'lvp-%';
DELETE FROM cards WHERE city_id = 'lvp';
DELETE FROM events_traslado WHERE event_id = 'ev-leg-lpl-rom';
DELETE FROM events WHERE id = 'ev-leg-lpl-rom';
DELETE FROM cities WHERE id = 'lvp';

-- ─────────────────────────────────────────────────────────────────────
-- 2. Extender Londres: 2 → 3 noches (checkout May 5 a las 06:00)
-- ─────────────────────────────────────────────────────────────────────
UPDATE cities
  SET departure = '2026-05-05', nights = 3
  WHERE id = 'lon';

UPDATE events
  SET timestamp_out = '2026-05-05T06:00:00'
  WHERE id = 'ev-stay-auto-lon';

-- ─────────────────────────────────────────────────────────────────────
-- 3. Actividad Londres May 4 — preparación para madrugón
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, city_in, usd, icon, confirmed, variant, notes,
  origin_lat, origin_lon)
VALUES (
  'ev-lon-may04-prep', 'hito', 'leisure',
  'lon-may04-prep-20260504',
  'Prep Eurostar — cena y descanso',
  'Cena tranquila cerca del hotel · maletas listas · dormir temprano — Eurostar sale 05:57 desde St Pancras',
  '2026-05-04',
  '2026-05-04T20:00:00',
  'lon', NULL, 'pi-heart', 0, 'both',
  'Carry-on only · St Pancras a 15 min desde zona centro · salir a las 05:15',
  51.5074, -0.1278
);

-- ─────────────────────────────────────────────────────────────────────
-- 4. Insertar ciudad París (escala diurna, 0 noches)
-- ─────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO cities (id, name, slug, arrival, departure, nights, color, lat, lon)
VALUES ('par', 'París', 'paris', '2026-05-05', '2026-05-05', 0, '#c1440e', 48.8566, 2.3522);

-- ─────────────────────────────────────────────────────────────────────
-- 5. Tramo A: Eurostar — London St Pancras → Paris Gare du Nord
--    05:57 BST (local) → 09:20 CEST (local)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant,
  notes, origin_lat, origin_lon, destination_lat, destination_lon)
VALUES (
  'ev-leg-lon-par', 'traslado', 'train',
  'train-lon-par-20260505',
  'Eurostar · Londres → París',
  'London St Pancras International → Paris Gare du Nord',
  '2026-05-05',
  '2026-05-05T05:57:00',
  '2026-05-05T09:20:00',
  'par', 'lon', NULL,
  'pi-directions',
  0, 'both',
  '2h20m · Standard ~£49 · tren 9001 · reservar en eurostar.com',
  51.5074, -0.1278,
  48.8566, 2.3522
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, seat, duration_min)
VALUES ('ev-leg-lon-par', 'Eurostar', '~£49', '9001', NULL, 140);

-- ─────────────────────────────────────────────────────────────────────
-- 6. Hito: Día libre en París (~7h)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant,
  notes, origin_lat, origin_lon)
VALUES (
  'ev-par-dia-libre', 'hito', 'visit',
  'paris-dia-libre-20260505',
  'Día libre en París',
  'Consigna en Gare de Lyon (~€10/bolso) · Le Marais · Notre-Dame · Île de la Cité · regreso a GdL a las 16:30',
  '2026-05-05',
  '2026-05-05T09:20:00',
  '2026-05-05T16:30:00',
  'par', NULL, 'pi-eye', 0, 'both',
  '~7h ciudad · TGV sale 17:13 desde Gare de Lyon (distinto a Gare du Nord)',
  48.8566, 2.3522
);

-- ─────────────────────────────────────────────────────────────────────
-- 7. Tramo B: TGV + easyJet — París → Roma vía Lyon Saint-Exupéry
--    TGV INOUI 6923: Paris GdL 17:13 → LYS 19:07 CEST (1h54m)
--    easyJet U2 4421: LYS 20:20 → Roma FCO 21:55 CEST (1h35m)
--    Buffer en aeropuerto: 1h13m (carry-on only recomendado)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant,
  notes, origin_lat, origin_lon, destination_lat, destination_lon)
VALUES (
  'ev-leg-par-rom', 'traslado', 'flight',
  'flight-par-rom-20260505',
  'TGV + easyJet · París → Roma',
  'TGV INOUI 6923: Paris GdL 17:13 → Lyon Saint-Exupéry 19:07 · easyJet U2 4421: LYS 20:20 → Roma FCO 21:55',
  '2026-05-05',
  '2026-05-05T17:13:00',
  '2026-05-05T21:55:00',
  'rom', 'par', NULL,
  'pi-send',
  0, 'both',
  'TGV 1h54m · buffer 1h13m en LYS · vuelo 1h35m · total 4h42m · ~€55-125/pax · carry-on only',
  48.8566, 2.3522,
  41.8003, 12.2388
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, seat, duration_min)
VALUES ('ev-leg-par-rom', 'TGV + easyJet', '~€55-125', 'TGV 6923 + U2 4421', NULL, 282);

-- ─────────────────────────────────────────────────────────────────────
-- 8. Actualizar Roma: llegada May 4 mediodía → May 5 noche
-- ─────────────────────────────────────────────────────────────────────
UPDATE cities
  SET arrival = '2026-05-05', nights = 4
  WHERE id = 'rom';

UPDATE events
  SET timestamp_in = '2026-05-05T22:00:00',
      date         = '2026-05-05'
  WHERE id = 'ev-stay-auto-rom';

-- ─────────────────────────────────────────────────────────────────────
-- 9. Eliminar actividades de llegada Roma May 4 (Pantheon/Trevi + Trastevere)
--    Con llegada a las 21:55 no tiene sentido hacer turismo ese día.
--    Roma tiene agenda completa desde May 6.
-- ─────────────────────────────────────────────────────────────────────
DELETE FROM events WHERE id IN ('ev-rom-may05-pm', 'ev-rom-may05-ev');
