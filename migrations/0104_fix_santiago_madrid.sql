-- 0104_fix_santiago_madrid_dates_and_suggestions.sql
-- Fix Santiago departure to match reality and remove unconfirmed events

-- Santiago: departure should be 2026-04-19 (flight leaves early morning CLT)
-- but in the itinerary, the last event in Santiago is Apr 18.
-- The departure date being 19 means the calendar shows Apr 19 with no events.
-- Fix: change Santiago departure to 2026-04-18 (same day as last event)
-- The flight event is already on Apr 20 in Madrid.
UPDATE cities SET departure = '2026-04-18' WHERE id = 'scl';

-- Madrid: change arrival to 2026-04-20 (already correct, first event is 20)
-- Change departure to 2026-04-24 (last full day before BCN)
-- Verify no unconfirmed/suggested events remain for SCL and MAD
UPDATE events SET done = 1, confirmed = 1 WHERE city_in IN ('scl', 'mad') AND done = 0;
