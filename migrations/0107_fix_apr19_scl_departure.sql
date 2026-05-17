-- 0107_fix_apr19_scl_departure.sql
-- April 19 was "lost": the SCL→MAD flight had inverted timestamps
-- (timestamp_in 04-20 AFTER timestamp_out 04-19) and city_out=scl,
-- so the calendar rendered nothing on the 19th.
--
-- Intent: Apr 18 AND 19 are both Santiago (1 night, depart on the 19);
-- Madrid begins Apr 20 with the arrival (cities.mad already arr=2026-04-20).
--
-- Flight times: Iberia IB6830 SCL→MAD typical schedule 13:55 (-04:00) →
-- 06:35 next day (+02:00), consistent with the existing 06:00 Madrid
-- airport café on the 20th. Adjust if the real flight differs.

-- Santiago now spans the 18th and the 19th (1 night), departing on the 19th.
UPDATE cities
SET departure = '2026-04-19', nights = 1
WHERE id = 'scl';

-- Fix the flight: real scl→mad leg, departs the 19th, arrives the 20th.
UPDATE events
SET city_out      = 'mad',
    date          = '2026-04-19',
    timestamp_in  = '2026-04-19T13:55:00-04:00',
    timestamp_out = '2026-04-20T06:35:00+02:00'
WHERE id = 'ev-leg-scl-mad';
