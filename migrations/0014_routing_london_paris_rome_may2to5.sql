-- 0014_routing_london_paris_rome_may2to5.sql
-- Reroute May 2-5: PMI→LGW (Jet2) → London 2n → Eurostar May 4 → Paris 1n → CDG→FCO May 5 morning.
-- Removes: FR28/STN route, old May 5 Eurostar+TGV+easyJet hybrid.
-- London: 3n → 2n (check-out May 4). Paris: day-only → 1n (check-out May 5). Rome: unchanged (arrives May 5).

-- ─────────────────────────────────────────────────────────────────────
-- 1. REMOVE old traslado chain (STN route + May 5 hybrid)
--    FK order: events_traslado → events
-- ─────────────────────────────────────────────────────────────────────
DELETE FROM events_traslado WHERE event_id IN (
  'ev-leg-pmi-lon',   -- FR28 Ryanair PMI→STN
  'ev-leg-stn-lon',   -- Stansted Express STN→Liverpool St
  'ev-leg-lon-par',   -- Eurostar 9001 05:57 (old May 5)
  'ev-leg-par-rom'    -- TGV 6923 + easyJet U2 4421 (old May 5)
);

DELETE FROM events WHERE id IN (
  'ev-leg-pmi-lon',
  'ev-leg-stn-lon',
  'ev-leg-lon-par',
  'ev-leg-par-rom',
  'ev-par-dia-libre',   -- Paris free day (old May 5)
  'ev-lon-may04-prep'   -- "Prep Eurostar — cena y descanso" (was for 05:57 departure)
);

-- ─────────────────────────────────────────────────────────────────────
-- 2. Update Londres: 3n → 2n (check-out May 4 midday before Eurostar)
-- ─────────────────────────────────────────────────────────────────────
UPDATE cities
  SET departure = '2026-05-04', nights = 2
  WHERE id = 'lon';

UPDATE events
  SET timestamp_out = '2026-05-04T09:00:00'
  WHERE id = 'ev-stay-auto-lon';

-- ─────────────────────────────────────────────────────────────────────
-- 3. Update París: 0n → 1n (check-in May 4, check-out May 5)
-- ─────────────────────────────────────────────────────────────────────
UPDATE cities
  SET arrival = '2026-05-04', departure = '2026-05-05', nights = 1
  WHERE id = 'par';

-- ─────────────────────────────────────────────────────────────────────
-- 4. ADD May 2: Jet2 flight PMI → LGW 10:25 → 12:05 (local times)
--    Company TBD — marked in notes. 2 pax, ~USD 19/pax.
-- ─────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant,
  notes, origin_lat, origin_lon, destination_lat, destination_lon)
VALUES (
  'ev-leg-pmi-lgw', 'traslado', 'flight',
  'flight-pmi-lgw-20260502',
  'Jet2 · Palma PMI → Londres Gatwick',
  'Palma de Mallorca Airport (PMI) → London Gatwick (LGW)',
  '2026-05-02',
  '2026-05-02T10:25:00',
  '2026-05-02T12:05:00',
  'lon', 'pmi', 19.00,
  'pi-send',
  0, 'both',
  'company TBD, confirmar desde screenshot del usuario · ~USD 19/pax · 2 pax · vuelo ~1h40m · aeropuerto de salida: PMI · llegada: LGW terminal sur',
  39.5517, 2.7388,
  51.1537, -0.1821
);

INSERT OR IGNORE INTO events_traslado (event_id, company, fare, vehicle_code, seat, duration_min)
VALUES ('ev-leg-pmi-lgw', 'Jet2', '~USD 19', NULL, NULL, 100);

-- ─────────────────────────────────────────────────────────────────────
-- 5. ADD May 2: Gatwick Express LGW → London Victoria ~12:45 → 13:15
-- ─────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant,
  notes, origin_lat, origin_lon, destination_lat, destination_lon)
VALUES (
  'ev-leg-lgw-lon', 'traslado', 'train',
  'train-lgw-lon-20260502',
  'Gatwick Express · LGW → Londres Victoria',
  'London Gatwick Airport → London Victoria Station',
  '2026-05-02',
  '2026-05-02T12:45:00',
  '2026-05-02T13:15:00',
  'lon', 'lon', NULL,
  'pi-directions',
  0, 'both',
  '~30 min · salidas cada 15 min · ~£25 pp · comprar en gatwickexpress.com (más barato anticipado) · desde Victoria conectar con metro Circle/District',
  51.1537, -0.1821,
  51.4952, -0.1441
);

INSERT OR IGNORE INTO events_traslado (event_id, company, fare, vehicle_code, seat, duration_min)
VALUES ('ev-leg-lgw-lon', 'Gatwick Express', '~£25', NULL, NULL, 30);

-- ─────────────────────────────────────────────────────────────────────
-- 6. ADD May 2: hito — recorrido casual por el centro de Londres (tarde)
-- ─────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, city_in, usd, icon, confirmed, variant,
  notes, origin_lat, origin_lon)
VALUES (
  'ev-lon-may02-walk', 'hito', 'leisure',
  'lon-may02-walk-20260502',
  'Recorrido casual por el centro de Londres',
  'Primer contacto con la ciudad — caminata libre por el centro',
  '2026-05-02',
  '2026-05-02T15:00:00',
  'lon', NULL, 'pi-heart', 0, 'both',
  'Llegada al hotel ~14:00 · tarde libre · sugerencia: Southbank, Tate Modern, Millennium Bridge',
  51.5074, -0.1278
);

-- ─────────────────────────────────────────────────────────────────────
-- 7. ADD May 3: Stonehenge day trip (hito)
-- ─────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant,
  notes, lat, lon)
VALUES (
  'ev-lon-may03-stonehenge', 'hito', 'visit',
  'stonehenge-20260503',
  'Stonehenge',
  'Excursión de día completo a Stonehenge desde Londres',
  '2026-05-03',
  '2026-05-03T08:00:00',
  '2026-05-03T18:00:00',
  'lon', NULL, 'pi-eye', 0, 'both',
  'Tour organizado desde Londres (~£50-80 pp todo incluido) o tren a Salisbury + bus (2h ida) · entrada £22-25 · reservar anticipado en English Heritage · regreso a Londres ~18h',
  51.1789, -1.8262
);

-- ─────────────────────────────────────────────────────────────────────
-- 8. ADD May 4: Eurostar London St Pancras → Paris Gare du Nord
--    09:01 BST → 12:20 CEST (hora local de cada ciudad)
-- ─────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant,
  notes, origin_lat, origin_lon, destination_lat, destination_lon)
VALUES (
  'ev-leg-lon-par', 'traslado', 'train',
  'train-lon-par-20260504',
  'Eurostar · Londres → París',
  'London St Pancras International → Paris Gare du Nord',
  '2026-05-04',
  '2026-05-04T09:01:00',
  '2026-05-04T12:20:00',
  'par', 'lon', NULL,
  'pi-directions',
  0, 'both',
  'tiempo exacto TBD · ~2h20m · Standard ~£60-80 pp · reservar en eurostar.com · check-in 30 min antes · St Pancras zona King''s Cross',
  51.5321, -0.1235,
  48.8809, 2.3553
);

INSERT OR IGNORE INTO events_traslado (event_id, company, fare, vehicle_code, seat, duration_min)
VALUES ('ev-leg-lon-par', 'Eurostar', '~£60-80', NULL, NULL, 139);

-- ─────────────────────────────────────────────────────────────────────
-- 9. ADD May 4: Tarde en París (hito casual)
-- ─────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant,
  notes, origin_lat, origin_lon)
VALUES (
  'ev-par-may04-tarde', 'hito', 'visit',
  'paris-tarde-20260504',
  'Tarde en París',
  'Primera tarde en París — exploración libre',
  '2026-05-04',
  '2026-05-04T13:00:00',
  '2026-05-04T21:00:00',
  'par', NULL, 'pi-eye', 0, 'both',
  'Sugerencia: Le Marais, Île de la Cité, Notre-Dame (exterior aún en restauración) · cena en el barrio · noche en hotel París',
  48.8566, 2.3522
);

-- ─────────────────────────────────────────────────────────────────────
-- 10. ADD May 5: París → Roma vuelo mañana CDG → FCO
--     Horario sugerido: 08:00–10:00 local (TBD)
-- ─────────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, city_out, usd, icon, confirmed, variant,
  notes, origin_lat, origin_lon, destination_lat, destination_lon)
VALUES (
  'ev-leg-par-rom', 'traslado', 'flight',
  'flight-par-rom-20260505',
  'Vueling/easyJet/ITA · París CDG → Roma FCO',
  'Paris Charles de Gaulle (CDG) → Rome Fiumicino (FCO)',
  '2026-05-05',
  '2026-05-05T08:00:00',
  '2026-05-05T10:00:00',
  'rom', 'par', NULL,
  'pi-send',
  0, 'both',
  'vuelo TBD, company y hora exacta pendientes · sugerencias: Vueling VY, easyJet U2, ITA AZ · ~€60-90 pp · ~1h45m · CDG Terminal 2 (Vueling/ITA) o Terminal 1 (easyJet) · reservar con anticipación',
  49.0097, 2.5479,
  41.8003, 12.2388
);

INSERT OR IGNORE INTO events_traslado (event_id, company, fare, vehicle_code, seat, duration_min)
VALUES ('ev-leg-par-rom', 'Vueling/easyJet/ITA', '~€60-90', NULL, NULL, 105);

-- ─────────────────────────────────────────────────────────────────────
-- 11. Update Roma estadia: llegada ajustada a May 5 mediodía
-- ─────────────────────────────────────────────────────────────────────
UPDATE events
  SET timestamp_in = '2026-05-05T11:00:00',
      date         = '2026-05-05'
  WHERE id = 'ev-stay-auto-rom';
