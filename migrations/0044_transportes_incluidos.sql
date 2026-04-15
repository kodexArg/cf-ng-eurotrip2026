-- 0044_transportes_incluidos.sql
-- Agrega dos traslados "incluidos" (usd=0) necesarios para el renderizado del mapa.
--
-- Evento 1: May 3 · Coach circular Londres → Windsor → Stonehenge → Oxford → Londres
--   Transporte incluido en tour Viator (ref 1385295633). Confirmed=1.
--
-- Evento 2: May 2 · Caminata Westminster → Soho (Trafalgar Sq → Denmark Street)
--   Conexión entre el city tour de tarde y los bares de Denmark Street. Confirmed=0.

-- ─────────────────────────────────────────────────────────────────────
-- 1. May 3 · Coach · Windsor · Stonehenge · Oxford (circular, incluido en Viator)
-- ─────────────────────────────────────────────────────────────────────

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label,
  waypoints
) VALUES (
  'ev-leg-lon-stonehenge-coach',
  'traslado', 'coach',
  'coach-windsor-stonehenge-oxford-20260503',
  'Coach · Windsor · Stonehenge · Oxford',
  'Transporte incluido en tour Viator. Salida central Londres ~08:00, regreso ~19:00.',
  '2026-05-03',
  '2026-05-03T08:00:00+01:00',
  '2026-05-03T19:00:00+01:00',
  'lon', 'lon',
  0,
  'pi pi-car',
  1, 'both',
  51.5007, -0.1246,
  'Central Londres (pickup)',
  51.5007, -0.1246,
  'Central Londres (regreso)',
  '[[51.4810,-0.3280],[51.4839,-0.6044],[51.3800,-1.3000],[51.1789,-1.8262],[51.4000,-1.3200],[51.7520,-1.2577],[51.7018,-0.9100]]'
);

INSERT INTO events_traslado (event_id, company, vehicle_code, fare, seat, duration_min)
VALUES (
  'ev-leg-lon-stonehenge-coach',
  'Viator', NULL, 'incluido', NULL, 660
);

-- ─────────────────────────────────────────────────────────────────────
-- 2. May 2 · A pie · Westminster → Soho (Trafalgar Sq → Denmark Street)
-- ─────────────────────────────────────────────────────────────────────

INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  usd, icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label,
  waypoints
) VALUES (
  'ev-leg-lon-westminster-soho',
  'traslado', 'walking',
  'walking-westminster-soho-20260502',
  'A pie · Westminster → Soho',
  'Paseo por el centro: Strand, Covent Garden hacia Denmark Street.',
  '2026-05-02',
  '2026-05-02T15:30:00+01:00',
  '2026-05-02T16:00:00+01:00',
  'lon', 'lon',
  0,
  'pi pi-map-marker',
  0, 'both',
  51.5007, -0.1246,
  'Trafalgar Square',
  51.5155, -0.1291,
  'Denmark Street · Soho',
  NULL
);

INSERT INTO events_traslado (event_id, company, vehicle_code, fare, seat, duration_min)
VALUES (
  'ev-leg-lon-westminster-soho',
  NULL, NULL, NULL, NULL, 30
);
