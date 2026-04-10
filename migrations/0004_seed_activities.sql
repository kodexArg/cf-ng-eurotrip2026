-- Seed: activities
-- confirmed = 1 → booked/paid. confirmed = 0 → planned intention.
-- Only activities with real known data are seeded.
-- Days with no confirmed plans are left empty (no rows) — fill in as the trip approaches.

-- ── MADRID ──────────────────────────────────────────────────────────────────

-- Apr 20: flight lands early, AirBNB from this date
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('mad-act-apr20-arrival', 'mad-day-apr20', 'morning',
   'Llegada a Madrid ~6AM. Traslado al AirBNB — C. del Ave María 42, Lavapiés.',
   NULL, 1, 'both'),
  ('mad-act-apr20-rest', 'mad-day-apr20', 'afternoon',
   'Descanso. Primer paseo tranquilo por el barrio.',
   NULL, 0, 'both');

-- Apr 21: anniversary — no specific plan yet
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('mad-act-apr21-aniv', 'mad-day-apr21', 'all-day',
   'Aniversario. Sin agenda definida.',
   NULL, 0, 'both');

-- Apr 22–23: no confirmed plans yet — rows omitted intentionally

-- ── BARCELONA ───────────────────────────────────────────────────────────────

-- Apr 24: travel day from Madrid (train, intention)
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('bcn-act-apr24-train', 'bcn-day-apr24', 'morning',
   'Tren Madrid → Barcelona (AVE, temprano).',
   NULL, 0, 'both'),
  ('bcn-act-apr24-checkin', 'bcn-day-apr24', 'afternoon',
   'Check-in alojamiento.',
   NULL, 0, 'both');

-- Apr 27: Sagrada Familia — CONFIRMED TICKET
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('bcn-act-apr27-sf', 'bcn-day-apr27', 'afternoon',
   'Sagrada Família — acceso básico + Torre del Nacimiento. Ticket comprado.',
   '~€36 pp', 1, 'both');

-- Apr 25, 26, 28: no confirmed plans yet — rows omitted intentionally

-- ── PARIS ───────────────────────────────────────────────────────────────────

-- Apr 29: travel day from Barcelona (flight, intention)
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('par-act-apr29-flight', 'par-day-apr29', 'morning',
   'Vuelo Barcelona → París.',
   NULL, 0, 'both'),
  ('par-act-apr29-checkin', 'par-day-apr29', 'afternoon',
   'Llegada y check-in AirBNB (por confirmar dirección).',
   NULL, 0, 'both');

-- Apr 30, May 1: no confirmed plans yet — rows omitted intentionally

-- ── VENECIA ─────────────────────────────────────────────────────────────────

-- May 2: travel day from París (train, intention)
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('vce-act-may02-train', 'vce-day-may02', 'morning',
   'Tren París → Venecia (vía Milán).',
   NULL, 0, 'both'),
  ('vce-act-may02-arrival', 'vce-day-may02', 'evening',
   'Llegada Venecia. Check-in.',
   NULL, 0, 'both');

-- May 3: no confirmed plans yet — rows omitted intentionally

-- ── ROMA ────────────────────────────────────────────────────────────────────

-- May 4: travel day from Venecia (train, intention)
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('rom-act-may04-train', 'rom-day-may04', 'morning',
   'Tren Venecia → Roma.',
   NULL, 0, 'both'),
  ('rom-act-may04-arrival', 'rom-day-may04', 'evening',
   'Llegada Roma. Check-in.',
   NULL, 0, 'both');

-- May 5–8: no confirmed plans yet — rows omitted intentionally

-- May 9 is departure day (FCO→EZE) — covered by transport_legs, no day row needed
