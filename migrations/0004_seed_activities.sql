-- Seed: activities for all days
-- variant: 'both' | 'main' | 'train'

-- ── MADRID ──────────────────────────────────────────────────────────────────

-- Apr 20: Llegada
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('mad-act-apr20-morning', 'mad-day-apr20', 'morning',   'Llegada a Madrid. Hotel. Descanso del vuelo.', NULL, 0, 'both'),
  ('mad-act-apr20-afternoon', 'mad-day-apr20', 'afternoon', 'Primer paseo tranquilo por el barrio. Sin agenda.', NULL, 0, 'both');

-- Apr 21: Aniversario
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('mad-act-apr21-allday', 'mad-day-apr21', 'all-day', 'Tour guiado por la ciudad. Conocer Madrid con guía.', NULL, 0, 'both');

-- Apr 22: main variant (Triángulo del Arte — Prado + Reina Sofía + Retiro)
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('mad-act-apr22-prado',       'mad-day-apr22', 'morning',   'Museo del Prado', 'gratis 18–20h o ~15 pp', 0, 'main'),
  ('mad-act-apr22-reina-sofia', 'mad-day-apr22', 'morning',   'Museo Reina Sofía — Guernica de Picasso. A 5 min del Prado.', 'gratis Lun-Sab 19–21h o ~12 pp', 0, 'main'),
  ('mad-act-apr22-retiro',      'mad-day-apr22', 'afternoon', 'Jardín Botánico, Retiro, Barrio de las Letras.', NULL, 0, 'main');

-- Apr 22: train variant (Paseo del Prado — solo Prado + Retiro)
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('mad-act-apr22t-prado',  'mad-day-apr22-train', 'morning',   'Museo del Prado', 'gratis 18–20h o ~15 pp', 0, 'train'),
  ('mad-act-apr22t-retiro', 'mad-day-apr22-train', 'afternoon', 'Jardín Botánico, Retiro, Barrio de las Letras.', NULL, 0, 'train');

-- Apr 23: Toledo excursion
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('mad-act-apr23-morning',   'mad-day-apr23', 'morning',   'AVE a Toledo (~33 min). Alcázar, Catedral Primada, casco medieval.', '~15 pp ida/vuelta', 0, 'both'),
  ('mad-act-apr23-afternoon', 'mad-day-apr23', 'afternoon', 'Puente de San Martín, murallas, mirador del Valle. Regreso noche.', NULL, 0, 'both');

-- ── BARCELONA ───────────────────────────────────────────────────────────────

-- Apr 24: Llegada
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('bcn-act-apr24-morning',   'bcn-day-apr24', 'morning',   'AVE Atocha → Sants (2h 30m)', '~28–65 pp', 0, 'both'),
  ('bcn-act-apr24-afternoon', 'bcn-day-apr24', 'afternoon', 'Check-in. Las Ramblas, Barrio Gótico.', NULL, 0, 'both');

-- Apr 25: Park Güell + Gràcia
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('bcn-act-apr25-morning',   'bcn-day-apr25', 'morning',   'Park Güell — vistas y mosaicos', '~10 pp', 0, 'both'),
  ('bcn-act-apr25-afternoon', 'bcn-day-apr25', 'afternoon', 'Barrio de Gràcia, cafés.', NULL, 0, 'both');

-- Apr 26: Casas Gaudí + Barceloneta
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('bcn-act-apr26-morning',   'bcn-day-apr26', 'morning',   'Casa Batlló + Casa Milà', '~60 pp', 0, 'both'),
  ('bcn-act-apr26-afternoon', 'bcn-day-apr26', 'afternoon', 'Barceloneta, paseo marítimo.', NULL, 0, 'both');

-- Apr 27: Sagrada Família (confirmed)
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('bcn-act-apr27-sf', 'bcn-day-apr27', 'afternoon', 'Sagrada Familia — ticket confirmado', NULL, 1, 'both');

-- Apr 28: MACBA + El Raval
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('bcn-act-apr28-morning',   'bcn-day-apr28', 'morning',   'MACBA — Museo de Arte Contemporáneo de Barcelona', '~11 pp', 0, 'both'),
  ('bcn-act-apr28-afternoon', 'bcn-day-apr28', 'afternoon', 'El Raval, paseo marítimo, Port Olímpic.', NULL, 0, 'both');

-- Apr 29: main variant (Montjuïc en scooter + Miró)
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('bcn-act-apr29-scooter',   'bcn-day-apr29', 'morning',   'Scooter eléctrico — subir a Montjuïc. Castillo, jardines, vistas al puerto.', '~15–20/día', 0, 'main'),
  ('bcn-act-apr29-miro',      'bcn-day-apr29', 'morning',   'Fundació Joan Miró — arte moderno con vistas panorámicas.', '~15 pp', 0, 'main'),
  ('bcn-act-apr29-poble-sec', 'bcn-day-apr29', 'afternoon', 'Bajar por Poble Sec. El Born, Barceloneta si queda energía.', NULL, 0, 'main');

-- Apr 29: train variant (Libre — sin agenda)
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('bcn-act-apr29t-libre', 'bcn-day-apr29-train', 'all-day', 'El Born, mercados, Barceloneta. Repetir favoritos. Descanso.', NULL, 0, 'train');

-- Apr 30 BCN (Barcelona→París travel day)
-- main: vuelo; train: TGV
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('bcn-act-apr30-vuelo', 'bcn-day-apr30', 'morning', 'Vuelo Barcelona → París (~2h)', NULL, 0, 'main'),
  ('bcn-act-apr30-tgv',   'bcn-day-apr30', 'morning', 'TGV Sants → Gare de Lyon (~6h 30m). Ventana: costa mediterránea, Provenza, Ródano.', '~USD 80–200 (2 pax)', 0, 'train'),
  ('bcn-act-apr30-llegada-train', 'bcn-day-apr30', 'afternoon', 'Llegada Gare de Lyon. Dejar equipaje hotel. Arrancar París.', NULL, 0, 'train');

-- ── PARIS ───────────────────────────────────────────────────────────────────

-- Apr 30 PAR: main = Louvre morning + Torre Eiffel afternoon + Marais/Latin Quarter evening
--             train = Torre Eiffel afternoon + Louvre exterior night
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('par-act-apr30-louvre',    'par-day-apr30', 'morning',   'Louvre — entrada rápida si alcanza', '~17 pp', 0, 'main'),
  ('par-act-apr30-eiffel',    'par-day-apr30', 'afternoon', 'Torre Eiffel desde Trocadéro. Paseo Sena.', NULL, 0, 'main'),
  ('par-act-apr30-marais',    'par-day-apr30', 'evening',   'Marais, Latin Quarter.', NULL, 0, 'main'),
  ('par-act-apr30t-eiffel',   'par-day-apr30', 'afternoon', 'Torre Eiffel desde Trocadéro. Fotos + paseo Sena.', NULL, 0, 'train'),
  ('par-act-apr30t-louvre',   'par-day-apr30', 'evening',   'Louvre exterior iluminado. Marais, Latin Quarter.', '~17 pp si se entra', 0, 'train');

-- May 1: Paris → Venice via Milan
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('par-act-may01-tgv',      'par-day-may01', 'morning',   'TGV Gare de Lyon → Milano Centrale (~7h)', '~80–150 pp', 0, 'both'),
  ('par-act-may01-trasbordo','par-day-may01', 'afternoon', 'Trasbordo. Tren → Venezia Santa Lucia (~2h 30m)', NULL, 0, 'both'),
  ('par-act-may01-llegada',  'par-day-may01', 'evening',   'Llegada Venecia ~21h. Check-in.', NULL, 0, 'both');

-- ── VENECIA ─────────────────────────────────────────────────────────────────

-- May 2: San Marco + Canales
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('vce-act-may02-morning',   'vce-day-may02', 'morning',   'Plaza San Marco — Basílica, Campanile, Palazzo Ducale', '~25 pp Palazzo Ducale', 0, 'both'),
  ('vce-act-may02-afternoon', 'vce-day-may02', 'afternoon', 'Puente Rialto, canales, vaporetto Gran Canal.', NULL, 0, 'both'),
  ('vce-act-may02-evening',   'vce-day-may02', 'evening',   'Cannaregio o Dorsoduro. Venecia sin turistas.', NULL, 0, 'both');

-- May 3: Murano + Burano + salida a Roma
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('vce-act-may03-murano',    'vce-day-may03', 'morning',   'Murano (vidrio) + Burano (casas de colores)', NULL, 0, 'both'),
  ('vce-act-may03-tren',      'vce-day-may03', 'afternoon', 'Frecciarossa Venezia → Roma Termini (~3h 30m)', '~30–60 pp', 0, 'both'),
  ('vce-act-may03-llegada',   'vce-day-may03', 'evening',   'Llegada Roma ~20h. Trastevere.', NULL, 0, 'both');

-- ── ROMA ────────────────────────────────────────────────────────────────────

-- May 4: main = Descanso + Roma clásica a pie
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('rom-act-may04-morning',   'rom-day-may04', 'morning',   'Descanso después de Venecia. Sin apuro.', NULL, 0, 'main'),
  ('rom-act-may04-afternoon', 'rom-day-may04', 'afternoon', 'Panteón → Piazza Navona → Fontana di Trevi. Paseo circular ~2 km.', 'Panteón gratis', 0, 'main');

-- May 4: train = Libre — descanso
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('rom-act-may04t-libre', 'rom-day-may04-train', 'all-day', 'Sin agenda. Descanso después de Venecia. Paseo tranquilo por el barrio.', NULL, 0, 'train');

-- May 5: Coliseo + Foro + Palatino
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('rom-act-may05-morning',   'rom-day-may05', 'morning',   'Coliseo + Foro Romano + Palatino', '~18 pp combo', 0, 'both'),
  ('rom-act-may05-afternoon', 'rom-day-may05', 'afternoon', 'Piazza di Spagna, Bocca della Verità, Circo Máximo.', NULL, 0, 'both');

-- May 6: Vaticano
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('rom-act-may06-morning',   'rom-day-may06', 'morning',   'Museos Vaticanos + Capilla Sixtina', '~17 pp', 0, 'both'),
  ('rom-act-may06-afternoon', 'rom-day-may06', 'afternoon', 'Basílica San Pedro (gratis, cúpula ~8 pp). Castel Sant''Angelo.', 'cúpula ~8 pp', 0, 'both');

-- May 7: Pompeya excursion
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('rom-act-may07-morning',   'rom-day-may07', 'morning',   'Tren Roma → Napoli → Pompeya. Ciudad sepultada por el Vesubio.', '~25–45 pp tren + ~18 pp ruinas', 0, 'both'),
  ('rom-act-may07-afternoon', 'rom-day-may07', 'afternoon', 'Regreso a Roma por la tarde.', NULL, 0, 'both');

-- May 8: Último día
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, variant) VALUES
  ('rom-act-may08-allday', 'rom-day-may08', 'all-day', 'Trastevere, repetir favoritos, compras. Cena despedida.', NULL, 0, 'both');
