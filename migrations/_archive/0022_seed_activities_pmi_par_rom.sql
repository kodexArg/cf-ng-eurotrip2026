-- Migration 0022: Activities for PMI / PAR / ROM + BCN→PMI change to flight
-- Full day-by-day simulation: unconfirmed, best-opinion itinerary

-- ─────────────────────────────────────────────────────
-- 1. BCN→PMI: ferry → vuelo
-- ─────────────────────────────────────────────────────

UPDATE transport_legs SET
  mode     = 'flight',
  label    = 'Vuelo Barcelona → Palma de Mallorca',
  duration = '~50min'
WHERE id = 'leg-bcn-pmi';

UPDATE map_routes SET
  mode      = 'flight',
  waypoints = '[[41.3874,2.1686],[41.1,2.2],[40.7,2.3],[40.2,2.45],[39.5696,2.6502]]'
WHERE sku = 'bcn-pmi';

-- ─────────────────────────────────────────────────────
-- 2. DÍAS — agregar May 9 para Roma (día de salida)
-- ─────────────────────────────────────────────────────

INSERT OR IGNORE INTO days (id, city_id, date, label, variant) VALUES
  ('rom-day-may09', 'rom', '2026-05-09', 'Salida · IB0656 FCO→MAD 20:25', 'both');

-- ─────────────────────────────────────────────────────
-- 3. ACTIVITIES — PALMA DE MALLORCA (5 días)
-- ─────────────────────────────────────────────────────

-- Apr 28 · llegada vuelo desde BCN
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('pmi-apr28-am', 'pmi-day-apr28', 'morning',   'Vuelo BCN → PMI · llegada ~09:00 · check-in hotel', NULL, 0, 'transport', 'Vueling / Ryanair'),
  ('pmi-apr28-pm', 'pmi-day-apr28', 'afternoon', 'Casco Antiguo de Palma · Catedral La Seu exterior + Parc de la Mar · Paseo Marítimo', 'gratis', 0, 'visit', 'Casco Antiguo'),
  ('pmi-apr28-ev', 'pmi-day-apr28', 'evening',   'Barrio de La Lonja · cena en Plaça de la Llotja', NULL, 0, 'visit', 'La Lonja');

-- Apr 29 · cultura
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('pmi-apr29-am', 'pmi-day-apr29', 'morning',   'Catedral La Seu interior · acceso con guía audioguía incluida · accesible', '€10 · €8 mayores', 0, 'visit', 'Catedral La Seu'),
  ('pmi-apr29-pm', 'pmi-day-apr29', 'afternoon', 'Barrio de Santa Catalina · Mercado de Santa Catalina · tapas y vermut', 'gratis', 0, 'visit', 'Santa Catalina'),
  ('pmi-apr29-ev', 'pmi-day-apr29', 'evening',   'Paseo del Borne · heladerías y bares de la avenida principal', 'gratis', 0, 'visit', 'Paseo del Borne');

-- Apr 30 · excursión Valldemossa
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('pmi-apr30-am', 'pmi-day-apr30', 'morning',   'Excursión Valldemossa · Bus 203 desde Palma (~30 min) · Real Cartuja de Valldemossa · celda de Chopin', '€3 bus · €10 cartuja', 0, 'visit', 'Valldemossa'),
  ('pmi-apr30-pm', 'pmi-day-apr30', 'afternoon', 'Valldemossa pueblo · cafés con vistas a la Serra de Tramuntana · regreso en bus', NULL, 0, 'visit', 'Valldemossa'),
  ('pmi-apr30-ev', 'pmi-day-apr30', 'evening',   'Cena en Palma · descanso', NULL, 0, 'visit', 'Palma');

-- May 1 · excursión Sóller
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('pmi-may01-am', 'pmi-day-may01', 'morning',   'Excursión Sóller · Bus 204 (~1h) · tranvía histórico 1913 hasta Port de Sóller · almuerzo en el puerto', '€3 bus · €6 tranvía ida y vuelta', 0, 'visit', 'Sóller'),
  ('pmi-may01-pm', 'pmi-day-may01', 'afternoon', 'Port de Sóller · paseo costero al nivel del mar · regreso a Palma en bus', NULL, 0, 'visit', 'Port de Sóller'),
  ('pmi-may01-ev', 'pmi-day-may01', 'evening',   'Descanso · cena ligera en el hotel o barrio', NULL, 0, 'visit', 'Palma');

-- May 2 · último día en Palma
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('pmi-may02-am', 'pmi-day-may02', 'morning',   'Castillo de Bellver · único castillo circular de España · vistas panorámicas a la bahía', '€3', 0, 'visit', 'Castillo de Bellver'),
  ('pmi-may02-pm', 'pmi-day-may02', 'afternoon', 'Crucero catamarán desde el puerto de Palma · sin necesidad de caminar · vista de la costa', '€35–€50 p/p · reservar online', 0, 'visit', 'Crucero Bahía'),
  ('pmi-may02-ev', 'pmi-day-may02', 'evening',   'Cena de despedida en Palma · restaurante en Santa Catalina o La Lonja', NULL, 0, 'visit', 'Palma');

-- ─────────────────────────────────────────────────────
-- 4. ACTIVITIES — PARÍS (2 días)
-- ─────────────────────────────────────────────────────

-- May 3 · llegada desde PMI (mediodía)
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('par-may03-am', 'par-day-may03', 'morning',   'Vuelo PMI → CDG · llegada mediodía · check-in hotel', NULL, 0, 'transport', 'Vueling / Ryanair'),
  ('par-may03-pm', 'par-day-may03', 'afternoon', 'Torre Eiffel · Champ de Mars · vista exterior · sin subir · Jardines del Trocadéro', 'gratis exterior', 0, 'visit', 'Torre Eiffel'),
  ('par-may03-ev', 'par-day-may03', 'evening',   'Crucero nocturno por el Sena · sentado durante todo el recorrido · sin caminar', '€15–€25 · reservar online', 0, 'visit', 'Crucero Sena');

-- May 4 · día completo
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('par-may04-am', 'par-day-may04', 'morning',   'Musée d''Orsay · impresionismo · ascensor disponible · reservar horario con anticipación (obligatorio abr–ago)', '€16 · reservar online', 0, 'visit', 'Musée d''Orsay'),
  ('par-may04-pm', 'par-day-may04', 'afternoon', 'Notre-Dame exterior (restauración, icónica igual) + Sainte-Chapelle · vitrales góticos · reservar skip-the-line', '€11 Sainte-Chapelle · reservar', 0, 'visit', 'Notre-Dame · Sainte-Chapelle'),
  ('par-may04-ev', 'par-day-may04', 'evening',   'Montmartre · funicular hasta Sacré-Cœur · vista de París al atardecer · Place du Tertre', 'gratis · funicular €2', 0, 'visit', 'Montmartre');

-- ─────────────────────────────────────────────────────
-- 5. ACTIVITIES — ROMA (4 días + salida)
-- ─────────────────────────────────────────────────────

-- May 5 · llegada desde PAR (mediodía)
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('rom-may05-am', 'rom-day-may05', 'morning',   'Vuelo PAR → FCO · llegada mediodía · check-in hotel', NULL, 0, 'transport', 'Vueling / EasyJet'),
  ('rom-may05-pm', 'rom-day-may05', 'afternoon', 'Pantheon (€5 recomendado) + Fontana di Trevi · circuito central a pie · calles planas', '€5 Pantheon', 0, 'visit', 'Pantheon · Trevi'),
  ('rom-may05-ev', 'rom-day-may05', 'evening',   'Trastevere · cena en trattoria local · barrio fotogénico con adoquines y hiedra', NULL, 0, 'visit', 'Trastevere');

-- May 6 · Colosseo
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('rom-may06-am', 'rom-day-may06', 'morning',   'Colosseo + Foro Romano + Palatino · entrada combinada · RESERVAR con 2+ semanas de anticipación · Metro B hasta Colosseo', '€18 · reservar online', 0, 'visit', 'Colosseo'),
  ('rom-may06-pm', 'rom-day-may06', 'afternoon', 'Barrio Monti · descanso · calles medievales · muchos lugares para sentarse', 'gratis', 0, 'visit', 'Rione Monti'),
  ('rom-may06-ev', 'rom-day-may06', 'evening',   'Cena en Monti o regreso al hotel · descanso necesario post-Colosseo', NULL, 0, 'visit', 'Roma');

-- May 7 · Vaticano
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('rom-may07-am', 'rom-day-may07', 'morning',   'Musei Vaticani + Capilla Sixtina · entrada timed 8:00 o 9:00 · RESERVAR con anticipación · Metro A hasta Ottaviano', '€22 · reservar online', 0, 'visit', 'Musei Vaticani'),
  ('rom-may07-pm', 'rom-day-may07', 'afternoon', 'Basílica de San Pedro + Plaza San Pedro (gratis) · almuerzo en Prati · barrio tranquilo junto al Vaticano', 'gratis basílica', 0, 'visit', 'San Pietro · Prati'),
  ('rom-may07-ev', 'rom-day-may07', 'evening',   'Regreso a Trastevere · última cena en el barrio o Pigneto', NULL, 0, 'visit', 'Trastevere');

-- May 8 · Borghese + despedida
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('rom-may08-am', 'rom-day-may08', 'morning',   'Galería Borghese · RESERVA OBLIGATORIA (se agota rápido) · visita guiada 2h · turno 9:00 o 11:00 · Metro A hasta Spagna + taxi corto', '€18 + €2 reserva · reservar 10+ días antes', 0, 'visit', 'Galleria Borghese'),
  ('rom-may08-pm', 'rom-day-may08', 'afternoon', 'Villa Borghese · jardines con senderos planos y sombra · Piazza del Popolo · Piazza di Spagna exterior', 'gratis', 0, 'visit', 'Villa Borghese'),
  ('rom-may08-ev', 'rom-day-may08', 'evening',   'Cena de despedida en Roma · Ghetto Ebraico o Campo de'' Fiori · último paseo nocturno', NULL, 0, 'visit', 'Roma');

-- May 9 · salida
INSERT INTO activities (id, day_id, time_slot, description, cost_hint, confirmed, tipo, tag) VALUES
  ('rom-may09-am', 'rom-day-may09', 'morning',   'Mañana libre · desayuno en el barrio · actividad pendiente si queda algo', NULL, 0, 'visit', 'Roma'),
  ('rom-may09-pm', 'rom-day-may09', 'afternoon', 'Transfer al aeropuerto FCO · salida desde hotel ~16:00–16:30 · Leonardo Express o taxi (~45 min)', '€14 tren / €50 taxi', 0, 'transport', 'FCO · IB0656');
