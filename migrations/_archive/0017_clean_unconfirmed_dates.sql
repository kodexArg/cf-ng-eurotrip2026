-- Only Madrid (20-24 apr, 4 nights) and Roma departure (9 may) are confirmed.
-- Everything else is tentative — remove days and reset city dates.

-- Remove all days + activities for non-Madrid cities
DELETE FROM activities WHERE day_id IN (
  SELECT id FROM days WHERE city_id != 'mad'
);
DELETE FROM days WHERE city_id != 'mad';

-- Barcelona, Paris, Venice: dates unknown, nights=0
UPDATE cities SET arrival = '2026-04-24', departure = '2026-04-24', nights = 0
  WHERE id IN ('bcn', 'par', 'vce');

-- Roma: only departure confirmed (May 9)
UPDATE cities SET arrival = '2026-05-09', departure = '2026-05-09', nights = 0
  WHERE id = 'rom';
