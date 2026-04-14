-- 0027_scenario_b_eju4957.sql
-- Escenario B confirmado: vuelo easyJet EJU4957 ORY→FCO (May 6 16:50→18:55 CEST)
-- Reemplaza el tramo tentativo ITA AZ325 CDG→FCO (migration 0025, nunca comprado).
--
-- Cambios:
--   · ev-leg-par-rom     → UPDATE a EJU4957 · ORY en lugar de CDG · confirmed=1
--   · ev-stay-auto-par   → checkout corrido a 14:00 (salida del hotel antes del Louvre/metro)
--   · ev-stay-auto-rom   → check-in corrido a 20:30 (post Leonardo Express)
--   · ev-leg-par-metro14 → NUEVO traslado Metro 14 Pyramides→ORY (May 6 ~14:10, ~30 min)
--   · ev-leg-leo-express → NUEVO traslado Leonardo Express FCO→Termini (May 6 ~19:30, 32 min)
-- Nota: hito Louvre (ev-par-may06-louvre) y hitos Roma sin tocar per instrucciones.
-- Cities par/rom ya correctas (par: 1 noche, rom: 3 noches). No se modifican.

-- ─────────────────────────────────────────────────────────────────────
-- 1. Vuelo principal: UPDATE ev-leg-par-rom
--    ITA AZ325 CDG (tentativo, no comprado) → easyJet EJU4957 ORY (PAGADO)
-- ─────────────────────────────────────────────────────────────────────
UPDATE events
  SET title             = 'easyJet EJU4957 · Orly → Fiumicino',
      description       = 'Paris Orly (ORY) → Roma Fiumicino (FCO) · directo 2h05',
      date              = '2026-05-06',
      timestamp_in      = '2026-05-06T16:50:00+02:00',
      timestamp_out     = '2026-05-06T18:55:00+02:00',
      usd               = 270,
      confirmed         = 1,
      notes             = 'PNR KCGNGF3. 2 pax: Gabriel Cavedal + Vanesa Bourges. 2x small cabin bag incluido (mochilas 10L). Flex Pass incluido (cambio fecha hasta 2h antes del vuelo). Terminal ORY1 · bag drop abre 14:50, cierra 16:10. Llegada T1 FCO ~18:55. Reemplaza ITA AZ325 CDG (tentativo 0025, nunca comprado). Precio pagado: EUR 256.30 total (EUR 222.30 tarifa base + EUR 34 Flex Pass x2 pax).',
      origin_lat        = 48.7233,
      origin_lon        = 2.3794,
      origin_label      = 'Paris Orly Terminal ORY1 (ORY)',
      destination_lat   = 41.8001,
      destination_lon   = 12.2386,
      destination_label = 'Roma Fiumicino T1 (FCO)'
  WHERE id = 'ev-leg-par-rom';

UPDATE events_traslado
  SET company      = 'easyJet',
      vehicle_code = 'EJU4957',
      fare         = 'Standard + Flex Pass · EUR 256.30 total (2 pax)',
      seat         = NULL,
      duration_min = 125
  WHERE event_id = 'ev-leg-par-rom';

-- ─────────────────────────────────────────────────────────────────────
-- 2. Estadía París: checkout a ~14:00 (salida hotel, camino al Louvre / metro ORY)
--    Era 16:00 (para CDG). Con ORY la salida del hotel puede ser ~13:30–14:00.
-- ─────────────────────────────────────────────────────────────────────
UPDATE events
  SET timestamp_out = '2026-05-06T14:00:00+02:00',
      notes         = '1 noche confirmada (May 5→6). Hotel por confirmar (TODO). Check-out ~14:00 para llegar a Louvre 10:00–13:00 y tomar Metro 14 a ORY a las ~14:10.'
  WHERE id = 'ev-stay-auto-par';

UPDATE events_estadia
  SET checkout_time = '14:00'
  WHERE event_id = 'ev-stay-auto-par';

-- ─────────────────────────────────────────────────────────────────────
-- 3. NUEVO traslado: Metro 14 Pyramides → Aéroport d'Orly
--    May 6 ~14:10, duración ~30 min, EUR 10.30 p/p = EUR ~21 total
--    confirmed=1 (servicio público regular, no requiere reserva)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant, notes,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-par-metro14-ory',
  'traslado', 'metro',
  'par-metro14-ory',
  'Metro 14 · Pyramides → Orly',
  'Ligne 14 desde Pyramides (Louvre) hasta Aéroport d''Orly · 30 min sin trasbordo',
  '2026-05-06',
  '2026-05-06T14:10:00+02:00',
  '2026-05-06T14:40:00+02:00',
  'par', 'par',
  22,
  'pi-map',
  1, 'both',
  'Línea 14 directa Pyramides → Orly (sin transbordo desde 2024). EUR 10.30 p/p · 2 pax = EUR ~21. Salida ~14:10 desde Pyramides (salida Louvre 13:00, almuerzo rápido ~13:00–14:00). Llegar a ORY T1 ~14:40 · bag drop abre 14:50.',
  48.8638, 2.3362,
  'Pyramides · M14 (Louvre)',
  48.7264, 2.3719,
  'Aéroport d''Orly (ORY) · M14'
);

INSERT INTO events_traslado (event_id, company, vehicle_code, fare, seat, duration_min, lat_out, lon_out)
VALUES (
  'ev-leg-par-metro14-ory',
  'RATP', 'Ligne 14', 'Navigo / ticket EUR 10.30 pp', NULL, 30,
  48.8638, 2.3362
);

-- ─────────────────────────────────────────────────────────────────────
-- 4. NUEVO traslado: Leonardo Express FCO → Roma Termini
--    May 6 ~19:30, duración 32 min, EUR 14 p/p = EUR 28 total
--    confirmed=0 (se compra en el momento en máquinas de la estación)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant, notes,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-leo-express',
  'traslado', 'train',
  'rom-leonardo-termini',
  'Leonardo Express · Fiumicino → Roma Termini',
  'Tren directo FCO → Roma Termini sin paradas · 32 min',
  '2026-05-06',
  '2026-05-06T19:30:00+02:00',
  '2026-05-06T20:02:00+02:00',
  'rom', 'rom',
  30,
  'pi-map',
  0, 'both',
  'EUR 14 p/p · comprar en máquinas de la estación FCO o en Trenitalia app. Frecuencia: cada 15 min (aproximado). Llega Roma Termini ~20:02. Check-in hotel ~20:30.',
  41.8001, 12.2386,
  'Roma Fiumicino (FCO) · Estación ferroviaria',
  41.9009, 12.4983,
  'Roma Termini'
);

INSERT INTO events_traslado (event_id, company, vehicle_code, fare, seat, duration_min, lat_out, lon_out)
VALUES (
  'ev-leg-leo-express',
  'Trenitalia', 'Leonardo Express', 'EUR 14 pp (sin reserva)', NULL, 32,
  41.8001, 12.2386
);

-- ─────────────────────────────────────────────────────────────────────
-- 5. Estadía Roma: check-in corrido a 20:30 (post Leonardo Express)
--    timestamp_out (May 9 11:00) sin cambio — Roma ya era 3 noches
-- ─────────────────────────────────────────────────────────────────────
UPDATE events
  SET timestamp_in = '2026-05-06T20:30:00+02:00',
      notes        = 'Check-in ~20:30 tras Leonardo Express FCO→Termini. 3 noches: May 6→9. Hotel por confirmar (TODO).'
  WHERE id = 'ev-stay-auto-rom';

UPDATE events_estadia
  SET checkin_time = '20:30'
  WHERE event_id = 'ev-stay-auto-rom';
