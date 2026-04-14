-- 0026_paris_louvre_may6.sql
-- Actualiza el hito del Museo del Louvre insertado en 0025:
--   · subtype: 'visit' → 'museo'
--   · slug: 'paris-louvre-20260506' → 'par-louvre'
--   · title: 'Museo del Louvre' (más descriptivo)
--   · timestamp_in: 09:00 → 10:00 CEST (hora real de apertura al público)
--   · timestamp_out: 13:00 CEST (sin cambio)
--   · city_out = 'par' (explícito)
--   · lat/lon = 48.8606, 2.3376 (coords del Louvre en columnas canónicas)
--   · notes: aclaración "cerrado los martes" + compra anticipada obligatoria
-- Contexto: May 5 2026 es MARTES y el Louvre cierra los martes.
-- El usuario llega a París Gare du Nord May 5 11:20 CEST vía Eurostar 9001.
-- Visita planificada para May 6 (miércoles) a las 10:00 CEST.

UPDATE events
  SET subtype      = 'museo',
      slug         = 'par-louvre',
      title        = 'Museo del Louvre',
      description  = 'Museo del Louvre — miércoles May 6 · apertura 10:00 CEST · salida ~13:00',
      timestamp_in = '2026-05-06T10:00:00+02:00',
      timestamp_out= '2026-05-06T13:00:00+02:00',
      city_out     = 'par',
      lat          = 48.8606,
      lon          = 2.3376,
      confirmed    = 0,
      notes        = 'Cerrado los martes — visita obligatoria May 6 AM (miércoles). Comprar entrada online con antelación: ticketlouvre.fr · €22 pp · timed-entry obligatorio · imperdibles: Mona Lisa · Venus de Milo · Victoria de Samotracia · Apartamentos Napoleón III · desde hotel: metro línea 1 (Palais Royal–Musée du Louvre) · después almuerzo rápido y RER B a CDG para vuelo AZ325 18:15'
  WHERE id = 'ev-par-may06-louvre';
