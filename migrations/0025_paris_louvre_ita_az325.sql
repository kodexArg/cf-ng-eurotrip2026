-- 0025_paris_louvre_ita_az325.sql
-- Plan tentativo (confirmed=0) para el tramo París → Roma:
--   May 5: llegada 11:20 a GdN, día tranquilo y paseable (Louvre cerrado los martes).
--           Sugerencia: Orsay, Sena, Île de la Cité, Le Marais. Dormir en París.
--   May 6: mañana Louvre (abierto miércoles, reserva timed-entry).
--           Tarde RER B a CDG. Vuelo ITA AZ325 CDG 18:15 → FCO 20:25.
--           Llegada Roma ~21:30–22:00 vía Leonardo Express.
--
-- Reemplaza el combo TGV + easyJet (Paris→Lyon→Roma) por vuelo directo CDG→FCO.
-- Todo marcado como NO confirmado hasta comprar vuelo y reservas museos.

-- ─────────────────────────────────────────────────────────────────────
-- 1. París May 5 · hito "tranquilo y paseable"
--    Louvre CERRADO martes · alternativa: Musée d'Orsay + Sena + Marais
-- ─────────────────────────────────────────────────────────────────────
UPDATE events
  SET title        = 'París tranquilo · día paseable',
      description  = 'Llegada 11:20 a Gare du Nord · día relajado caminando París · Louvre cerrado (martes)',
      timestamp_in = '2026-05-05T13:00:00',
      timestamp_out= '2026-05-05T21:00:00',
      date         = '2026-05-05',
      notes        = 'Louvre CERRADO los martes · alternativas abiertas: Musée d''Orsay (impresionistas) · Île de la Cité · Notre-Dame exterior · paseo Sena · Le Marais · Place des Vosges · cena tranquila en el barrio · noche en hotel París',
      confirmed    = 0
  WHERE id = 'ev-par-may04-tarde';

-- ─────────────────────────────────────────────────────────────────────
-- 2. Estadía París: checkout corrido a May 6 tarde (salida hacia CDG ~15:00)
-- ─────────────────────────────────────────────────────────────────────
UPDATE events
  SET timestamp_out = '2026-05-06T16:00:00'
  WHERE id = 'ev-stay-auto-par';

UPDATE events_estadia
  SET checkout_time = '16:00'
  WHERE event_id = 'ev-stay-auto-par';

-- ─────────────────────────────────────────────────────────────────────
-- 3. NUEVO hito May 6 mañana · Louvre
--    Abierto miércoles 9:00–18:00 · reserva timed-entry obligatoria
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO events (id, type, subtype, slug, title, description, date,
  timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant,
  notes, origin_lat, origin_lon)
VALUES (
  'ev-par-may06-louvre', 'hito', 'visit',
  'paris-louvre-20260506',
  'Louvre · mañana París',
  'Museo del Louvre — primera y única visita · apertura 9:00 · salida ~13:00',
  '2026-05-06',
  '2026-05-06T09:00:00',
  '2026-05-06T13:00:00',
  'par', NULL, 'pi-eye', 0, 'both',
  'Reserva timed-entry OBLIGATORIA en ticketlouvre.fr · €22 pp online · imperdibles: Mona Lisa · Venus de Milo · Victoria de Samotracia · Apartamentos Napoleón III · después almuerzo rápido y RER B a CDG',
  48.8606, 2.3376
);

-- ─────────────────────────────────────────────────────────────────────
-- 4. Reemplazo del tramo París → Roma:
--    ITA Airways AZ325 · CDG 18:15 → FCO 20:25 (May 6) · directo · 2h10
-- ─────────────────────────────────────────────────────────────────────
UPDATE events
  SET title         = 'ITA Airways · París CDG → Roma FCO',
      description   = 'Paris Charles de Gaulle (CDG) → Rome Fiumicino (FCO) · directo 2h10',
      date          = '2026-05-06',
      timestamp_in  = '2026-05-06T18:15:00',
      timestamp_out = '2026-05-06T20:25:00',
      notes         = 'ITA Airways AZ325 (operado por ITA/Malta Air según ruta) · vuelo directo 2h10 · salir de París ~15:00 vía RER B (GdN → CDG 30min) · check-in CDG 16:00 · después FCO → Termini vía Leonardo Express (€14, 32min, último ~23:23) o taxi fijo €55 · llegada hotel Roma ~21:30–22:00',
      confirmed     = 0,
      origin_lat    = 49.0097,
      origin_lon    = 2.5479
  WHERE id = 'ev-leg-par-rom';

UPDATE events_traslado
  SET company      = 'ITA Airways',
      fare         = 'USD ~158 pp (OTA) / TBD oficial',
      vehicle_code = 'AZ325',
      duration_min = 130
  WHERE event_id = 'ev-leg-par-rom';

-- ─────────────────────────────────────────────────────────────────────
-- 5. Estadía Roma: check-in corrido de mañana May 6 a noche May 6 (~22:00)
-- ─────────────────────────────────────────────────────────────────────
UPDATE events
  SET timestamp_in = '2026-05-06T22:00:00'
  WHERE id = 'ev-stay-auto-rom';

UPDATE events_estadia
  SET checkin_time = '22:00'
  WHERE event_id = 'ev-stay-auto-rom';
