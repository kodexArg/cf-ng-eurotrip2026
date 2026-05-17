-- Migration: Barcelona DB Cleanup - April 27, 2026
-- Author: kodex
-- Purpose: Update Barcelona itinerary based on actual events

-- 1. UPDATE ev-bk-sagrada: set timestamp_in = '2026-04-27T18:30:00+02:00'
UPDATE events 
SET timestamp_in = '2026-04-27T18:30:00+02:00' 
WHERE id = 'ev-bk-sagrada';

-- 2. INSERT new event for Torre at 19:15 on Apr 27
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, city_out, icon, confirmed, done, notes)
VALUES (
  'ev-bcn-apr27-torre-sagrada',
  'hito',
  'visita',
  'torre-sagrada-familia',
  'Torre de la Sagrada Família',
  'Visitando la torre de la Sagrada Família',
  '2026-04-27',
  '2026-04-27T19:15:00+02:00',
  '2026-04-27T20:15:00+02:00',
  'bcn',
  'bcn',
  'generico',
  1,
  1,
  'Added during Barcelona cleanup'
);

-- 3. DELETE the 6 wrong Apr 27 hito events
DELETE FROM events 
WHERE id IN (
  'ev-bcn-apr27-arc-triomf',
  'ev-bcn-apr27-ciutadella',
  'ev-bcn-apr27-barceloneta',
  'ev-bcn-apr27-lunch-cova',
  'ev-bcn-apr27-sant-pau',
  'ev-bcn-apr27-cena-ligera'
);

-- 4. Mark ALL Apr 24, 25, 26 Barcelona hito events as done=1
UPDATE events 
SET done = 1
WHERE city_in = 'bcn' 
  AND DATE(timestamp_in) IN ('2026-04-24', '2026-04-25', '2026-04-26') 
  AND type = 'hito';

-- 5. Also mark ev-leg-mad-bcn as done=1
UPDATE events 
SET done = 1
WHERE id = 'ev-leg-mad-bcn';