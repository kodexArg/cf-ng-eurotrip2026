-- 0023_lon_par_rom_reschedule.sql
-- Resync del itinerario tras mover Eurostar a May 5 (migration 0022).
-- Flujo real confirmado:
--   Londres 2 may → 5 may 08:01 (Eurostar)
--   París    5 may 11:20 → 6 may madrugada (vuelo temprano sin confirmar)
--   Roma     6 may → 9 may (3 noches)

-- 1. Master cities: fechas + noches
UPDATE cities SET departure = '2026-05-05', nights = 3 WHERE id = 'lon';
UPDATE cities SET arrival   = '2026-05-05', departure = '2026-05-06', nights = 1 WHERE id = 'par';
UPDATE cities SET arrival   = '2026-05-06', nights = 3 WHERE id = 'rom';

-- 2. Estadía Londres: checkout corrido hasta el Eurostar (May 5 08:01)
UPDATE events
  SET timestamp_out = '2026-05-05T08:01:00'
  WHERE id = 'ev-stay-auto-lon';

-- 3. Hito "tarde París": pasa de May 4 tarde a May 5 tarde (llegada 11:20)
UPDATE events
  SET date          = '2026-05-05',
      timestamp_in  = '2026-05-05T13:00:00',
      timestamp_out = '2026-05-05T21:00:00'
  WHERE id = 'ev-par-may04-tarde';

-- 4. Nueva estadía París (media noche, 5 may mediodía → 6 may madrugada)
INSERT INTO events (id, type, subtype, slug, title, date, timestamp_in, timestamp_out, city_in, icon, confirmed, variant)
VALUES (
  'ev-stay-auto-par', 'estadia', 'hotel', 'stay-par-20260505',
  'Alojamiento en París',
  '2026-05-05', '2026-05-05T12:00:00', '2026-05-06T05:00:00',
  'par', 'pi-home', 0, 'both'
);

INSERT INTO events_estadia (event_id, accommodation, checkin_time, checkout_time)
VALUES ('ev-stay-auto-par', 'Por confirmar — París', '12:00', '05:00');

-- 5. Vuelo Paris → Roma: movido a May 6 madrugada, sin confirmar
UPDATE events
  SET date          = '2026-05-06',
      timestamp_in  = '2026-05-06T06:00:00',
      timestamp_out = '2026-05-06T08:00:00',
      confirmed     = 0,
      notes         = 'Sin confirmar — vuelo muy temprano May 6 Paris → Roma'
  WHERE id = 'ev-leg-par-rom';

-- 6. Estadía Roma: empieza May 6 mañana (no May 5)
UPDATE events
  SET date         = '2026-05-06',
      timestamp_in = '2026-05-06T09:00:00'
  WHERE id = 'ev-stay-auto-rom';
