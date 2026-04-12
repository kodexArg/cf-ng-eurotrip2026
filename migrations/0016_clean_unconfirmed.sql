-- Clean unconfirmed data: keep only what's booked/paid
-- Confirmed items preserved:
--   - SCL → MAD transport leg
--   - Madrid arrival (apr 20)
--   - Sagrada Família (apr 27)

DELETE FROM activities WHERE confirmed = 0;
DELETE FROM transport_legs WHERE confirmed = 0;
DELETE FROM cards;
