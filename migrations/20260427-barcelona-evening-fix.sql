-- Migration: Barcelona Evening Events Fix - April 27, 2026
-- Author: kodex
-- Purpose: Add the missing evening events for April 26 that should have been moved

-- ADD: Font Màgica for Apr 26 at 21:00 (previously on Apr 25)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, city_out, icon, confirmed, done, notes)
VALUES (
  'ev-bcn-apr26-font-magica',
  'hito',
  'font',
  'font-magica-montjuic',
  'Font Màgica Montjuïc (21:00)',
  'Espectáculo de la Font Màgica Montjuïc',
  '2026-04-26',
  '2026-04-26T21:00:00+02:00',
  '2026-04-26T22:00:00+02:00',
  'bcn',
  'bcn',
  'agua',
  1,
  1,
  'Moved from Apr 25 during Barcelona reality update'
);

-- ADD: Barrio gótico for Apr 26 evening (previously on Apr 25)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, city_out, icon, confirmed, done, notes)
VALUES (
  'ev-bcn-apr26-gotic-nocturno',
  'hito',
  'paseo',
  'barrio-gotico-nocturno',
  'Barrio Gótico + paseo nocturno',
  'Paseo nocturno por el Barrio Gótico',
  '2026-04-26',
  '2026-04-26T22:00:00+02:00',
  '2026-04-26T23:30:00+02:00',
  'bcn',
  'bcn',
  'noche',
  1,
  1,
  'Moved from Apr 25 during Barcelona reality update'
);