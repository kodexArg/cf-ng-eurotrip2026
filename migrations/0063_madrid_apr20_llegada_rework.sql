-- 0063_madrid_apr20_llegada_rework.sql
-- Rework del día de llegada a Madrid (lunes 20 abr 2026, post-vuelo SCL→MAD).
--
-- Cambios:
--   1. UPDATE ev-leg-mad-t4-sol-arrival  Metro T4→Sol  ⇒  EMT Express 203 T4→Atocha
--      (llegamos por bus 24h a Atocha, no al Airbnb, para arrancar caminata).
--   2. DELETE ev-mad-apr20-citytour  (perfil arte+++ rechaza hop-on/hop-off).
--   3. DELETE ev-mad-apr20-prado     (se mueve a Apr 22 post-Toledo).
--   4. INSERT nuevos hitos:
--      - Caminata simbólica Atocha → Retiro → Lavapiés (primer transporte terrestre a pie).
--      - Parque del Retiro por la mañana.
--      - Mercado de Antón Martín (tapas locales, NO turista tipo San Miguel).
--      - Fundación MAPFRE · Anders Zorn (GRATIS lunes 14-20h, vigente feb–may 2026).
--
-- Todos los nuevos confirmed=0.

-- ─────────────────────────────────────────────────────────────────────
-- 1. UPDATE transporte llegada: Metro T4→Sol  ⇒  EMT Express 203 T4→Atocha
-- ─────────────────────────────────────────────────────────────────────
UPDATE events SET
  title           = 'EMT Express 203 · T4 → Atocha',
  subtype         = 'bus',
  slug            = 'emt-express-t4-atocha-20260420',
  timestamp_in    = '2026-04-20T07:00:00+02:00',
  timestamp_out   = '2026-04-20T07:40:00+02:00',
  origin_lat      = 40.4922,
  origin_lon      = -3.5929,
  origin_label    = 'Madrid Barajas T4',
  destination_lat = 40.4065,
  destination_lon = -3.6890,
  destination_label = 'Madrid Puerta de Atocha',
  description     = 'Bus EMT Express 203 aeropuerto T4 → Atocha. Opera 24h, sale cada 15 min. Billete €5.10 pp (pago en bus, tarjeta).',
  usd             = 11.09,
  confirmed       = 0
WHERE id = 'ev-leg-mad-t4-sol-arrival';

UPDATE events_traslado SET
  company      = 'EMT Madrid',
  fare         = 'EUR 5.10 pp (€10.20 total)',
  vehicle_code = '203',
  duration_min = 40
WHERE event_id = 'ev-leg-mad-t4-sol-arrival';

-- ─────────────────────────────────────────────────────────────────────
-- 2. DELETE hop-on/hop-off tour y Prado Apr 20 (se rework)
-- ─────────────────────────────────────────────────────────────────────
DELETE FROM events WHERE id = 'ev-mad-apr20-citytour';
DELETE FROM events WHERE id = 'ev-mad-apr20-prado';

-- ─────────────────────────────────────────────────────────────────────
-- 3. Traslado a pie · Atocha → Paseo del Prado → Retiro → Lavapiés
--    Primer transporte terrestre del viaje europeo a pie.
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in, city_out,
  icon, confirmed, variant,
  origin_lat, origin_lon, origin_label,
  destination_lat, destination_lon, destination_label
) VALUES (
  'ev-leg-mad-apr20-caminata',
  'traslado', 'walking',
  'mad-caminata-atocha-lavapies-20260420',
  'A pie · Atocha → Paseo del Prado → Retiro → Lavapiés',
  'Caminata simbólica — primer transporte terrestre del viaje europeo a pie. Atocha → Paseo del Prado (20 min) → Retiro entrada Puerta de Alcalá (abre 06:00) → paseo interior → Antón Martín → Lavapiés. Respirar aire, ubicarse, bajar tensión post-vuelo.',
  '2026-04-20',
  '2026-04-20T07:40:00+02:00',
  '2026-04-20T09:30:00+02:00',
  'mad', 'mad',
  'pi pi-map-marker',
  0, 'both',
  40.4065, -3.6890,
  'Madrid Puerta de Atocha',
  40.4089, -3.7025,
  'Airbnb Lavapiés (C. del Ave María 42)'
);

INSERT INTO events_traslado (event_id, company, fare, vehicle_code, duration_min)
VALUES ('ev-leg-mad-apr20-caminata', NULL, '0', 'walking', 110);

-- ─────────────────────────────────────────────────────────────────────
-- 4. Hito · Parque del Retiro · paseo matutino
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr20-retiro-manana',
  'hito', 'leisure',
  'mad-retiro-manana-20260420',
  'Parque del Retiro · paseo matutino',
  'Paseo tranquilo por el parque recién abierto. Estanque, Palacio de Cristal si está abierto. Bajar tensión post-vuelo.',
  '2026-04-20',
  '2026-04-20T08:30:00+02:00',
  '2026-04-20T10:00:00+02:00',
  'mad',
  0.00, 'pi pi-sun', 0, 'both',
  40.4153, -3.6844
);

-- ─────────────────────────────────────────────────────────────────────
-- 5. Hito · Mercado de Antón Martín · tapas locales
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr20-antonmartin',
  'hito', 'food',
  'mad-antonmartin-20260420',
  'Mercado de Antón Martín · tapas locales',
  'Mercado tradicional cercano a Lavapiés (NO turista tipo San Miguel). Tapas, jamón, cerveza. ~€25 pareja.',
  '2026-04-20',
  '2026-04-20T13:00:00+02:00',
  '2026-04-20T14:30:00+02:00',
  'mad',
  27.18, 'pi pi-shop', 0, 'both',
  40.4110, -3.6990
);

-- ─────────────────────────────────────────────────────────────────────
-- 6. Hito · Fundación MAPFRE · Anders Zorn (GRATIS lunes 14-20h)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (
  id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out,
  city_in,
  usd, icon, confirmed, variant,
  lat, lon
) VALUES (
  'ev-mad-apr20-mapfre-zorn',
  'hito', 'museo',
  'mad-mapfre-zorn-20260420',
  'Fundación MAPFRE · Anders Zorn (GRATIS lunes)',
  'Retrospectiva del pintor sueco Anders Zorn. ENTRADA GRATUITA lunes 14-20h. Pequeña, 1h alcanza. Vigente 19 feb–17 may 2026.',
  '2026-04-20',
  '2026-04-20T17:00:00+02:00',
  '2026-04-20T19:00:00+02:00',
  'mad',
  0.00, 'pi pi-image', 0, 'both',
  40.4247, -3.6920
);
