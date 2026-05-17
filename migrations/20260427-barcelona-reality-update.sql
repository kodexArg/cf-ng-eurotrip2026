-- Migration: Barcelona Reality Update - April 27, 2026
-- Author: kodex
-- Purpose: Update Barcelona itinerary based on what actually happened during the trip

-- DÍA 24 ABR — Llegada:
-- Keep: ev-bcn-apr24-lunch-blai (already exists and is correct)
-- Keep: ev-stay-bk-bcn-airbnb (already exists and is correct)
-- DELETE events that did NOT happen: ev-bcn-apr24-boqueria, ev-bcn-apr24-placa-reial, ev-bcn-apr24-santa-maria-del-mar, ev-bcn-apr24-born-tapeo, ev-bcn-apr24-cena-calders
-- ADD: Caminata Montjuïc Castillo (tarde/noche del 24)

DELETE FROM events 
WHERE id IN (
  'ev-bcn-apr24-boqueria',
  'ev-bcn-apr24-placa-reial',
  'ev-bcn-apr24-santa-maria-del-mar',
  'ev-bcn-apr24-born-tapeo',
  'ev-bcn-apr24-cena-calders'
);

-- ADD: Caminata Montjuïc Castillo (tarde/noche del 24)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, city_out, icon, confirmed, done, notes)
VALUES (
  'ev-bcn-apr24-montjuic-castillo',
  'hito',
  'caminata',
  'caminata-montjuic-castillo',
  'Caminata Montjuïc Castillo',
  'Larga caminata por Montjuïc hasta el castillo y vuelta por el parque/jardín',
  '2026-04-24',
  '2026-04-24T17:00:00+02:00',
  '2026-04-24T19:30:00+02:00',
  'bcn',
  'bcn',
  'caminata',
  1,
  1,
  'Added during Barcelona reality update'
);

-- DÍA 25 ABR:
-- Keep: Visita La Rambla (need to add this)
-- Keep: Bus turístico a la tarde (already exists as ev-bcn-apr25-bus-turistic)
-- DELETE events that did NOT happen: ev-bcn-apr25-shopping, ev-bcn-apr25-lunch-elisabets, ev-bcn-apr25-font-magica, ev-bcn-apr25-cena-napoli, ev-bcn-apr25-gotic-nocturno
-- ADD: Visita La Rambla (mañana)

DELETE FROM events 
WHERE id IN (
  'ev-bcn-apr25-shopping',
  'ev-bcn-apr25-lunch-elisabets',
  'ev-bcn-apr25-font-magica',
  'ev-bcn-apr25-cena-napoli',
  'ev-bcn-apr25-gotic-nocturno'
);

-- ADD: Visita La Rambla (mañana)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, city_out, icon, confirmed, done, notes)
VALUES (
  'ev-bcn-apr25-rambla',
  'hito',
  'visita',
  'visita-rambla',
  'Visita La Rambla',
  'Paseo por La Rambla de Barcelona',
  '2026-04-25',
  '2026-04-25T10:00:00+02:00',
  '2026-04-25T12:00:00+02:00',
  'bcn',
  'bcn',
  'paseo',
  1,
  1,
  'Added during Barcelona reality update'
);

-- DÍA 26 ABR:
-- ADD: Bus turístico (no existe en DB como evento del 26)
-- Keep: Park Güell (already exists ev-bcn-apr26-park-guell 13:15-15:00)
-- Keep: Casa de piedra por afuera = Casa Vicens exterior (already exists ev-bcn-apr26-casa-vicens-ext)
-- MOVE: 21:00 Font Màgica (exists ev-bcn-apr25-font-magica but está en el 25 — MOVER al 26 y cambiar hora a 21:00)
-- MOVE: Barrio gótico a la noche (exists ev-bcn-apr25-gotic-nocturno but está en el 25 — MOVER al 26)
-- DELETE events that did NOT happen: ev-bcn-act-apr26-park-guell (duplicate 10:00), ev-bcn-apr26-lunch-pubilla, ev-bcn-apr26-vermut-gracia, ev-bcn-apr26-catamaran, ev-bcn-apr26-bunkers, ev-bcn-apr26-cena-ligera

DELETE FROM events 
WHERE id IN (
  'ev-bcn-act-apr26-park-guell',
  'ev-bcn-apr26-lunch-pubilla',
  'ev-bcn-apr26-vermut-gracia',
  'ev-bcn-apr26-catamaran',
  'ev-bcn-apr26-bunkers',
  'ev-bcn-apr26-cena-ligera'
);

-- ADD: Bus turístico (for Apr 26)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, city_out, icon, confirmed, done, notes)
VALUES (
  'ev-bcn-apr26-bus-turistic',
  'hito',
  'turistico',
  'bus-turistico-barcelona',
  'Bus Turístico Barcelona',
  'Recorrido en bus turístico por la ciudad',
  '2026-04-26',
  '2026-04-26T11:00:00+02:00',
  '2026-04-26T13:00:00+02:00',
  'bcn',
  'bcn',
  'bus_turistico',
  1,
  1,
  'Added during Barcelona reality update'
);

-- MOVE: Font Màgica from Apr 25 to Apr 26 and change time to 21:00
UPDATE events 
SET 
  date = '2026-04-26',
  timestamp_in = '2026-04-26T21:00:00+02:00',
  timestamp_out = '2026-04-26T22:00:00+02:00',
  title = 'Font Màgica Montjuïc (21:00)',
  done = 1
WHERE id = 'ev-bcn-apr25-font-magica';

-- MOVE: Barrio gótico from Apr 25 to Apr 26
UPDATE events 
SET 
  date = '2026-04-26',
  timestamp_in = '2026-04-26T22:00:00+02:00',
  timestamp_out = '2026-04-26T23:30:00+02:00',
  title = 'Barrio Gótico + paseo nocturno',
  done = 1
WHERE id = 'ev-bcn-apr25-gotic-nocturno';

-- DÍA 27 ABR:
-- ADD: Día de playa (mañana)
-- Keep: Sagrada Família 18:30 (already corrected)
-- Keep: Torre 19:15 (already added)
-- REST: VACÍO — está en construcción

-- ADD: Día de playa (mañana)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, city_out, icon, confirmed, done, notes)
VALUES (
  'ev-bcn-apr27-playa',
  'hito',
  'playa',
  'dia-de-playa',
  'Día de playa',
  'Día de playa en la costa barcelonesa',
  '2026-04-27',
  '2026-04-27T10:00:00+02:00',
  '2026-04-27T13:00:00+02:00',
  'bcn',
  'bcn',
  'playa',
  1,
  1,
  'Added during Barcelona reality update'
);

-- Mark all Barcelona hito events as done=1 to reflect reality
UPDATE events 
SET done = 1
WHERE city_in = 'bcn' 
  AND type = 'hito';