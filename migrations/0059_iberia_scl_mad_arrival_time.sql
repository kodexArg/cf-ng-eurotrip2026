-- 0059_iberia_scl_mad_arrival_time.sql
-- Sets the missing timestamp_out (arrival time) for the SCL→MAD flight.
--
-- Problem: ev-leg-scl-mad had timestamp_out = NULL, causing the frontend
-- to show an em-dash fallback in the destination row of /reservas.
--
-- Source of truth: VIAJE.md line 13
--   | SCL → MAD | Iberia | Dom 19 abr 2026 | 06:40 | ~06:00 +1 | ...
--   Arrival "~06:00 +1" = approximately 06:00 CEST on Mon 20 Apr 2026.
--
-- Corroborated by migration 0045_madrid_internal_transports.sql:
--   Metro T4 → Sol (ev-leg-mad-t4-sol-arrival) departs at 08:30 CEST Apr 20,
--   consistent with an ~06:00 arrival allowing time for customs and baggage.
--
-- No other column is modified.

UPDATE events
  SET timestamp_out = '2026-04-20T06:00:00+02:00'
  WHERE id = 'ev-leg-scl-mad';
