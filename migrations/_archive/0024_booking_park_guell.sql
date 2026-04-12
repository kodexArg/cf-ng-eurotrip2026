-- Migration 0024: Booking + activity — Park Güell, Barcelona Apr 26

-- ─────────────────────────────────────────────────────
-- 1. BOOKING — entrada confirmada Park Güell + Casa Museo Gaudí
-- ─────────────────────────────────────────────────────

INSERT INTO bookings (id, type, sort_date, time, description, confirmed, cost_usd)
VALUES (
  'booking-park-guell-apr26',
  'hito',
  '2026-04-26',
  NULL,
  'Park Güell — zona monumental + Casa Museo Gaudí (2 personas)',
  1,
  59.0
);

-- ─────────────────────────────────────────────────────
-- 2. ACTIVITY — Park Güell en bcn-day-apr26 (no existe aún)
-- ─────────────────────────────────────────────────────

INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag)
VALUES (
  'bcn-act-apr26-park-guell',
  'bcn-day-apr26',
  'morning',
  'Park Güell — zona monumental + Casa Museo Gaudí',
  '$59 total (2 personas)',
  1,
  'visit',
  'Park Güell'
);
