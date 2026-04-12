-- Migration 0031: Split Madrid arrival activity into two entries
-- Before: single activity "Llegada a Madrid ~6AM. Traslado al AirBNB — C. del Ave María 42, Lavapiés."
-- After:  two activities — arrival from SCL flight + transfer to AirBnB

-- 1. Update existing entry to be just the arrival
UPDATE activities
SET description = 'Llegada desde Santiago (vuelo SCL → MAD) ~6AM'
WHERE id = 'mad-act-apr20-arrival';

-- 2. Insert new activity for the AirBnB transfer
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant, tipo, tag)
VALUES (
  'mad-act-apr20-transfer',
  'mad-day-apr20',
  'morning',
  'Traslado al AirBnB — C. del Ave María 42, Lavapiés',
  NULL,
  1,
  'both',
  'transport',
  'Traslado AirBnB'
);
