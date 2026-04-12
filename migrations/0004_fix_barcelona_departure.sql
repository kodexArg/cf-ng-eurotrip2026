-- 0004_fix_barcelona_departure.sql
-- Fix Barcelona's departure date and nights count.
-- The seed (0002) had departure='2026-04-24' and nights=0, which caused
-- April 25, 26, 27 to render without city color in the Calendario view.
-- The actual stay is 4 nights: arrival Apr 24, departure Apr 27 (flight out Apr 28).

UPDATE cities
SET departure = '2026-04-27',
    nights    = 4
WHERE id = 'bcn';
