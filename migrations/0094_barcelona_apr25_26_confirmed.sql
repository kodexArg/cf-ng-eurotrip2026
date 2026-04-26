-- 0094_barcelona_apr25_26_confirmed.sql
-- Confirma eventos reales de Barcelona 25-26 abril 2026.
--
-- Cambios:
--   1. Vie 25: Bus Turístico tarde + shopping mañana + Font Màgica 21:00 → confirmed=1
--   2. Dom 26: Park Güell 13:15-15:00 → confirmed=1, ajustar horarios
--   3. Dom 26: Catamarán Mediterráneo 16:30 → INSERT nuevo evento confirmed=1
--   4. Dom 26: Ajustar horarios del día para acomodar Park Güell y Catamarán

-- ─────────────────────────────────────────────────────────────────────
-- PART 1: Sáb 25 abr — Confirmar Bus Turístico, shopping, Font Màgica
-- ─────────────────────────────────────────────────────────────────────

-- Shopping mañana (no existía como evento, lo insertamos)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, origin_lat, origin_lon) VALUES
('ev-bcn-apr25-shopping', 'hito', 'compras', 'bcn-shopping-20260425',
 'Shopping Barcelona centro',
 'Compras por centro de Barcelona antes del mediodía. Passeig de Gràcia, Portal de l\'Àngel, El Corte Inglés.',
 '2026-04-25', '2026-04-25T09:00:00+02:00', '2026-04-25T12:00:00+02:00', 'bcn', 0.00, 'compras', 1, 'both', 41.3870, 2.1700);

-- Bus Turístico tarde (confirmado)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, origin_lat, origin_lon) VALUES
('ev-bcn-apr25-bus-turistico', 'hito', 'visit', 'bcn-bus-turistico-20260425',
 'Bus Turístico Barcelona',
 'Bus Turístico Barcelona, ruta por la tarde. Recorrido panorámico por los principales monumentos de la ciudad.',
 '2026-04-25', '2026-04-25T15:00:00+02:00', '2026-04-25T18:00:00+02:00', 'bcn', 0.00, 'colectivo', 1, 'both', 41.3870, 2.1700);

-- Font Màgica confirmada (ya existe, actualizar confirmed y horario a 21:00)
UPDATE events
SET confirmed = 1, timestamp_in = '2026-04-25T21:00:00+02:00', timestamp_out = '2026-04-25T22:00:00+02:00'
WHERE id = 'ev-bcn-apr25-font-magica';

-- ─────────────────────────────────────────────────────────────────────
-- PART 2: Dom 26 abr — Confirmar Park Güell, insertar Catamarán
-- ─────────────────────────────────────────────────────────────────────

-- Park Güell: ya estaba en el plan como confirmado, ajustar horarios reales
-- (Park Güell no estaba en 0089, buscar si existe en otra migración)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, origin_lat, origin_lon) VALUES
('ev-bcn-apr26-park-guell', 'hito', 'visit', 'bcn-park-guell-20260426',
 'Park Güell (Gaudí)',
 'Park Güell, obra maestra de Gaudí. Entrada ya pagada. Zona monumental + terraza serpiente + mosaicos.',
 '2026-04-26', '2026-04-26T13:15:00+02:00', '2026-04-26T15:00:00+02:00', 'bcn', 0.00, 'parque', 1, 'both', 41.4145, 2.1527);

-- Catamarán Mediterráneo (nuevo, confirmado)
INSERT INTO events (id, type, subtype, slug, title, description, date, timestamp_in, timestamp_out, city_in, usd, icon, confirmed, variant, origin_lat, origin_lon) VALUES
('ev-bcn-apr26-catamaran', 'hito', 'leisure', 'bcn-catamaran-20260426',
 'Catamarán Mediterráneo',
 'Paseo en catamarán por el Mediterráneo, rumbo sur desde Barcelona. Vistas al skyline costero.',
 '2026-04-26', '2026-04-26T16:30:00+02:00', '2026-04-26T18:00:00+02:00', 'bcn', 0.00, 'vela', 1, 'both', 41.3720, 2.1830);

-- Ajustar eventos del Dom 26 que chocan con los nuevos horarios
-- Bunkers: mover a después del catamarán
UPDATE events
SET timestamp_in = '2026-04-26T18:30:00+02:00', timestamp_out = '2026-04-26T21:30:00+02:00'
WHERE id = 'ev-bcn-apr26-bunkers';

-- Casa Vicens: mover a mañana antes de Park Güell
UPDATE events
SET timestamp_in = '2026-04-26T11:00:00+02:00', timestamp_out = '2026-04-26T11:15:00+02:00'
WHERE id = 'ev-bcn-apr26-casa-vicens-ext';

-- Lunch La Pubilla: mover a antes de Park Güell
UPDATE events
SET timestamp_in = '2026-04-26T11:30:00+02:00', timestamp_out = '2026-04-26T12:30:00+02:00'
WHERE id = 'ev-bcn-apr26-lunch-pubilla';

-- Vermut Gràcia: ajustar horario
UPDATE events
SET timestamp_in = '2026-04-26T15:15:00+02:00', timestamp_out = '2026-04-26T16:00:00+02:00'
WHERE id = 'ev-bcn-apr26-vermut-gracia';
