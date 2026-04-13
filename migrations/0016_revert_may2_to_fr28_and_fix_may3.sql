-- 0016_revert_may2_to_fr28_and_fix_may3.sql
-- Fix May 2: ev-leg-pmi-lon (FR28 Ryanair, confirmed=1) is the real flight.
--   Arrival: Liverpool St 08:57 → adjust check-in and morning walk timestamps.
-- Fix May 3: Stonehenge is a full-day trip (08:00–18:00).
--   Remove conflicting London-city events; keep West End evening (20:00).

-- ─────────────────────────────────────────────────────────────────────
-- 1. DELETE speculative Jet2 + Gatwick Express events (if still present)
--    (0014_confirm_fr28_pmi_stn already removed these; safe to skip if gone)
-- ─────────────────────────────────────────────────────────────────────
DELETE FROM events_traslado WHERE event_id IN ('ev-leg-pmi-lgw', 'ev-leg-lgw-lon');
DELETE FROM events WHERE id IN ('ev-leg-pmi-lgw', 'ev-leg-lgw-lon');

-- ─────────────────────────────────────────────────────────────────────
-- 2. UPDATE May 2 — arrival is 08:57 Liverpool St, morning/early-afternoon free
-- ─────────────────────────────────────────────────────────────────────
UPDATE events
  SET timestamp_in = '2026-05-02T10:30:00'
  WHERE id = 'ev-stay-auto-lon';

UPDATE events
  SET timestamp_in = '2026-05-02T11:00:00',
      notes        = 'Llegada Liverpool St 08:57 · dejar maletas en hotel ~10:30 · mañana y tarde libre en el centro · sugerencia: Southbank, Tate Modern, Millennium Bridge'
  WHERE id = 'ev-lon-may02-walk';

-- ─────────────────────────────────────────────────────────────────────
-- 3. DELETE conflicting May 3 London-city events (Stonehenge is full day)
-- ─────────────────────────────────────────────────────────────────────
DELETE FROM events WHERE id IN (
  'ev-lon-may03-am',       -- Tower of London 10:00
  'ev-lon-may03-guruwalk', -- Free Tour Londres en español 10:00
  'ev-lon-may03-pm'        -- Westminster 15:00
);
