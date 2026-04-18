-- 0088_paris_airbnb_details.sql
-- Datos confirmados del Airbnb en París:
--   Dirección: 5 rue de Bruxelles, París 9ème
--   Anfitrión: Gad
--   Check-in: 16:00 · Check-out: 11:00
--   Coordenadas OSM verificadas: 48.8835, 2.3315
--   Corrige coords incorrectas (Le Marais) de migración 0074.

-- 1. Evento principal
UPDATE events
  SET title         = 'Airbnb · 5 rue de Bruxelles · París',
      timestamp_in  = '2026-05-05T16:00:00+02:00',
      timestamp_out = '2026-05-06T11:00:00+02:00',
      lat           = 48.8835,
      lon           = 2.3315,
      notes         = '5 rue de Bruxelles · París 9ème · Anfitrión: Gad · Check-in 16:00 · Check-out 11:00 · USD 213 pagado · 1 noche (May 5→6) · a ~400m del Musée de la Vie Romantique'
  WHERE id = 'ev-stay-auto-par';

-- 2. Detalle estadía
UPDATE events_estadia
  SET accommodation = 'Airbnb · 5 rue de Bruxelles · Anfitrión Gad',
      checkin_time  = '16:00',
      checkout_time = '11:00'
  WHERE event_id = 'ev-stay-auto-par';

-- 3. Traslado Gare du Nord → hotel: corregir destination coords
UPDATE events
  SET destination_lat = 48.8835,
      destination_lon = 2.3315
  WHERE id = 'ev-leg-par-gdn-hotel';
