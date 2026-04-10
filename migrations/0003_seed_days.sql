-- Seed: 22 trip days (Apr 17 – May 9, 2026)
-- Pre-trip flight day (Apr 19)
INSERT INTO days (id, city_id, date, label, variant) VALUES
  -- Apr 19: flight day, not in any city — skip (transport_legs covers this)

  -- MADRID (Apr 20–23, departure Apr 24)
  ('mad-day-apr20', 'mad', '2026-04-20', 'Llegada · descanso · jet lag', 'both'),
  ('mad-day-apr21', 'mad', '2026-04-21', 'Aniversario', 'both'),
  ('mad-day-apr22', 'mad', '2026-04-22', 'Triángulo del Arte', 'main'),
  ('mad-day-apr22-train', 'mad', '2026-04-22', 'Paseo del Prado', 'train'),
  ('mad-day-apr23', 'mad', '2026-04-23', 'Toledo — día completo', 'both'),

  -- BARCELONA (Apr 24–29, departure Apr 30)
  ('bcn-day-apr24', 'bcn', '2026-04-24', 'Madrid → Barcelona', 'both'),
  ('bcn-day-apr25', 'bcn', '2026-04-25', 'Park Güell + Gràcia', 'both'),
  ('bcn-day-apr26', 'bcn', '2026-04-26', 'Casas Gaudí + Barceloneta', 'both'),
  ('bcn-day-apr27', 'bcn', '2026-04-27', 'Sagrada Familia', 'both'),
  ('bcn-day-apr28', 'bcn', '2026-04-28', 'MACBA + El Raval', 'both'),
  ('bcn-day-apr29', 'bcn', '2026-04-29', 'Montjuïc en scooter + Miró', 'main'),
  ('bcn-day-apr29-train', 'bcn', '2026-04-29', 'Libre — sin agenda', 'train'),
  ('bcn-day-apr30', 'bcn', '2026-04-30', 'Barcelona → París', 'both'),

  -- PARIS (Apr 30 – May 1, departure May 2 via train May 1)
  ('par-day-apr30', 'par', '2026-04-30', 'Torre Eiffel + Louvre', 'both'),
  ('par-day-may01', 'par', '2026-05-01', 'París → Venecia (vía Milán)', 'both'),

  -- VENECIA (May 2–3, departure May 3 afternoon)
  ('vce-day-may02', 'vce', '2026-05-02', 'San Marco + Canales', 'both'),
  ('vce-day-may03', 'vce', '2026-05-03', 'Murano + Burano · salida a Roma', 'both'),

  -- ROMA (May 4–8, departure May 9)
  ('rom-day-may04', 'rom', '2026-05-04', 'Descanso + Roma clásica a pie', 'main'),
  ('rom-day-may04-train', 'rom', '2026-05-04', 'Libre — descanso', 'train'),
  ('rom-day-may05', 'rom', '2026-05-05', 'Coliseo + Foro + Palatino', 'both'),
  ('rom-day-may06', 'rom', '2026-05-06', 'Vaticano', 'both'),
  ('rom-day-may07', 'rom', '2026-05-07', 'Pompeya', 'both'),
  ('rom-day-may08', 'rom', '2026-05-08', 'Último día — Trastevere + despedida', 'both');
