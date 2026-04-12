-- Seed: trip days
-- One row per calendar day, assigned to the city where they sleep that night.
-- variant = 'both' throughout (single plan, no route alternatives).
-- Labels only where something specific is known.

INSERT INTO days (id, city_id, date, label, variant) VALUES

  -- MADRID (Apr 20–23 | 4 nights | depart Apr 24)
  ('mad-day-apr20', 'mad', '2026-04-20', 'Llegada · 6AM · descanso',     'both'),
  ('mad-day-apr21', 'mad', '2026-04-21', 'Aniversario',                  'both'),
  ('mad-day-apr22', 'mad', '2026-04-22', NULL,                           'both'),
  ('mad-day-apr23', 'mad', '2026-04-23', NULL,                           'both'),

  -- BARCELONA (Apr 24–28 | 5 nights | depart Apr 29)
  ('bcn-day-apr24', 'bcn', '2026-04-24', 'Madrid → Barcelona',           'both'),
  ('bcn-day-apr25', 'bcn', '2026-04-25', NULL,                           'both'),
  ('bcn-day-apr26', 'bcn', '2026-04-26', NULL,                           'both'),
  ('bcn-day-apr27', 'bcn', '2026-04-27', 'Sagrada Familia',              'both'),
  ('bcn-day-apr28', 'bcn', '2026-04-28', NULL,                           'both'),

  -- PARIS (Apr 29–May 1 | 3 nights | depart May 2)
  ('par-day-apr29', 'par', '2026-04-29', 'Barcelona → París',            'both'),
  ('par-day-apr30', 'par', '2026-04-30', NULL,                           'both'),
  ('par-day-may01', 'par', '2026-05-01', NULL,                           'both'),

  -- VENECIA (May 2–3 | 2 nights | depart May 4)
  ('vce-day-may02', 'vce', '2026-05-02', 'París → Venecia',              'both'),
  ('vce-day-may03', 'vce', '2026-05-03', NULL,                           'both'),

  -- ROMA (May 4–8 | 5 nights | depart May 9)
  ('rom-day-may04', 'rom', '2026-05-04', 'Venecia → Roma',               'both'),
  ('rom-day-may05', 'rom', '2026-05-05', NULL,                           'both'),
  ('rom-day-may06', 'rom', '2026-05-06', NULL,                           'both'),
  ('rom-day-may07', 'rom', '2026-05-07', NULL,                           'both'),
  ('rom-day-may08', 'rom', '2026-05-08', NULL,                           'both');
